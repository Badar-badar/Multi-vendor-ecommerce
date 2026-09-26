import mongoose from 'mongoose';

export const WEBHOOK_STATUS = Object.freeze({
  PROCESSING: 'processing',
  PROCESSED: 'processed',
  FAILED: 'failed',
});

const webhookEventSchema = new mongoose.Schema(
  {
    stripeEventId: {
      type: String,
      required: [true, 'Stripe event ID is required.'],
      unique: true,
      trim: true,
      index: true,
    },
    eventType: {
      type: String,
      required: [true, 'Event type is required.'],
      trim: true,
      index: true,
    },
    status: {
      type: String,
      enum: {
        values: Object.values(WEBHOOK_STATUS),
        message: 'Invalid webhook status.',
      },
      default: WEBHOOK_STATUS.PROCESSING,
      index: true,
    },
    processedAt: {
      type: Date,
      default: null,
    },
    payload: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    errorMessage: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const WebhookEvent = mongoose.model('WebhookEvent', webhookEventSchema);
export default WebhookEvent;
