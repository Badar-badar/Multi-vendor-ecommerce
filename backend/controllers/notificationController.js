import {
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} from '../services/notificationService.js';
import { sendSuccess } from '../utils/apiResponse.js';

/**
 * Gets paginated notifications for the authenticated user
 * GET /api/v1/notifications
 */
export const getMyNotifications = async (req, res) => {
  const result = await getUserNotifications(req.user._id, req.query);

  return sendSuccess(res, {
    statusCode: 200,
    message: 'Notifications retrieved successfully.',
    data: result,
  });
};

/**
 * Gets unread notification count
 * GET /api/v1/notifications/unread-count
 */
export const getUnreadNotificationCount = async (req, res) => {
  const result = await getUnreadCount(req.user._id);

  return sendSuccess(res, {
    statusCode: 200,
    message: 'Unread count retrieved successfully.',
    data: result,
  });
};

/**
 * Marks a specific notification as read
 * PATCH /api/v1/notifications/:id/read
 */
export const markNotificationAsRead = async (req, res) => {
  const notification = await markAsRead(req.user._id, req.params.id);

  return sendSuccess(res, {
    statusCode: 200,
    message: 'Notification marked as read.',
    data: { notification },
  });
};

/**
 * Marks all notifications as read
 * PATCH /api/v1/notifications/read-all
 */
export const markAllNotificationsAsRead = async (req, res) => {
  const result = await markAllAsRead(req.user._id);

  return sendSuccess(res, {
    statusCode: 200,
    message: 'All notifications marked as read.',
    data: result,
  });
};
