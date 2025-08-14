import { Router } from 'express';
import RoomController from '../controllers/RoomController';

const router = Router();

router.get('/', RoomController.index);
router.get('/:id', RoomController.show);
router.post('/', RoomController.store);
router.put('/:id', RoomController.update);
router.delete('/:id', RoomController.destroy);

export default router;