import db from '../models';
import { Transaction } from 'sequelize';

export default {
  /* ------------------------------------------------------------------ */
  /* READ                                                               */
  /* ------------------------------------------------------------------ */
  findAll() {
    return db.Room.findAll();
  },

  findById(id: number) {
    return db.Room.findByPk(id);
  },

  /* ------------------------------------------------------------------ */
  /* CREATE                                                             */
  /* ------------------------------------------------------------------ */
  create(data: any, t?: Transaction) {
    return db.Room.create(data, { transaction: t });
  },

  /* ------------------------------------------------------------------ */
  /* UPDATE                                                             */
  /* ------------------------------------------------------------------ */
  update(id: number, data: any, t?: Transaction) {
    return db.Room.update(data, { where: { id }, transaction: t });
  },

  /* ------------------------------------------------------------------ */
  /* DELETE                                                             */
  /* ------------------------------------------------------------------ */
  remove(id: number, t?: Transaction) {
    return db.Room.destroy({ where: { id }, transaction: t });
  }
};