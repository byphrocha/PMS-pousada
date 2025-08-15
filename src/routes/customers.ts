import { Router } from 'express';
import CustomerController from '../controllers/CustomerController';

const router = Router();

router.get('/', CustomerController.index);
router.get('/:id', CustomerController.show);
router.post('/', CustomerController.store);
router.put('/:id', CustomerController.update);
router.delete('/:id', CustomerController.destroy);

export default router;