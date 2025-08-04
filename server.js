/* ===== DEPENDÊNCIAS ===== */
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const expressLayouts = require('express-ejs-layouts');
const { Op } = require('sequelize');

/* ===== MODELOS ===== */
const { Room, Reservation, Customer, Payment } = require('./models');

/* ===== APP ===== */
const app = express();

/* --- Configurações de view --- */
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/main');
app.use(expressLayouts);

/* --- Middlewares globais --- */
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

/* =========================================================
   ROTAS DE PÁGINA (HTML) – vêm ANTES das rotas de API
   ========================================================= */
app.get('/', async (req, res) => {
  const totalRooms = await Room.count();
  const occupied = await Room.count({
    where: { status: { [Op.ne]: 'available' } }
  });
  res.render('index', { title: 'Dashboard', totalRooms, occupied });
});

app.get('/rooms', async (req, res) => {
  const rooms = await Room.findAll();
  res.render('rooms', { title: 'Quartos', rooms });
});

app.get('/reservations', async (req, res) => {
  const reservations = await Reservation.findAll({ include: Room });
  res.render('reservations', { title: 'Reservas', reservations });
});

app.get('/customers', async (req, res) => {
  const customers = await Customer.findAll();
  res.render('customers', { title: 'Clientes', customers });
});

app.get('/payments', async (req, res) => {
  const payments = await Payment.findAll();          // sem include p/ evitar erro
  res.render('payments', { title: 'Pagamentos', payments });
});

app.get('/reports', (req, res) => {
  res.render('reports', { title: 'Relatórios' });
});

app.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

/* =========================================================
   ROTAS DE API (JSON) – agora sob prefixo /api
   ========================================================= */
app.use('/api/rooms', require('./routes/rooms'));
app.use('/api/reservations', require('./routes/reservations'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/payments', require('./routes/payments'));

/* ===== SERVIDOR ===== */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));