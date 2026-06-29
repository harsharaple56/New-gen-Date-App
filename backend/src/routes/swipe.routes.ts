import { Router } from 'express';
import { swipeController } from '../controllers/swipe.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { swipeSchema } from '../validators';

const router = Router();

router.use(authenticate);
router.post('/', validate(swipeSchema), swipeController.swipe);

export default router;
