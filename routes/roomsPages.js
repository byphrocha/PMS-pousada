const express = require('express');
const router  = express.Router();
const { Room } = require('../models');

// Formulário: Novo quarto
router.get('/new', (req, res) => {
  res.render('rooms/new', { title: 'Novo Quarto' });
});

// Formulário: Editar quarto
router.get('/:id/edit', async (req, res) => {
  const room = await Room.findByPk(req.params.id);
  if (!room) return res.redirect('/rooms');
  res.render('rooms/edit', { title: 'Editar Quarto', room });
});

module.exports = router;