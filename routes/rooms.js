const router = require('express').Router();
const { Room } = require('../models');

// ---- LISTAR TODOS ----
router.get('/', async (_, res) => {
  const rooms = await Room.findAll();
  res.json(rooms);
});

// ---- DETALHE ----
router.get('/:id', async (req, res) => {
  const room = await Room.findByPk(req.params.id);
  if (!room) return res.sendStatus(404);
  res.json(room);
});

// ---- CRIAR ----
router.post('/', async (req, res) => {
  try {
    const novo = await Room.create(req.body);
    return res.status(201).json(novo);
  } catch (err) {
    console.error('Erro ao criar quarto:', err);
    return res.status(500).json({ error: 'Falha ao criar quarto' });
  }
});

// ---- ATUALIZAR ----
router.put('/:id', async (req, res) => {
  try {
    console.log('ID recebido:', req.params.id);
    console.log('Body recebido:', req.body);

    const [affected] = await Room.update(req.body, {
      where: { id: req.params.id }
    });

    console.log('Linhas afetadas:', affected);

    if (affected === 0) {
      return res.status(404).json({ error: 'Quarto não encontrado' });
    }

    res.sendStatus(204);
  } catch (err) {
    console.error('Erro PUT /api/rooms/:id', err);
    res.status(500).json({ error: 'Falha ao atualizar quarto' });
  }
});

// ---- EXCLUIR ----
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Room.destroy({ where: { id: req.params.id } });
    if (deleted) return res.sendStatus(204);
    return res.status(404).json({ error: 'Quarto não encontrado' });
  } catch (err) {
    console.error('Erro DELETE /rooms/:id', err);
    res.status(500).json({ error: 'Falha ao excluir quarto' });
  }
});


module.exports = router;