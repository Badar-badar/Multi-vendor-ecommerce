import {
  getRecentlyViewed,
  recordProductView,
} from '../services/recentlyViewedService.js';
import { sendSuccess } from '../utils/apiResponse.js';

/**
 * Recently Viewed Controller
 */

export const getHistory = async (req, res, next) => {
  try {
    const products = await getRecentlyViewed(req.user._id);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Recently viewed products retrieved successfully.',
      data: { products },
    });
  } catch (error) {
    next(error);
  }
};

export const recordView = async (req, res, next) => {
  try {
    await recordProductView(req.user._id, req.params.productId);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Product view recorded.',
      data: { recorded: true },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getHistory,
  recordView,
};
