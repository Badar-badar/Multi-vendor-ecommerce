import { Notification, NOTIFICATION_STATUS, NOTIFICATION_CHANNEL } from '../models/Notification.js';
import { emitToUser } from '../utils/socket.js';
import { logger } from '../utils/logger.js';
import { AppError } from '../utils/appError.js';
import { sendEmail } from './emailService.js';

/**
 * Creates and delivers an in-app and/or real-time/email notification
 */
export const createNotification = async ({
  userId,
  type,
  title,
  message,
  data = {},
  channel = NOTIFICATION_CHANNEL.IN_APP,
  userEmail = null,
  emailSubject = null,
  emailHtml = null,
}) => {
  try {
    const notification = await Notification.create({
      user: userId,
      type,
      title,
      message,
      data,
      channel,
      status: NOTIFICATION_STATUS.UNREAD,
    });

    // 1. Real-time push notification over WebSockets
    emitToUser(userId, 'notification:new', {
      _id: notification._id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      data: notification.data,
      createdAt: notification.createdAt,
    });

    // 2. Dispatch email if channel requests email and email details provided
    if ((channel === NOTIFICATION_CHANNEL.EMAIL || channel === NOTIFICATION_CHANNEL.ALL) && userEmail) {
      sendEmail({
        to: userEmail,
        subject: emailSubject || title,
        html: emailHtml || `<p>${message}</p>`,
      }).catch((err) => {
        logger.warn(`[Notification] Failed sending email for notification: ${err.message}`);
      });
    }

    return notification;
  } catch (error) {
    logger.error(`[Notification] Error creating notification: ${error.message}`);
    return null;
  }
};

/**
 * Retrieves paginated list of notifications for the authenticated user
 */
export const getUserNotifications = async (userId, query = {}) => {
  const page = Math.max(1, parseInt(query.page || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(query.limit || '20', 10)));
  const skip = (page - 1) * limit;

  const filter = { user: userId };
  if (query.status && Object.values(NOTIFICATION_STATUS).includes(query.status)) {
    filter.status = query.status;
  }

  const [notifications, total] = await Promise.all([
    Notification.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Notification.countDocuments(filter),
  ]);

  return {
    notifications,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Returns total count of unread notifications for a user
 */
export const getUnreadCount = async (userId) => {
  const count = await Notification.countDocuments({
    user: userId,
    status: NOTIFICATION_STATUS.UNREAD,
  });
  return { unreadCount: count };
};

/**
 * Marks a specific notification as read with strict ownership check
 */
export const markAsRead = async (userId, notificationId) => {
  const notification = await Notification.findById(notificationId);
  if (!notification) {
    throw AppError.notFound('Notification not found.');
  }

  if (notification.user.toString() !== userId.toString()) {
    throw AppError.forbidden('Unauthorized access: You do not own this notification.');
  }

  if (notification.status !== NOTIFICATION_STATUS.READ) {
    notification.status = NOTIFICATION_STATUS.READ;
    notification.readAt = new Date();
    await notification.save();
  }

  return notification;
};

/**
 * Marks all unread notifications for a user as read
 */
export const markAllAsRead = async (userId) => {
  const result = await Notification.updateMany(
    { user: userId, status: NOTIFICATION_STATUS.UNREAD },
    { $set: { status: NOTIFICATION_STATUS.READ, readAt: new Date() } }
  );

  return { updatedCount: result.modifiedCount };
};
