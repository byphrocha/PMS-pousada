import db from '../models';
import PaymentRepository from '../repositories/PaymentRepository';

export default {
  listAll() {
    return PaymentRepository.findAll();
  },

  findById(id: number) {
    return PaymentRepository.findById(id);
  },

  async create(data: any) {
    // Exemplo de validação
    if (data.amount <= 0) {
      const err: any = new Error('Valor inválido');
      err.status = 400;
      throw err;
    }
    return db.sequelize.transaction((t) =>
      PaymentRepository.create(data, t)
    );
  },

  async update(id: number, data: any) {
    return db.sequelize.transaction((t) =>
      PaymentRepository.update(id, data, t)
    );
  },

  async remove(id: number) {
    return db.sequelize.transaction((t) =>
      PaymentRepository.remove(id, t)
    );
  }
};