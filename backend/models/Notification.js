import mongoose from 'mongoose';

export const NOTIFICATION_CHANNEL = Object.freeze({
  IN_APP: 'in_app',
  EMAIL: 'email',
  REALTIME: 'realtime',
  ALL: 'all',
});

export const NOTIFICATION_STATUS = Object.freeze({
  UNREAD: 'unread',
  READ: 'read',
});

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required.'],
      index: true,
    },
    type: {
      type: String,
      required: [true, 'Notification type is required.'],
      trim: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Notification title is required.'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Notification message is required.'],
      trim: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    channel: {
      type: String,
      enum: {
        values: Object.values(NOTIFICATION_CHANNEL),
        message: 'Invalid notification channel.',
      },
      default: NOTIFICATION_CHANNEL.IN_APP,
    },
    status: {
      type: String,
      enum: {
        values: Object.values(NOTIFICATION_STATUS),
        message: 'Invalid notification status.',
      },
      default: NOTIFICATION_STATUS.UNREAD,
      index: true,
    },
    readAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ user: 1, status: 1, createdAt: -1 });

export const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
