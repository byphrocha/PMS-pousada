import { Router, Request, Response } from 'express';
import db from '../models';

const router = Router();

/** GET /payments */
router.get('/', async (_req: Request, res: Response) => {
  const payments = await db.Payment.findAll({ include: [db.Reservation] });
  return res.json(payments);
});

/** POST /payments */
router.post('/', async (req: Request, res: Response) => {
  const created = await db.Payment.create(req.body);
  return res.status(201).json(created);
});

export default router;