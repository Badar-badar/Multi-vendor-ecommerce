import { Setting } from '../models/Setting.js';
import { recordAuditLog } from './auditLogService.js';
import { cacheService } from './cacheService.js';
import { logger } from '../utils/logger.js';

const SETTINGS_KEY = 'platform_settings';
const CACHE_KEY = 'settings:platform';

/**
 * Retrieves the global platform settings (with caching)
 */
export const getPlatformSettings = async () => {
  let settings = await Setting.findOne({ key: SETTINGS_KEY }).lean();

  if (!settings) {
    settings = await Setting.create({ key: SETTINGS_KEY });
  }

  return settings;
};

/**
 * Updates platform settings and creates an audit log
 */
export const updatePlatformSettings = async (updateData, adminUser, ipAddress = null, userAgent = null) => {
  let settings = await Setting.findOne({ key: SETTINGS_KEY });

  if (!settings) {
    settings = new Setting({ key: SETTINGS_KEY });
  }

  const allowedFields = [
    'platformCommissionRate',
    'defaultTaxRate',
    'defaultShippingCost',
    'freeShippingThreshold',
    'lowStockThreshold',
    'marketplaceStatus',
  ];

  const previousValues = {};
  for (const field of allowedFields) {
    if (updateData[field] !== undefined) {
      previousValues[field] = settings[field];
      settings[field] = updateData[field];
    }
  }

  settings.updatedBy = adminUser._id;
  await settings.save();

  // Audit log the configuration change
  await recordAuditLog({
    actor: adminUser,
    action: 'settings.updated',
    resourceType: 'Setting',
    resourceId: settings._id,
    metadata: {
      previousValues,
      updatedValues: updateData,
    },
    ipAddress,
    userAgent,
  });

  return settings;
};

export default {
  getPlatformSettings,
  updatePlatformSettings,
};
