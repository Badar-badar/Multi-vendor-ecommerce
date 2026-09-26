import { Router } from 'express';
import {
  getMyNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '../controllers/notificationController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validate } from '../validators/validateRequest.js';
import { validateNotificationId } from '../validators/notificationValidator.js';

const router = Router();

// All notification endpoints require authenticated user
router.use(authenticate);

router.get('/', getMyNotifications);
router.get('/unread-count', getUnreadNotificationCount);
router.patch('/read-all', markAllNotificationsAsRead);
router.patch('/:id/read', validate(validateNotificationId, 'params'), markNotificationAsRead);

export default router;
