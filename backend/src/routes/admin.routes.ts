import { Router } from 'express';
import { adminController } from '../controllers/admin.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';
import { adminLoginSchema, reportActionSchema, broadcastNotificationSchema } from '../validators';

const router = Router();

// Public admin login.
router.post('/login', validate(adminLoginSchema), adminController.login);

// Everything below requires an admin/moderator token.
router.use(authenticate, requireRole('ADMIN', 'MODERATOR'));

router.get('/dashboard', adminController.dashboard);
router.get('/dashboard/charts', adminController.charts);

router.get('/users', adminController.users);
router.patch('/users/:userId/block', adminController.blockUser);
router.delete('/users/:userId', requireRole('ADMIN'), adminController.deleteUser);

router.get('/reports', adminController.reports);
router.patch('/reports/:reportId/action', validate(reportActionSchema), adminController.actionReport);

router.get('/matches', adminController.matches);
router.delete('/matches/:matchId', adminController.removeMatch);

router.get('/chats', adminController.chats);
router.get('/chats/:chatId', adminController.chatDetail);
router.delete('/chats/:chatId/messages/:messageId', adminController.deleteMessage);

router.get('/subscriptions', adminController.subscriptions);

router.get('/notifications', adminController.notifications);
router.post('/notifications', validate(broadcastNotificationSchema), adminController.broadcast);

export default router;
