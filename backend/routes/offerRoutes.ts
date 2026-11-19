import { Router } from 'express';
import {
  getAllOffers,
  submitOffer,
  acceptOffer,
  rejectOffer,
} from '../controllers/offerController';

const router = Router();

router.get('/', getAllOffers);
router.post('/', submitOffer);
router.patch('/:id/accept', acceptOffer);
router.patch('/:id/reject', rejectOffer);

export default router;

