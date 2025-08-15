import db from '../models';
import RoomRepository from '../repositories/RoomRepository';

export default {
  /* ------------------------------------------------------------------ */
  /* LISTAR TODOS                                                       */
  /* ------------------------------------------------------------------ */
  listAll() {
    return RoomRepository.findAll();
  },

  /* ------------------------------------------------------------------ */
  /* BUSCAR POR ID                                                      */
  /* ------------------------------------------------------------------ */
  findById(id: number) {
    return RoomRepository.findById(id);
  },

  /* ------------------------------------------------------------------ */
  /* CRIAR NOVO QUARTO                                                  */
  /* ------------------------------------------------------------------ */
  async create(data: any) {
    return db.sequelize.transaction((t) =>
      RoomRepository.create(data, t)
    );
  },

  /* ------------------------------------------------------------------ */
  /* ATUALIZAR QUARTO                                                   */
  /* ------------------------------------------------------------------ */
  async update(id: number, data: any) {
    return db.sequelize.transaction((t) =>
      RoomRepository.update(id, data, t)
    );
  },

  /* ------------------------------------------------------------------ */
  /* REMOVER QUARTO                                                     */
  /* ------------------------------------------------------------------ */
  async remove(id: number) {
    return db.sequelize.transaction((t) =>
      RoomRepository.remove(id, t)
    );
  }
};