import { Router, Request, Response } from 'express';
import db from '../models';

const router = Router();

/** GET /customers */
router.get('/', async (_req: Request, res: Response) => {
  const list = await db.Customer.findAll();
  return res.json(list);
});

/** POST /customers */
router.post('/', async (req: Request, res: Response) => {
  const created = await db.Customer.create(req.body);
  return res.status(201).json(created);
});

/** PUT /customers/:id */
router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  await db.Customer.update(req.body, { where: { id } });
  const updated = await db.Customer.findByPk(id);
  return res.json(updated);
});

/** DELETE /customers/:id */
router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  await db.Customer.destroy({ where: { id } });
  return res.status(204).send();
});

export default router;