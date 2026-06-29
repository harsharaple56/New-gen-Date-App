import { Router } from 'express';
import { subscriptionController } from '../controllers/subscription.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createSubscriptionSchema, confirmSubscriptionSchema } from '../validators';

const router = Router();

router.use(authenticate);
router.get('/me', subscriptionController.mine);
router.post('/create', validate(createSubscriptionSchema), subscriptionController.create);
router.patch('/confirm', validate(confirmSubscriptionSchema), subscriptionController.confirm);

export default router;
