import { Router } from 'express';
import {
  getAllLoads,
  getLoadById,
  createLoad,
  updateLoadStatus,
} from '../controllers/loadController';

const router = Router();

router.get('/', getAllLoads);
router.get('/:id', getLoadById);
router.post('/', createLoad);
router.patch('/:id/status', updateLoadStatus);

export default router;

