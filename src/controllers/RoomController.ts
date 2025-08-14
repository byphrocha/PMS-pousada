import { Request, Response, NextFunction } from 'express';
import RoomService from '../services/RoomService';

export default {
  async index(_req: Request, res: Response, next: NextFunction) {
    try {
      const rooms = await RoomService.list();
      res.json(rooms);
    } catch (err) {
      next(err);
    }
  },

  async show(req: Request, res: Response, next: NextFunction) {
    try {
      const room = await RoomService.get(Number(req.params.id));
      if (!room) return res.status(404).json({ error: 'Quarto não encontrado' });
      res.json(room);
    } catch (err) {
      next(err);
    }
  },

  async store(req: Request, res: Response, next: NextFunction) {
    try {
      const created = await RoomService.create(req.body);
      res.status(201).json(created);
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await RoomService.update(Number(req.params.id), req.body);
      res.json(updated);
    } catch (err) {
      next(err);
    }
  },

  async destroy(req: Request, res: Response, next: NextFunction) {
    try {
      await RoomService.delete(Number(req.params.id));
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
};