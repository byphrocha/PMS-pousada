import db from '../models';
import { Op, Transaction } from 'sequelize';

export default {
  findAll() {
    return db.Reservation.findAll({ include: [db.Room, db.Customer] });
  },

  findById(id: number) {
    return db.Reservation.findByPk(id, { include: [db.Room, db.Customer] });
  },

  countOverlap(roomId: number, checkIn: Date, checkOut: Date, t?: Transaction) {
    return db.Reservation.count({
      where: {
        roomId,
        [Op.or]: [
          { checkIn: { [Op.between]: [checkIn, checkOut] } },
          { checkOut: { [Op.between]: [checkIn, checkOut] } }
        ]
      },
      transaction: t
    });
  },

  create(data: any, t?: Transaction) {
    return db.Reservation.create(data, { transaction: t });
  },

  update(id: number, data: any, t?: Transaction) {
    return db.Reservation.update(data, { where: { id }, transaction: t });
  },

  remove(id: number, t?: Transaction) {
    return db.Reservation.destroy({ where: { id }, transaction: t });
  }
};