import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import profileRoutes from './profile.routes';
import swipeRoutes from './swipe.routes';
import matchRoutes from './match.routes';
import introRoutes from './intro.routes';
import chatRoutes from './chat.routes';
import reportRoutes from './report.routes';
import subscriptionRoutes from './subscription.routes';
import adminRoutes from './admin.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/profile', profileRoutes);
router.use('/swipes', swipeRoutes);
router.use('/matches', matchRoutes);
router.use('/intros', introRoutes);
router.use('/chats', chatRoutes);
router.use('/subscription', subscriptionRoutes);
router.use('/admin', adminRoutes);
router.use('/', reportRoutes); // exposes /reports and /blocks (mounted last: its router-level auth must not shadow other routers)

export default router;
