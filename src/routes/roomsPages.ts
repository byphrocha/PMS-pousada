import { Router, Request, Response } from 'express';
import db from '../models';

const router = Router();

/** GET /rooms-pages/:roomId */
router.get('/:roomId', async (req: Request, res: Response) => {
  const { roomId } = req.params;
  const room = await db.Room.findByPk(roomId, {
    include: [db.Reservation]
  });
  if (!room) return res.status(404).json({ error: 'Quarto não encontrado' });
  return res.render('roomPage', { room }); // se usar EJS/Pug
});

export default router;