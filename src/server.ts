import 'dotenv/config';
import path from 'path';
import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import csurf from 'csurf';

import apiRouter from './routes/apiRouter';          // Hub de rotas JSON (/api)
import roomsPagesRoutes from './routes/roomsPages';
import roomsRoutes from './routes/rooms';
import reservationsRoutes from './routes/reservations';
import customersRoutes from './routes/customers';
import paymentsRoutes from './routes/payments';
import  errorHandler  from './middlewares/errorHandler';

import db from './models';
import { Op } from 'sequelize';

const { Room, Reservation, Customer, Payment } = db;

/* -------------------------------------------------------------------------- */
/* 1. App & Middlewares globais                                               */
/* -------------------------------------------------------------------------- */
const app = express();

/* ---- Logs rápidos para confirmar tipos (podem ser removidos depois) ---- */
console.log('/api           typeof:', typeof apiRouter);
console.log('/api/rooms     typeof:', typeof roomsRoutes);
console.log('/api/reservations typeof:', typeof reservationsRoutes);
console.log('/api/customers typeof:', typeof customersRoutes);
console.log('/api/payments  typeof:', typeof paymentsRoutes);
console.log('/roomsPages    typeof:', typeof roomsPagesRoutes);

/* ---------- Segurança (Helmet + CSP) ---------- */
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          'https://cdn.jsdelivr.net',
          'https://cdnjs.cloudflare.com',
          "'unsafe-inline'"
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          'https://cdn.jsdelivr.net',
          'https://fonts.googleapis.com'
        ],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'blob:'],
        connectSrc: ["'self'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: []
      }
    },
    crossOriginEmbedderPolicy: false
  })
);

/* ---------- Rate‑limit ---------- */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
});
app.use(limiter);

/* ---------- CORS restritivo ---------- */
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(',') || ['https://pousada.com'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true
  })
);

/* ---------- Middlewares básicos ---------- */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

/* ---------- Cookies & CSRF (somente páginas HTML) ---------- */
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use(
  csurf({
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    },
    ignoreMethods: ['GET', 'HEAD', 'OPTIONS'], // permite chamadas GET sem token
    value: (req: Request) =>
      (req.cookies && req.cookies['csrf-token']) ||
      (req.headers['csrf-token'] as string | undefined)
  })
);

// expõe token CSRF nas views EJS
app.use((req: Request, res: Response, next: NextFunction) => {
  const tokenGetter = (req as any).csrfToken;
  if (typeof tokenGetter === 'function') {
    res.locals.csrfToken = tokenGetter();
  }
  next();
});

/* ---------- View engine ---------- */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/* -------------------------------------------------------------------------- */
/* 2. Rotas de API (JSON) – prefixo /api                                      */
/* -------------------------------------------------------------------------- */
app.use('/api', apiRouter);               // /api/auth, /api/channel, etc.
app.use('/api/rooms',        roomsRoutes);
app.use('/api/reservations', reservationsRoutes);
app.use('/api/customers',    customersRoutes);
app.use('/api/payments',     paymentsRoutes);
app.use(errorHandler);

/* -------------------------------------------------------------------------- */
/* 3. Rotas de Página (HTML)                                                  */
/* -------------------------------------------------------------------------- */
app.get('/', async (_req, res) => {
  const totalRooms = await Room.count();
  const occupied = await Room.count({
    where: { status: { [Op.ne]: 'available' } }
  });
  res.render('index', { title: 'Dashboard', totalRooms, occupied });
});

app.get('/rooms', async (_req, res) => {
  const rooms = await Room.findAll();
  res.render('rooms', { title: 'Quartos', rooms });
});

app.get('/reservations', async (_req, res) => {
  const reservations = await Reservation.findAll({
    include: [Room],
    order: [['checkIn', 'ASC']]
  });
  res.render('reservations', { title: 'Reservas', reservations });
});

app.get('/customers', async (_req, res) => {
  const customers = await Customer.findAll();
  res.render('customers', { title: 'Clientes', customers });
});

app.get('/payments', async (_req, res) => {
  const payments = await Payment.findAll();
  res.render('payments', { title: 'Pagamentos', payments });
});

app.get('/housekeeping', async (_req, res) => {
  const tasks = await Room.findAll({
    where: { cleaningStatus: { [Op.ne]: 'clean' } },
    order: [['name', 'ASC']]
  });
  res.render('housekeeping', { title: 'Limpeza', tasks });
});

app.get('/reports', (_req, res) =>
  res.render('reports', { title: 'Relatórios' })
);
app.get('/login', (_req, res) => res.render('login', { title: 'Login' }));

/* Formulários NEW / EDIT de quartos (páginas) */
app.use('/rooms', roomsPagesRoutes);

app.use(errorHandler);
/* -------------------------------------------------------------------------- */
/* 4. Middleware 404                                                          */
/* -------------------------------------------------------------------------- */
app.use((_req, res) =>
  res.status(404).render('errors/404', { title: '404' })
);

/* -------------------------------------------------------------------------- */
/* 5. Inicialização do servidor                                               */
/* -------------------------------------------------------------------------- */
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(PORT, () =>
  console.log(`Servidor rodando em http://localhost:${PORT}`)
);