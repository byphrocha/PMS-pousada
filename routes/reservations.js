const router = require('express').Router();
const { Reservation, Room } = require('../models');

// Lista todas as reservas
router.get('/', async (_, res) => {
  const data = await Reservation.findAll({ include: Room });
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

// Check‑in
router.put('/:id/checkin', async (req, res) => {
  await Reservation.update(
    { status: 'checked_in', actualCheckIn: new Date() },
    { where: { id: req.params.id } }
  );
  res.sendStatus(204);
});

// Check‑out
router.put('/:id/checkout', async (req, res) => {
  // 1) Atualiza status da reserva
  await Reservation.update(
    { status: 'checked_out', actualCheckOut: new Date() },
    { where: { id: req.params.id } }
  );

  // 2) Busca a reserva para descobrir o quarto
  const reserva = await Reservation.findByPk(req.params.id);

  // 3) Marca o quarto como sujo
  if (reserva) {
    await Room.update(
      { cleaningStatus: 'dirty' },
      { where: { id: reserva.RoomId } }
    );
  }

  res.sendStatus(204);
});