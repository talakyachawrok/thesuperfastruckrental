import { Router } from 'express';
import {
  getAdminStats,
  getPendingDrivers,
  approvePendingDriver,
  resetDatabaseSeed,
} from '../controllers/adminController';

const router = Router();

router.get('/stats', getAdminStats);
router.get('/pending-drivers', getPendingDrivers);
router.patch('/approve-driver/:id', approvePendingDriver);
router.post('/reset-seed', resetDatabaseSeed);

export default router;

