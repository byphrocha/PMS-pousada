import { Router } from 'express';
import ReservationController from '../controllers/ReservationController';

const router = Router();

router.get('/', ReservationController.index);
router.get('/:id', ReservationController.show);
router.post('/', ReservationController.store);
router.put('/:id', ReservationController.update);
router.delete('/:id', ReservationController.destroy);

export default router;