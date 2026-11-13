import { Router } from 'express';
import {
  getUserNotifications,
  markNotificationRead,
} from '../controllers/notificationController';

const router = Router();

router.get('/', getUserNotifications);
router.patch('/:id/read', markNotificationRead);

export default router;

