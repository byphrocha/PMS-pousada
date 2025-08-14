import RoomRepository from '../repositories/RoomRepository';

export default {
  list() {
    return RoomRepository.findAll();
  },

  get(id: number) {
    return RoomRepository.findById(id);
  },

  create(data: any) {
    // regras de negócio adicionais aqui
    return RoomRepository.create(data);
  },

  update(id: number, data: any) {
    // validações…
    return RoomRepository.update(id, data);
  },

  delete(id: number) {
    return RoomRepository.remove(id);
  }
};