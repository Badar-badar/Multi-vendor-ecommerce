import { Queue } from 'bullmq';
import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';

let emailQueue = null;

try {
  if (config.redis?.url) {
    emailQueue = new Queue('emailQueue', {
      connection: {
        url: config.redis.url,
        maxRetriesPerRequest: null,
      },
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: true,
        removeOnFail: false,
      },
    });

    emailQueue.on('error', (err) => {
      logger.warn(`[BullMQ] Email Queue Redis error (operating with graceful fallback): ${err.message}`);
    });
  }
} catch (err) {
  logger.warn(`[BullMQ] Could not initialize Email Queue: ${err.message}`);
}

/**
 * Dispatches an email job with stable idempotency job ID
 */
export const addEmailJob = async (name, data, options = {}) => {
  if (emailQueue) {
    try {
      const jobId = options.jobId || `${name}-${data.to}-${Date.now()}`;
      return await emailQueue.add(name, data, { ...options, jobId });
    } catch (err) {
      logger.warn(`[BullMQ] Job enqueue failed, using direct send: ${err.message}`);
    }
  }
  return null;
};

export { emailQueue };
