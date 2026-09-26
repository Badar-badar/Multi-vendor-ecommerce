import { Worker } from 'bullmq';
import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { sendEmailNow } from '../services/emailService.js';

let emailWorker = null;

try {
  if (config.redis?.url) {
    emailWorker = new Worker(
      'emailQueue',
      async (job) => {
        logger.info(`[BullMQ] Processing email job ${job.id} (${job.name})`);
        const { to, subject, html, text } = job.data;
        await sendEmailNow({ to, subject, html, text });
        logger.info(`[BullMQ] Successfully completed email job ${job.id}`);
      },
      {
        connection: {
          url: config.redis.url,
          maxRetriesPerRequest: null,
        },
        concurrency: 5,
      }
    );

    emailWorker.on('failed', (job, err) => {
      logger.error(`[BullMQ] Email job ${job?.id} failed: ${err.message}`);
    });

    emailWorker.on('error', (err) => {
      logger.warn(`[BullMQ] Email worker error: ${err.message}`);
    });
  }
} catch (err) {
  logger.warn(`[BullMQ] Email worker initialization skipped: ${err.message}`);
}

export { emailWorker };
