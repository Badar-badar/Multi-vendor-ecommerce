import { AuditLog } from '../models/AuditLog.js';
import { logger } from '../utils/logger.js';

/**
 * Sanitizes metadata to strictly filter out passwords, tokens, raw cards, or secret keys
 */
const sanitizeAuditMetadata = (data) => {
  if (!data || typeof data !== 'object') return data;
  const sensitiveKeys = [
    'password',
    'passwordConfirm',
    'token',
    'refreshToken',
    'secret',
    'secretKey',
    'webhookSecret',
    'cardNumber',
    'cvv',
    'expMonth',
    'expYear',
  ];

  const sanitized = { ...data };
  for (const key of Object.keys(sanitized)) {
    if (sensitiveKeys.includes(key.toLowerCase())) {
      delete sanitized[key];
    } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = sanitizeAuditMetadata(sanitized[key]);
    }
  }
  return sanitized;
};

/**
 * Centrally records an administrative, financial, or security audit log
 */
export const recordAuditLog = async ({
  actor = null,
  action,
  resourceType,
  resourceId = null,
  metadata = {},
  ipAddress = null,
  userAgent = null,
}) => {
  try {
    if (!action || !resourceType) {
      logger.warn('[AuditLog] Missing required action or resourceType for audit log entry.');
      return null;
    }

    const cleanMetadata = sanitizeAuditMetadata(metadata);

    const logEntry = await AuditLog.create({
      actor: actor?._id || actor || null,
      action,
      resourceType,
      resourceId: resourceId?.toString() || null,
      metadata: cleanMetadata,
      ipAddress,
      userAgent,
    });

    return logEntry;
  } catch (error) {
    logger.error(`[AuditLog] Failed to record audit log: ${error.message}`);
    return null; // Audit failure should never crash active business operations
  }
};
