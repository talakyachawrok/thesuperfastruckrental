import { Router } from 'express';
import {
  getAllTrucks,
  getTruckById,
  createTruck,
  toggleTruckAvailability,
} from '../controllers/truckController';

const router = Router();

router.get('/', getAllTrucks);
router.get('/:id', getTruckById);
router.post('/', createTruck);
router.patch('/:id/availability', toggleTruckAvailability);

export default router;

