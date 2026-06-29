import { Router } from 'express';
import { chatController } from '../controllers/chat.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { sendMessageSchema } from '../validators';

const router = Router();

router.use(authenticate);
router.get('/', chatController.list);
router.get('/:chatId/messages', chatController.messages);
router.post('/:chatId/messages', validate(sendMessageSchema), chatController.send);
router.patch('/:chatId/read', chatController.markRead);

export default router;
