import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);
router.get('/discover', userController.discover);
router.get('/:userId', userController.getProfile);

export default router;
