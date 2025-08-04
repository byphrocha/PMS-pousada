const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false
});

const Room        = require('./room')(sequelize, DataTypes);
const Reservation = require('./reservation')(sequelize, DataTypes);
const Customer    = require('./customer')(sequelize, DataTypes);
const Payment     = require('./payments')(sequelize, DataTypes);
const User        = require('./user')(sequelize, DataTypes);

// Relacionamentos
Room.hasMany(Reservation);
Reservation.belongsTo(Room);

Customer.hasMany(Reservation);
Reservation.belongsTo(Customer);

Reservation.hasMany(Payment);
Payment.belongsTo(Reservation);

// Exporte TUDO em um único objeto
module.exports = { sequelize, Room, Reservation, Customer, Payment, User };