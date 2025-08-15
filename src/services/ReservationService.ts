import db from '../models';
import ReservationRepository from '../repositories/ReservationRepository';

export default {
  listAll() {
    return ReservationRepository.findAll();
  },

  findById(id: number) {
    return ReservationRepository.findById(id);
  },

  async create(data: any) {
    return db.sequelize.transaction(async (t) => {
      const overlap = await ReservationRepository.countOverlap(
        data.roomId,
        data.checkIn,
        data.checkOut,
        t
      );
      if (overlap) {
        const err: any = new Error('Quarto indisponível');
        err.status = 409;
        throw err;
      }
      return ReservationRepository.create(data, t);
    });
  },

  async update(id: number, data: any) {
    return db.sequelize.transaction((t) =>
      ReservationRepository.update(id, data, t)
    );
  },

  async remove(id: number) {
    return db.sequelize.transaction((t) =>
      ReservationRepository.remove(id, t)
    );
  }
};