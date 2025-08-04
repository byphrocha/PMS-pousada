const router = require('express').Router();
const { Payment, Reservation, Customer, Room } = require('../models');
const { authenticate, checkRole } = require('../utils/auth');
const PDFDocument = require('pdfkit');

// Listar pagamentos (admin + recepção)
router.get('/', authenticate, checkRole(['admin', 'reception']), async (_, res) => {
  const payments = await Payment.findAll({
    include: {
      model: Reservation,
      include: [Customer, Room]
    },
    order: [['paidAt', 'DESC']]
  });
  res.json(payments);
});

// Criar pagamento
router.post('/', authenticate, checkRole(['admin', 'reception']), async (req, res) => {
  try {
    const pagamento = await Payment.create(req.body);
    res.status(201).json(pagamento);
  } catch (err) {
    console.error('Erro POST /payments', err);
    res.status(500).json({ error: 'Falha ao registrar pagamento' });
  }
});

// Gerar recibo PDF
router.get('/:id/receipt', authenticate, checkRole(['admin', 'reception']), async (req, res) => {
  try {
    const pagamento = await Payment.findByPk(req.params.id, {
      include: {
        model: Reservation,
        include: [Customer, Room]
      }
    });
    if (!pagamento) return res.sendStatus(404);

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=recibo-${pagamento.id}.pdf`);
    doc.pipe(res);

    // Conteúdo do PDF
    doc.fontSize(18).text('Recibo de Pagamento', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Recibo nº: ${pagamento.id}`);
    doc.text(`Data do pagamento: ${new Date(pagamento.paidAt).toLocaleDateString('pt-BR')}`);
    doc.text(`Valor: R$ ${pagamento.amount.toFixed(2)}`);
    doc.text(`Método: ${pagamento.method}`);
    doc.moveDown();

    if (pagamento.Reservation) {
      doc.text(`Reserva: #${pagamento.Reservation.id}`);
      if (pagamento.Reservation.Customer)
        doc.text(`Hóspede: ${pagamento.Reservation.Customer.name}`);
      if (pagamento.Reservation.Room)
        doc.text(`Quarto: ${pagamento.Reservation.Room.name}`);
    } else {
      doc.text('**Sem reserva vinculada**');
    }

    doc.end();
  } catch (err) {
    console.error('Erro ao gerar recibo:', err);
    res.status(500).json({ error: 'Falha ao gerar recibo' });
  }
});

module.exports = router;