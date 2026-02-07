import { Router } from 'express';
import authController from '../controllers/authController';

const router = Router();

router.get('/me', authController.getMe.bind(authController));
router.post('/register', authController.register.bind(authController));
router.post('/login', authController.login.bind(authController));
router.post('/logout', authController.logout.bind(authController));

export default router;
