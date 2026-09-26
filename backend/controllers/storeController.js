import {
  getPublicStores,
  getStoreBySlug,
  getMyStore,
  updateMyStore,
} from '../services/storeService.js';
import { sendSuccess } from '../utils/apiResponse.js';

/**
 * Store Controller
 */

export const getStores = async (req, res, next) => {
  try {
    const result = await getPublicStores(req.query);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Active marketplace stores retrieved successfully.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getStore = async (req, res, next) => {
  try {
    const store = await getStoreBySlug(req.params.slug);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Store details retrieved successfully.',
      data: { store },
    });
  } catch (error) {
    next(error);
  }
};

export const getSellerStore = async (req, res, next) => {
  try {
    const store = await getMyStore(req.user._id);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Seller store profile retrieved successfully.',
      data: { store },
    });
  } catch (error) {
    next(error);
  }
};

export const updateSellerStore = async (req, res, next) => {
  try {
    const store = await updateMyStore(req.user._id, req.body);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Seller store profile updated successfully.',
      data: { store },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getStores,
  getStore,
  getSellerStore,
  updateSellerStore,
};
