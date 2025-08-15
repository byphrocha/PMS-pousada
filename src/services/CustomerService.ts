import db from '../models';
import CustomerRepository from '../repositories/CustomerRepository';

export default {
  listAll() {
    return CustomerRepository.findAll();
  },

  findById(id: number) {
    return CustomerRepository.findById(id);
  },

  async create(data: any) {
    return db.sequelize.transaction((t) =>
      CustomerRepository.create(data, t)
    );
  },

  async update(id: number, data: any) {
    return db.sequelize.transaction((t) =>
      CustomerRepository.update(id, data, t)
    );
  },

  async remove(id: number) {
    return db.sequelize.transaction((t) =>
      CustomerRepository.remove(id, t)
    );
  }
};