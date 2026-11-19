import { Router } from 'express';
import {
  getAllBookings,
  getBookingById,
  createDirectBooking,
  updateBookingMilestone,
} from '../controllers/bookingController';

const router = Router();

router.get('/', getAllBookings);
router.get('/:id', getBookingById);
router.post('/direct', createDirectBooking);
router.patch('/:id/milestone', updateBookingMilestone);

export default router;

