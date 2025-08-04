const router = require('express').Router();
const { Customer, Reservation } = require('../models');

// LISTAR
router.get('/', async (_, res) => {
  const clientes = await Customer.findAll({ order: [['name', 'ASC']] });
  res.json(clientes);
});

// DETALHE
router.get('/:id', async (req, res) => {
  const cliente = await Customer.findByPk(req.params.id, { include: Reservation });
  if (!cliente) return res.sendStatus(404);
  res.json(cliente);
});

// CRIAR
router.post('/', async (req, res) => {
  try {
    const novo = await Customer.create(req.body);
    res.status(201).json(novo);
  } catch (err) {
    console.error('Erro POST /customers', err);
    res.status(500).json({ error: 'Falha ao criar cliente' });
  }
});

// ATUALIZAR
router.put('/:id', async (req, res) => {
  try {
    const [updated] = await Customer.update(req.body, { where: { id: req.params.id } });
    if (updated) return res.sendStatus(204);
    return res.status(404).json({ error: 'Cliente não encontrado' });
  } catch (err) {
    console.error('Erro PUT /customers/:id', err);
    res.status(500).json({ error: 'Falha ao atualizar cliente' });
  }
});

// EXCLUIR
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Customer.destroy({ where: { id: req.params.id } });
    if (deleted) return res.sendStatus(204);
    return res.status(404).json({ error: 'Cliente não encontrado' });
  } catch (err) {
    console.error('Erro DELETE /customers/:id', err);
    res.status(500).json({ error: 'Falha ao excluir cliente' });
  }
});

module.exports = router;