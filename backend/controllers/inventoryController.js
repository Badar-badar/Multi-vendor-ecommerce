import {
  getSellerInventory,
  adjustStock,
} from '../services/inventoryService.js';
import { sendSuccess } from '../utils/apiResponse.js';

/**
 * Inventory Controller
 */

export const getInventory = async (req, res, next) => {
  try {
    const result = await getSellerInventory(req.user._id, req.query);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Seller inventory retrieved successfully.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const updateStock = async (req, res, next) => {
  try {
    const result = await adjustStock(req.user._id, req.params.productId, req.body);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Product inventory adjusted successfully.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getInventory,
  updateStock,
};
