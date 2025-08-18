import RoomService from '../../src/services/RoomService';
import RoomRepository from '../../src/repositories/RoomRepository';

// Mock do repositório
jest.mock('../../src/repositories/RoomRepository');

describe('RoomService', () => {
  afterEach(() => jest.clearAllMocks());

  it('listAll deve retornar lista de quartos', async () => {
    const mockRooms = [{ id: 1, name: '101' }];
    (RoomRepository.findAll as jest.Mock).mockResolvedValue(mockRooms);

    const result = await RoomService.listAll();
    expect(result).toEqual(mockRooms);
    expect(RoomRepository.findAll).toHaveBeenCalledTimes(1);
  });
});