import { Router } from 'express';
import { matchController } from '../controllers/match.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);
router.get('/', matchController.list);
router.delete('/:matchId', matchController.unmatch);

export default router;
