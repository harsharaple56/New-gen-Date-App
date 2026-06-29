import { Router } from 'express';
import { reportController } from '../controllers/report.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { reportSchema, blockSchema } from '../validators';

const router = Router();

router.use(authenticate);

router.post('/reports', validate(reportSchema), reportController.report);
router.post('/blocks', validate(blockSchema), reportController.block);
router.delete('/blocks/:blockedUserId', reportController.unblock);
router.get('/blocks', reportController.listBlocks);

export default router;
