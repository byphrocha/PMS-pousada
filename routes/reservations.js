/* routes/reservations.js */
const router = require('express').Router();
const { Reservation, Room } = require('../models');

// Lista todas as reservas ordenadas por data de check‑in
// routes/reservations.js
router.get('/', async (_, res) => {
  const data = await Reservation.findAll({
    include: Room,
    order: [['checkIn', 'ASC']]   // ← altere para 'checkIn'
  });
  res.json(data);
});

// Detalhe
router.get('/:id', async (req, res) => {
  const reserva = await Reservation.findByPk(req.params.id, { include: Room });
  if (!reserva) return res.sendStatus(404);
  res.json(reserva);
});

// Cria
router.post('/', async (req, res) => {
  const reserva = await Reservation.create(req.body);
  res.status(201).json(reserva);
});

// Atualiza
router.put('/:id', async (req, res) => {
  await Reservation.update(req.body, { where: { id: req.params.id } });
  res.sendStatus(204);
});

// Remove
router.delete('/:id', async (req, res) => {
  await Reservation.destroy({ where: { id: req.params.id } });
  res.sendStatus(204);
});

module.exports = router;