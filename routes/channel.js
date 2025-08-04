const router = require('express').Router();
const ical   = require('node-ical');
const { Reservation, Room, Customer } = require('../models');
const { authenticate, checkRole } = require('../utils/auth');

/**
 * POST /channel/import
 * Body JSON: { source: "booking" | "airbnb", url: "<ical_url>", roomId: 1 }
 * Apenas admin e recepção.
 */
router.post('/import', authenticate, checkRole(['admin','reception']), async (req, res) => {
  const { source, url, roomId } = req.body;
  if (!source || !url || !roomId) {
    return res.status(400).json({ error: 'source, url e roomId são obrigatórios' });
  }

  try {
    // 1) Baixa e parseia o iCal
    const data = await ical.async.fromURL(url);

    // 2) Itera sobre cada evento
    const promises = Object.values(data).map(async (ev) => {
      if (ev.type !== 'VEVENT') return;

      const checkIn  = ev.start.toISOString().slice(0,10);
      const checkOut = ev.end.toISOString().slice(0,10);

      // Booking/Airbnb colocam o nome do hóspede no campo summary ou description
      let guestName = 'Hóspede';

        // ) Booking.com: descrição costuma ter "Guest name: John Doe"
        if (ev.description) {
          const match = ev.description.match(/Guest name:\s*(.+)/i);
          if (match) guestName = match[1].trim();
        }

        // ) Airbnb: summary já traz o nome
        if (ev.summary && ev.summary !== 'CLOSED - Not available') {
          guestName = ev.summary.trim();
        }

        // ) Fallback
        if (!guestName) guestName = 'Hóspede';

      // 3) Cria cliente “genérico” se necessário
      let customer = await Customer.findOne({ where: { email: `${guestName}@${source}.local` } });
      if (!customer) {
        customer = await Customer.create({
          name: guestName,
          email: `${guestName}@${source}.local`,
          phone: '',
          document: ''
        });
      }

      // 4) Verifica se já existe reserva com mesmo período (para evitar duplicar)
      const exists = await Reservation.findOne({
        where: { RoomId: roomId, checkIn, checkOut, source }
      });
      if (exists) return;

      // 5) Cria reserva
      await Reservation.create({
        guestName,
        guestEmail: customer.email,
        guestPhone: '',
        checkIn,
        checkOut,
        status: 'booked',
        source,
        RoomId: roomId,
        CustomerId: customer.id
      });
    });

    await Promise.all(promises);
    res.json({ imported: promises.length });
  } catch (err) {
    console.error('Erro importação iCal', err);
    res.status(500).json({ error: 'Falha ao importar calendário' });
  }
});

module.exports = router;