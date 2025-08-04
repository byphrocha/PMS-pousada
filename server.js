const express = require('express');
const body    = require('body-parser');
const cors    = require('cors');
const { sequelize } = require('./models');

// Inicialização
const app = express();
app.use(cors());
app.use(body.json());
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});
app.use(express.static('public'));

// Rotas
app.use('/rooms',        require('./routes/rooms'));
app.use('/reservations', require('./routes/reservations'));
app.use('/customers',    require('./routes/customers'));
app.use('/auth', require('./routes/auth'));
app.use('/payments', require('./routes/payments'));
app.use('/reports', require('./routes/reports'));
app.use('/channel', require('./routes/channel'));

app.get('/health', (_, res) => res.json({ status: 'ok' }));

// Sincroniza DB e inicia servidor
sequelize.sync().then(() => {
  app.listen(3000, () =>
    console.log('API rodando em http://localhost:3000')
  );
});
// ...código já existente...
app.use('/reservations', require('./routes/reservations'));

// Página estática para teste rápido (opcional)
app.get('/reservas', (_, res) => res.sendFile(__dirname + '/public/reservations.html'));

app.use('/customers', require('./routes/customers'));

app.get('/clientes', (_, res) =>
  res.sendFile(__dirname + '/public/customers.html')
);

app.use('/housekeeping', require('./routes/housekeeping'));

app.get('/limpeza', (_, res) =>
  res.sendFile(__dirname + '/public/housekeeping.html')
);