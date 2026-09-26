import { Worker } from 'bullmq';
import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';
import {
  generateSalesReport,
  generateOrdersReport,
  generateSellerReport,
  generatePaymentsReport,
} from '../services/reportService.js';
import { createNotification } from '../services/notificationService.js';

let reportWorker = null;

try {
  if (config.redis?.url) {
    reportWorker = new Worker(
      'reportQueue',
      async (job) => {
        logger.info(`[BullMQ] Processing report job ${job.id} (${job.name})`);
        const { reportType, query, userId } = job.data;

        let result = null;
        switch (reportType) {
          case 'sales':
            result = await generateSalesReport(query);
            break;
          case 'orders':
            result = await generateOrdersReport(query);
            break;
          case 'sellers':
            result = await generateSellerReport(query);
            break;
          case 'payments':
            result = await generatePaymentsReport(query);
            break;
          default:
            throw new Error(`Unsupported report type: ${reportType}`);
        }

        if (userId) {
          await createNotification({
            userId,
            type: 'report_ready',
            title: 'Report Generated',
            message: `Your background ${reportType} report has been generated successfully.`,
            data: { reportType, totalRecords: result.totalRecords },
          });
        }

        logger.info(`[BullMQ] Successfully completed report job ${job.id}`);
        return result;
      },
      {
        connection: {
          url: config.redis.url,
          maxRetriesPerRequest: null,
        },
        concurrency: 2,
      }
    );

    reportWorker.on('failed', (job, err) => {
      logger.error(`[BullMQ] Report job ${job?.id} failed: ${err.message}`);
    });

    reportWorker.on('error', (err) => {
      logger.warn(`[BullMQ] Report worker error: ${err.message}`);
    });
  }
} catch (err) {
  logger.warn(`[BullMQ] Report worker initialization skipped: ${err.message}`);
}

export { reportWorker };
