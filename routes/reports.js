const router = require('express').Router();
const { Op } = require('sequelize');
const { Room, Reservation, Payment } = require('../models');
const { authenticate, checkRole } = require('../utils/auth');

// Gera array de dias entre duas datas
function eachDay(start, end) {
  const arr = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    arr.push(new Date(d));
  }
  return arr;
}

// ---- Ocupação diária ----
router.get('/occupancy', authenticate, checkRole(['admin', 'reception']), async (req, res) => {
  const { from, to } = req.query;
  if (!from || !to) return res.status(400).json({ error: 'from e to obrigatórios' });

  const totalRooms = await Room.count();
  const days = eachDay(new Date(from), new Date(to));
  const result = [];

  for (const day of days) {
    const next = new Date(day);
    next.setDate(next.getDate() + 1);

    const occupied = await Reservation.count({
      where: {
        [Op.and]: [
          { checkIn:  { [Op.lt]: next } },
          { checkOut: { [Op.gt]: day } },
          { status:   { [Op.not]: 'cancelled' } }
        ]
      }
    });

    result.push({
      date: day.toISOString().slice(0,10),
      occupied,
      total: totalRooms,
      percent: totalRooms ? Math.round((occupied / totalRooms) * 100) : 0
    });
  }

  res.json(result);
});

// ---- Faturamento ----
router.get('/revenue', authenticate, checkRole(['admin', 'reception']), async (req, res) => {
  const { from, to } = req.query;
  if (!from || !to) return res.status(400).json({ error: 'from e to obrigatórios' });

  const payments = await Payment.findAll({
    where: { paidAt: { [Op.between]: [new Date(from), new Date(to)] } },
    attributes: [
      'method',
      [Payment.sequelize.fn('SUM', Payment.sequelize.col('amount')), 'total']
    ],
    group: ['method']
  });

  const total = payments.reduce((s, p) => s + parseFloat(p.get('total')), 0);
  res.json({ total, breakdown: payments });
});

module.exports = router;