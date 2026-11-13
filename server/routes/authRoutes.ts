import { Router } from 'express';
import { registerUser, loginUser, demoLogin, getMe } from '../controllers/authController';
import { protect } from '../middleware/auth';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/demo/:role', demoLogin);
router.get('/me', protect, getMe);

export default router;

