import {
  getCartDetails,
  addToCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
} from '../services/cartService.js';
import { sendSuccess } from '../utils/apiResponse.js';

/**
 * Cart Controller
 */

export const getCart = async (req, res, next) => {
  try {
    const cart = await getCartDetails(req.user._id);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Cart retrieved successfully.',
      data: { cart },
    });
  } catch (error) {
    next(error);
  }
};

export const addItemToCart = async (req, res, next) => {
  try {
    const cart = await addToCart(req.user._id, req.body);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Item added to your shopping bag.',
      data: { cart },
    });
  } catch (error) {
    next(error);
  }
};

export const updateItemQuantity = async (req, res, next) => {
  try {
    const cart = await updateCartItemQuantity(req.user._id, req.params.id, req.body.quantity);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Shopping bag quantity updated.',
      data: { cart },
    });
  } catch (error) {
    next(error);
  }
};

export const removeItem = async (req, res, next) => {
  try {
    const cart = await removeCartItem(req.user._id, req.params.id);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Item removed from your shopping bag.',
      data: { cart },
    });
  } catch (error) {
    next(error);
  }
};

export const emptyCart = async (req, res, next) => {
  try {
    const cart = await clearCart(req.user._id);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Shopping bag cleared.',
      data: { cart },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getCart,
  addItemToCart,
  updateItemQuantity,
  removeItem,
  emptyCart,
};
