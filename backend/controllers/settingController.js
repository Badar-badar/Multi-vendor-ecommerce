import {
  getPlatformSettings,
  updatePlatformSettings,
} from '../services/settingService.js';
import { sendSuccess } from '../utils/apiResponse.js';

/**
 * Gets active platform settings
 * GET /api/v1/admin/settings
 */
export const getSettings = async (req, res) => {
  const settings = await getPlatformSettings();

  return sendSuccess(res, {
    statusCode: 200,
    message: 'Platform settings retrieved successfully.',
    data: { settings },
  });
};

/**
 * Updates platform settings
 * PATCH /api/v1/admin/settings
 */
export const updateSettings = async (req, res) => {
  const settings = await updatePlatformSettings(
    req.body,
    req.user,
    req.ip,
    req.get('User-Agent')
  );

  return sendSuccess(res, {
    statusCode: 200,
    message: 'Platform settings updated successfully.',
    data: { settings },
  });
};

export default {
  getSettings,
  updateSettings,
};
