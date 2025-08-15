import db from '../models';
import { Transaction } from 'sequelize';

export default {
  findAll() {
    return db.Customer.findAll();
  },

  findById(id: number) {
    return db.Customer.findByPk(id);
  },

  create(data: any, t?: Transaction) {
    return db.Customer.create(data, { transaction: t });
  },

  update(id: number, data: any, t?: Transaction) {
    return db.Customer.update(data, { where: { id }, transaction: t });
  },

  remove(id: number, t?: Transaction) {
    return db.Customer.destroy({ where: { id }, transaction: t });
  }
};