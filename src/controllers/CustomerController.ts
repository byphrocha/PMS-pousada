import { Request, Response, NextFunction } from 'express';
import CustomerService from '../services/CustomerService';

export default class CustomerController {
  static async index(_req: Request, res: Response, next: NextFunction) {
    try {
      const list = await CustomerService.listAll();
      res.json(list);
    } catch (err) {
      next(err);
    }
  }

  static async show(req: Request, res: Response, next: NextFunction) {
    try {
      const c = await CustomerService.findById(Number(req.params.id));
      if (!c) return res.status(404).json({ error: 'Cliente não encontrado' });
      res.json(c);
    } catch (err) {
      next(err);
    }
  }

  static async store(req: Request, res: Response, next: NextFunction) {
    try {
      const created = await CustomerService.create(req.body);
      res.status(201).json(created);
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      await CustomerService.update(Number(req.params.id), req.body);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

  static async destroy(req: Request, res: Response, next: NextFunction) {
    try {
      await CustomerService.remove(Number(req.params.id));
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}