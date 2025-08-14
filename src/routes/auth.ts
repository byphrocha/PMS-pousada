import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from '../models';

const router = Router();

/**
 * POST /auth/login
 * Body: { email, password }
 */
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await db.User.findOne({ where: { email } });
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Senha inválida' });

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
    expiresIn: '8h'
  });

  return res.json({ token });
});

/**
 * POST /auth/register
 * Body: { name, email, password }
 */
router.post('/register', async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  const created = await db.User.create({ name, email, password: hash });
  return res.status(201).json(created);
});

export default router;