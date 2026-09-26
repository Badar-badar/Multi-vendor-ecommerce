import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { getHealthStatus } from '../services/healthService.js';

/**
 * @desc    Get API service health and database connection status
 * @route   GET /api/v1/health
 * @access  Public
 */
export const checkHealth = asyncHandler(async (req, res) => {
  const healthData = getHealthStatus();

  return sendSuccess(res, {
    statusCode: 200,
    message: 'Zareen E-Commerce API is healthy and operational.',
    data: healthData,
  });
});

export default {
  checkHealth,
};
