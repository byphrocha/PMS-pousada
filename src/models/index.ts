import { Sequelize, DataTypes } from 'sequelize';

// 1. Instância do Sequelize
export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false
});

// 2. Importação das fábricas de modelo (ainda em JS? tudo bem)
import RoomFactory from './room';
import ReservationFactory from './reservation';
import CustomerFactory from './customer';
import PaymentFactory from './payments';
import UserFactory from './user';

// 3. Criação dos modelos
const Room        = RoomFactory(sequelize, DataTypes);
const Reservation = ReservationFactory(sequelize, DataTypes);
const Customer    = CustomerFactory(sequelize, DataTypes);
const Payment     = PaymentFactory(sequelize, DataTypes);
const User        = UserFactory(sequelize, DataTypes);

// 4. Relacionamentos
Room.hasMany(Reservation);
Reservation.belongsTo(Room);

Customer.hasMany(Reservation);
Reservation.belongsTo(Customer);

Reservation.hasMany(Payment);
Payment.belongsTo(Reservation);

// 5. Exportar objeto db (default)
const db = {
  sequelize,
  Sequelize,          // <‑‑ ADICIONAR
  Room,
  Reservation,
  Customer,
  Payment,
  User
};

export default db;