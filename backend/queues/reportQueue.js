import { Queue } from 'bullmq';
import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';

let reportQueue = null;

try {
  if (config.redis?.url) {
    reportQueue = new Queue('reportQueue', {
      connection: {
        url: config.redis.url,
        maxRetriesPerRequest: null,
      },
      defaultJobOptions: {
        attempts: 2,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
        removeOnComplete: true,
      },
    });

    reportQueue.on('error', (err) => {
      logger.warn(`[BullMQ] Report Queue offline (graceful fallback): ${err.message}`);
    });
  }
} catch (err) {
  logger.warn(`[BullMQ] Report Queue initialization skipped: ${err.message}`);
}

export const addReportJob = async (name, data, options = {}) => {
  if (reportQueue) {
    try {
      const jobId = options.jobId || `${name}-${Date.now()}`;
      return await reportQueue.add(name, data, { ...options, jobId });
    } catch (err) {
      logger.warn(`[BullMQ] Report Job enqueue failed: ${err.message}`);
    }
  }
  return null;
};

export { reportQueue };
