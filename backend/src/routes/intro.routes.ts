import { Router } from 'express';
import { matchController } from '../controllers/match.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { introSchema, introRespondSchema } from '../validators';

const router = Router();

router.use(authenticate);
router.post('/', validate(introSchema), matchController.sendIntro);
router.get('/received', matchController.receivedIntros);
router.post('/:introId/respond', validate(introRespondSchema), matchController.respondIntro);

export default router;
