import {
  getMyWishlist,
  addToWishlist,
  removeFromWishlist,
  moveWishlistToCart,
} from '../services/wishlistService.js';
import { sendSuccess } from '../utils/apiResponse.js';

/**
 * Wishlist Controller
 */

export const getWishlist = async (req, res, next) => {
  try {
    const items = await getMyWishlist(req.user._id);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Wishlist retrieved successfully.',
      data: { items },
    });
  } catch (error) {
    next(error);
  }
};

export const addItemToWishlist = async (req, res, next) => {
  try {
    const item = await addToWishlist(req.user._id, req.params.productId);
    return sendSuccess(res, {
      statusCode: 201,
      message: 'Product added to your wishlist.',
      data: { item },
    });
  } catch (error) {
    next(error);
  }
};

export const removeItemFromWishlist = async (req, res, next) => {
  try {
    const result = await removeFromWishlist(req.user._id, req.params.productId);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Product removed from your wishlist.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const moveItemToCart = async (req, res, next) => {
  try {
    const result = await moveWishlistToCart(req.user._id, req.params.productId, req.body.variantId);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Product moved to shopping bag.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getWishlist,
  addItemToWishlist,
  removeItemFromWishlist,
  moveItemToCart,
};
