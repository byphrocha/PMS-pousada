/* server.js */
const express        = require('express');
const bodyParser     = require('body-parser');
const cors           = require('cors');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
const { Op } = require('sequelize');

const { Room, Reservation, Customer, Payment } = require('./models');

const app = express();

/* ===== Configurações de view ===== */
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/main');
app.use(expressLayouts);

/* ===== Middlewares globais ===== */
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(methodOverride('_method'));

/* ===== Rotas de PÁGINA ===== */
app.use('/rooms', require('./routes/roomsPages'));

/* ===== Rotas de API ===== */
app.use('/api/rooms',        require('./routes/rooms'));
app.use('/api/reservations', require('./routes/reservations'));
app.use('/api/customers',    require('./routes/customers'));
app.use('/api/payments',     require('./routes/payments'));
app.use('/api/housekeeping', require('./routes/housekeeping'));

/* ===== Dashboard e outras páginas ===== */
app.get('/', async (req, res) => {
  const totalRooms = await Room.count();
  const occupied   = await Room.count({ where: { status: { [Op.ne]: 'available' } } });
  res.render('index', { title: 'Dashboard', totalRooms, occupied });
});

app.get('/reservations', async (req, res) => {
  const reservations = await Reservation.findAll({ include: Room, order: [['checkIn', 'ASC']] });
  res.render('reservations', { title: 'Reservas', reservations });
});

app.get('/customers', async (req, res) => {
  const customers = await Customer.findAll();
  res.render('customers', { title: 'Clientes', customers });
});

app.get('/payments', async (req, res) => {
  const payments = await Payment.findAll();
  res.render('payments', { title: 'Pagamentos', payments });
});

app.get('/housekeeping', async (req, res) => {
  const tasks = await Room.findAll({
    where: { cleaningStatus: { [Op.ne]: 'clean' } },
    order: [['name', 'ASC']]
  });
  res.render('housekeeping', { title: 'Limpeza', tasks });
});

app.get('/reports', (req, res) => res.render('reports', { title: 'Relatórios' }));
app.get('/login',   (req, res) => res.render('login',   { title: 'Login' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));