import db from '../models';

export default {
  async findAll() {
    return db.Room.findAll();
  },

  async findById(id: number) {
    return db.Room.findByPk(id);
  },

  async create(data: any) {
    return db.Room.create(data);
  },

  async update(id: number, data: any) {
    await db.Room.update(data, { where: { id } });
    return db.Room.findByPk(id);
  },

  async remove(id: number) {
    return db.Room.destroy({ where: { id } });
  }
};