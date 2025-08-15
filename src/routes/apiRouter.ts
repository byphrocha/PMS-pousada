import { Router } from 'express';

const router = Router();

router.get('/ping', (_req, res) => res.json({ pong: true }));

export default router;   // <‑‑ tem que ser default

import reservationsRoutes from './reservations';
router.use('/reservations', reservationsRoutes);

import customersRoutes from './customers';
router.use('/customers', customersRoutes);

import paymentsRoutes from './payments';
router.use('/payments', paymentsRoutes);