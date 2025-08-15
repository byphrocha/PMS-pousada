import { Request, Response, NextFunction } from 'express';
import PaymentService from '../services/PaymentService';

export default class PaymentController {
  static async index(_req: Request, res: Response, next: NextFunction) {
    try {
      const list = await PaymentService.listAll();
      res.json(list);
    } catch (err) {
      next(err);
    }
  }

  static async show(req: Request, res: Response, next: NextFunction) {
    try {
      const p = await PaymentService.findById(Number(req.params.id));
      if (!p) return res.status(404).json({ error: 'Pagamento não encontrado' });
      res.json(p);
    } catch (err) {
      next(err);
    }
  }

  static async store(req: Request, res: Response, next: NextFunction) {
    try {
      const created = await PaymentService.create(req.body);
      res.status(201).json(created);
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      await PaymentService.update(Number(req.params.id), req.body);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

  static async destroy(req: Request, res: Response, next: NextFunction) {
    try {
      await PaymentService.remove(Number(req.params.id));
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}