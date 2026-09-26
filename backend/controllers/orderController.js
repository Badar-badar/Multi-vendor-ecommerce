import {
  createOrder,
  getUserOrders,
  getUserOrderById,
  cancelUserOrder,
  reorderItems,
  getSellerOrders,
  getSellerOrderById,
  updateSellerItemStatus,
  getAdminOrders,
  getAdminOrderById,
  updateAdminOrderStatus,
} from '../services/orderService.js';
import {
  createReturnRequest,
  getSellerReturns,
  reviewSellerReturn,
} from '../services/returnService.js';
import { sendSuccess } from '../utils/apiResponse.js';

/**
 * Order Controller
 */

// --- Customer Endpoints ---

export const placeOrder = async (req, res, next) => {
  try {
    const order = await createOrder(req.user._id, req.body);
    return sendSuccess(res, {
      statusCode: 201,
      message: 'Order placed successfully. Thank you for choosing Zareen.',
      data: { order },
    });
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const result = await getUserOrders(req.user._id, req.query);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Orders retrieved successfully.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyOrder = async (req, res, next) => {
  try {
    const order = await getUserOrderById(req.user._id, req.params.id);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Order details retrieved successfully.',
      data: { order },
    });
  } catch (error) {
    next(error);
  }
};

export const cancelOrder = async (req, res, next) => {
  try {
    const order = await cancelUserOrder(req.user._id, req.params.id, req.body.reason);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Order has been cancelled.',
      data: { order },
    });
  } catch (error) {
    next(error);
  }
};

export const requestOrderReturn = async (req, res, next) => {
  try {
    const order = await createReturnRequest(req.user._id, req.params.id, req.body);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Return request submitted for Atelier review.',
      data: { order },
    });
  } catch (error) {
    next(error);
  }
};

export const reorderOrderItems = async (req, res, next) => {
  try {
    const result = await reorderItems(req.user._id, req.params.id);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Eligible items added to your shopping bag.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// --- Seller Endpoints ---

export const getSellerOrderList = async (req, res, next) => {
  try {
    const result = await getSellerOrders(req.user._id, req.query);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Seller orders retrieved.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getSellerOrder = async (req, res, next) => {
  try {
    const order = await getSellerOrderById(req.user._id, req.params.id);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Seller order details retrieved.',
      data: { order },
    });
  } catch (error) {
    next(error);
  }
};

export const updateSellerItem = async (req, res, next) => {
  try {
    const order = await updateSellerItemStatus(req.user._id, req.params.id, req.body);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Order item status updated.',
      data: { order },
    });
  } catch (error) {
    next(error);
  }
};

export const getSellerReturnList = async (req, res, next) => {
  try {
    const returns = await getSellerReturns(req.user._id);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Seller returns retrieved.',
      data: { returns },
    });
  } catch (error) {
    next(error);
  }
};

export const reviewSellerReturnRequest = async (req, res, next) => {
  try {
    const order = await reviewSellerReturn(req.user._id, req.params.id, req.body);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Return request decision recorded.',
      data: { order },
    });
  } catch (error) {
    next(error);
  }
};

// --- Admin Endpoints ---

export const getAdminOrderList = async (req, res, next) => {
  try {
    const result = await getAdminOrders(req.query);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Admin orders list retrieved.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminOrder = async (req, res, next) => {
  try {
    const order = await getAdminOrderById(req.params.id);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Order details retrieved.',
      data: { order },
    });
  } catch (error) {
    next(error);
  }
};

export const updateAdminOrder = async (req, res, next) => {
  try {
    const order = await updateAdminOrderStatus(req.user._id, req.params.id, req.body.status);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Order status updated successfully.',
      data: { order },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  placeOrder,
  getMyOrders,
  getMyOrder,
  cancelOrder,
  requestOrderReturn,
  reorderOrderItems,
  getSellerOrderList,
  getSellerOrder,
  updateSellerItem,
  getSellerReturnList,
  reviewSellerReturnRequest,
  getAdminOrderList,
  getAdminOrder,
  updateAdminOrder,
};
