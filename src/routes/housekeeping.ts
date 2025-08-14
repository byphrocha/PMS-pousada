// import { Router, Request, Response } from 'express';
// import db from '../models';

// const router = Router();

// /** GET /housekeeping/tasks */
// router.get('/tasks', async (_req: Request, res: Response) => {
//   const tasks = await db.HousekeepingTask.findAll();
//   return res.json(tasks);
// });

// /** POST /housekeeping/tasks */
// router.post('/tasks', async (req: Request, res: Response) => {
//   const created = await db.HousekeepingTask.create(req.body);
//   return res.status(201).json(created);
// });

// /** PATCH /housekeeping/tasks/:id/done */
// router.patch('/tasks/:id/done', async (req: Request, res: Response) => {
//   const { id } = req.params;
//   await db.Housekeeping.update({ done: true }, { where: { id } });
//   return res.status(204).send();
// });

// export default router;
