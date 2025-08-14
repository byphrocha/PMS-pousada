import { Router, Request, Response } from 'express';
import db from '../models';

const router = Router();

/** GET /reservations */
router.get('/', async (_req: Request, res: Response) => {
  const list = await db.Reservation.findAll({
    include: [db.Room, db.Customer]
  });
  return res.json(list);
});

/** POST /reservations */
router.post('/', async (req: Request, res: Response) => {
  const created = await db.Reservation.create(req.body);
  return res.status(201).json(created);
});

/** PUT /reservations/:id */
router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  await db.Reservation.update(req.body, { where: { id } });
  const updated = await db.Reservation.findByPk(id);
  return res.json(updated);
});

/** DELETE /reservations/:id */
router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  await db.Reservation.destroy({ where: { id } });
  return res.status(204).send();
});

export default router;