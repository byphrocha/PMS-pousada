import { Router } from 'express';
import PaymentController from '../controllers/PaymentController';

const router = Router();

router.get('/', PaymentController.index);
router.get('/:id', PaymentController.show);
router.post('/', PaymentController.store);
router.put('/:id', PaymentController.update);
router.delete('/:id', PaymentController.destroy);

export default router;