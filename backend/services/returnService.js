import { Order, ORDER_STATUS } from '../models/Order.js';
import { Seller, SELLER_APPROVAL_STATUS } from '../models/Seller.js';
import { AppError } from '../utils/appError.js';

/**
 * Return Request Service
 */

export const createReturnRequest = async (userId, orderId, { reason, description, items = [] }) => {
  const order = await Order.findById(orderId);
  if (!order) throw AppError.notFound('Order not found.');

  if (order.user.toString() !== userId.toString()) {
    throw AppError.forbidden('Unauthorized access: You do not own this order.');
  }

  if (order.orderStatus !== ORDER_STATUS.DELIVERED) {
    throw AppError.badRequest(`Returns can only be requested for delivered orders (Current state: ${order.orderStatus}).`);
  }

  if (order.returnRequest?.status === 'requested') {
    throw AppError.conflict('A return request is already pending review for this order.');
  }

  order.orderStatus = ORDER_STATUS.RETURN_REQUESTED;
  order.returnRequest = {
    reason: reason.trim(),
    description: description?.trim() || '',
    items: Array.isArray(items) && items.length > 0 ? items : order.items.map((i) => i._id),
    status: 'requested',
    requestedAt: new Date(),
    reviewedAt: null,
    resolution: null,
  };

  await order.save();
  return order;
};

export const getSellerReturns = async (userId) => {
  const seller = await Seller.findOne({ user: userId, approvalStatus: SELLER_APPROVAL_STATUS.APPROVED });
  if (!seller) throw AppError.forbidden('Seller profile not found.');

  return Order.find({
    'items.seller': seller._id,
    orderStatus: { $in: [ORDER_STATUS.RETURN_REQUESTED, ORDER_STATUS.RETURNED] },
  })
    .sort({ 'returnRequest.requestedAt': -1 })
    .lean();
};

export const reviewSellerReturn = async (userId, orderId, { approved, resolution }) => {
  const seller = await Seller.findOne({ user: userId });
  if (!seller) throw AppError.forbidden('Seller profile not found.');

  const order = await Order.findById(orderId);
  if (!order) throw AppError.notFound('Order not found.');

  const hasMyItems = order.items.some((i) => i.seller.toString() === seller._id.toString());
  if (!hasMyItems) {
    throw AppError.forbidden('Unauthorized access: This order does not belong to your store.');
  }

  order.returnRequest.status = approved ? 'approved' : 'rejected';
  order.returnRequest.reviewedAt = new Date();
  order.returnRequest.resolution = resolution || (approved ? 'Return approved by Atelier.' : 'Return request rejected.');

  if (approved) {
    order.orderStatus = ORDER_STATUS.RETURNED;
  } else {
    order.orderStatus = ORDER_STATUS.DELIVERED;
  }

  await order.save();
  return order;
};

export default {
  createReturnRequest,
  getSellerReturns,
  reviewSellerReturn,
};
