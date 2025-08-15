import { Request, Response, NextFunction } from 'express';
import ReservationService from '../services/ReservationService';

export default class ReservationController {
  static async index(_req: Request, res: Response, next: NextFunction) {
    try {
      const list = await ReservationService.listAll();
      res.json(list);
    } catch (err) {
      next(err);
    }
  }

  static async show(req: Request, res: Response, next: NextFunction) {
    try {
      const r = await ReservationService.findById(Number(req.params.id));
      if (!r) return res.status(404).json({ error: 'Reserva não encontrada' });
      res.json(r);
    } catch (err) {
      next(err);
    }
  }

  static async store(req: Request, res: Response, next: NextFunction) {
    try {
      const created = await ReservationService.create(req.body);
      res.status(201).json(created);
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      await ReservationService.update(Number(req.params.id), req.body);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

  static async destroy(req: Request, res: Response, next: NextFunction) {
    try {
      await ReservationService.remove(Number(req.params.id));
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}