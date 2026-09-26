import { User } from '../models/User.js';
import { WebhookEvent } from '../models/WebhookEvent.js';
import { logger } from '../utils/logger.js';

/**
 * Executes routine background maintenance and cleanup tasks
 */
export const runMaintenanceCleanup = async () => {
  try {
    const now = new Date();

    // 1. Clear expired password reset and verification tokens from Users
    const tokenResult = await User.updateMany(
      {
        $or: [
          { passwordResetExpires: { $lt: now } },
          { emailVerificationExpires: { $lt: now } },
        ],
      },
      {
        $set: {
          passwordResetToken: null,
          passwordResetExpires: null,
          emailVerificationToken: null,
          emailVerificationExpires: null,
        },
      }
    );

    // 2. Clean up old processed webhook events older than 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const webhookResult = await WebhookEvent.deleteMany({
      status: 'processed',
      processedAt: { $lt: thirtyDaysAgo },
    });

    logger.info(
      `[CleanupJob] Routine cleanup executed. Cleaned ${tokenResult.modifiedCount} user token records and pruned ${webhookResult.deletedCount} old webhook events.`
    );

    return {
      tokensCleaned: tokenResult.modifiedCount,
      webhooksPruned: webhookResult.deletedCount,
    };
  } catch (error) {
    logger.error(`[CleanupJob] Error during routine cleanup: ${error.message}`);
    return null;
  }
};

export default {
  runMaintenanceCleanup,
};
