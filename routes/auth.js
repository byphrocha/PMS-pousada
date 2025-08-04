const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { generateToken, authenticate, checkRole } = require('../utils/auth');

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(401).json({ error: 'Credenciais inválidas' });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Credenciais inválidas' });

  const token = generateToken({ id: user.id, role: user.role, name: user.name });
  res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
});

// Cadastro de usuário (apenas admin)
router.post('/register', authenticate, checkRole(['admin']), async (req, res) => {
  const { name, email, password, role } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const novo = await User.create({ name, email, passwordHash: hash, role });
  res.status(201).json({ id: novo.id, name: novo.name, email: novo.email, role: novo.role });
});

module.exports = router;