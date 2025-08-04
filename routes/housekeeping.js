const router = require('express').Router();
const { Room } = require('../models');

// Lista quartos que precisam de limpeza (dirty ou maintenance)
router.get('/tasks', async (_, res) => {
  const rooms = await Room.findAll({
    where: { cleaningStatus: ['dirty', 'maintenance'] },
    order: [['cleaningStatus', 'ASC']]
  });
  res.json(rooms);
});

// Marcar quarto como limpo
router.put('/:id/clean', async (req, res) => {
  await Room.update(
    { cleaningStatus: 'clean' },
    { where: { id: req.params.id } }
  );
  res.sendStatus(204);
});

// Marcar quarto como sujo (ex.: após check‑out)
router.put('/:id/dirty', async (req, res) => {
  await Room.update(
    { cleaningStatus: 'dirty' },
    { where: { id: req.params.id } }
  );
  res.sendStatus(204);
});

module.exports = router;