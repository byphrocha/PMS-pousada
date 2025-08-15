import db from '../models';
import { Transaction } from 'sequelize';

export default {
  findAll() {
    return db.Payment.findAll({ include: [db.Reservation] });
  },

  findById(id: number) {
    return db.Payment.findByPk(id, { include: [db.Reservation] });
  },

  create(data: any, t?: Transaction) {
    return db.Payment.create(data, { transaction: t });
  },

  update(id: number, data: any, t?: Transaction) {
    return db.Payment.update(data, { where: { id }, transaction: t });
  },

  remove(id: number, t?: Transaction) {
    return db.Payment.destroy({ where: { id }, transaction: t });
  }
};