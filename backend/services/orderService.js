import crypto from 'crypto';
import { Order, ORDER_STATUS, ITEM_STATUS } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { ProductVariant } from '../models/ProductVariant.js';
import { Seller, SELLER_APPROVAL_STATUS } from '../models/Seller.js';
import { validateCheckout } from './checkoutService.js';
import { clearCart, addToCart } from './cartService.js';
import { recordCouponUsage } from './couponService.js';
import { AppError } from '../utils/appError.js';

/**
 * Order Service
 */

/**
 * Generates human-readable, unique luxury order number: e.g. ZAR-2026-A8F9B2
 */
export const generateOrderNumber = async () => {
  const year = new Date().getFullYear();
  let uniqueNumber = '';
  let exists = true;

  while (exists) {
    const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
    uniqueNumber = `ZAR-${year}-${randomHex}`;
    const found = await Order.findOne({ orderNumber: uniqueNumber });
    if (!found) exists = false;
  }

  return uniqueNumber;
};

/**
 * Authoritatively creates an order from validated cart.
 * Automatically deducts stock, records coupon usage, and clears cart.
 */
export const createOrder = async (userId, payload = {}) => {
  // 1. Authoritative financial validation
  const checkout = await validateCheckout(userId, payload);

  if (!checkout.shippingAddress) {
    throw AppError.badRequest('A valid delivery shipping address is required to place your order.');
  }

  // 2. Prepare historical order items snapshots and deduct inventory
  const orderItems = [];
  const modifiedInventory = [];

  try {
    for (const item of checkout.cart.items) {
      const product = await Product.findById(item.product._id);
      if (!product) throw AppError.notFound(`Product '${item.product.name}' not found.`);

      let sku = product.sku || '';

      // Deduct stock
      if (item.variant) {
        const variant = await ProductVariant.findById(item.variant._id);
        if (!variant || variant.availableStock < item.quantity) {
          throw AppError.badRequest(`Insufficient stock for '${product.name}' (${variant?.sku || 'variant'}).`);
        }
        variant.stock -= item.quantity;
        await variant.save();
        sku = variant.sku;
        modifiedInventory.push({ type: 'variant', id: variant._id, quantity: item.quantity, product: product._id });
      } else {
        if (product.availableStock < item.quantity) {
          throw AppError.badRequest(`Insufficient stock for '${product.name}'.`);
        }
        product.stock -= item.quantity;
        await product.save();
        modifiedInventory.push({ type: 'product', id: product._id, quantity: item.quantity });
      }

      orderItems.push({
        product: product._id,
        variant: item.variant?._id || null,
        seller: item.product.seller?._id || item.product.seller,
        store: item.product.store?._id || item.product.store,
        productName: item.product.name,
        sku,
        image: item.product.image || '',
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discount: item.discountPercent || 0,
        finalItemTotal: item.finalItemTotal,
        status: ITEM_STATUS.PENDING,
      });
    }

    const orderNumber = await generateOrderNumber();
    const paymentMethod = payload.paymentMethod || 'cod';

    const order = new Order({
      orderNumber,
      user: userId,
      items: orderItems,
      shippingAddress: checkout.shippingAddress,
      billingAddress: payload.billingAddress || checkout.shippingAddress,
      shippingMethod: checkout.shippingMethod.method,
      subtotal: checkout.financials.subtotal,
      discount: (checkout.financials.productDiscount || 0) + (checkout.financials.couponDiscount || 0),
      tax: checkout.financials.tax,
      shippingCost: checkout.financials.shippingCost,
      total: checkout.financials.grandTotal,
      coupon: checkout.coupon
        ? {
            code: checkout.coupon.code,
            discountAmount: checkout.financials.couponDiscount,
            couponId: checkout.coupon._id,
          }
        : { code: null, discountAmount: 0, couponId: null },
      payment: {
        method: paymentMethod,
        status: paymentMethod === 'cod' ? 'pending' : 'pending',
      },
      orderStatus: ORDER_STATUS.PENDING_PAYMENT,
    });

    await order.save();

    // 3. Record coupon redemption
    if (checkout.coupon?._id) {
      await recordCouponUsage(checkout.coupon._id, userId);
    }

    // 4. Clear cart after successful order creation
    await clearCart(userId);

    return order;
  } catch (error) {
    // Rollback deducted inventory if order creation fails
    for (const inv of modifiedInventory) {
      if (inv.type === 'variant') {
        await ProductVariant.findByIdAndUpdate(inv.id, { $inc: { stock: inv.quantity } });
        await Product.findByIdAndUpdate(inv.product, { $inc: { stock: inv.quantity } });
      } else {
        await Product.findByIdAndUpdate(inv.id, { $inc: { stock: inv.quantity } });
      }
    }
    throw error;
  }
};

/**
 * Customer: List own orders.
 */
export const getUserOrders = async (userId, query = {}) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(query.limit, 10) || 10));
  const skip = (page - 1) * limit;

  const filter = { user: userId };
  if (query.status) filter.orderStatus = query.status;

  const [items, total] = await Promise.all([
    Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('items.store', 'name slug logo')
      .lean(),
    Order.countDocuments(filter),
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Customer: Get single order by ID with ownership check.
 */
export const getUserOrderById = async (userId, orderId) => {
  const order = await Order.findById(orderId)
    .populate('items.store', 'name slug logo contactEmail contactPhone')
    .lean();

  if (!order) {
    throw AppError.notFound('Order not found.');
  }

  if (order.user.toString() !== userId.toString()) {
    throw AppError.forbidden('Unauthorized access: You do not own this order.');
  }

  return order;
};

/**
 * Customer: Cancel order before fulfillment and restore inventory.
 */
export const cancelUserOrder = async (userId, orderId, reason) => {
  const order = await Order.findById(orderId);
  if (!order) throw AppError.notFound('Order not found.');

  if (order.user.toString() !== userId.toString()) {
    throw AppError.forbidden('Unauthorized access: You do not own this order.');
  }

  const cancelableStatuses = [ORDER_STATUS.PENDING_PAYMENT, ORDER_STATUS.PAID, ORDER_STATUS.PROCESSING];
  if (!cancelableStatuses.includes(order.orderStatus)) {
    throw AppError.badRequest(`Order cannot be cancelled in its current state (${order.orderStatus}).`);
  }

  // Restore inventory
  for (const item of order.items) {
    if (item.variant) {
      await ProductVariant.findByIdAndUpdate(item.variant, { $inc: { stock: item.quantity } });
    }
    await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
  }

  order.orderStatus = ORDER_STATUS.CANCELLED;
  order.cancellation = {
    isCancelled: true,
    reason: reason || 'Customer requested cancellation.',
    cancelledAt: new Date(),
    cancelledBy: userId,
  };

  order.items.forEach((i) => {
    i.status = ITEM_STATUS.CANCELLED;
  });

  await order.save();
  return order;
};

/**
 * Customer: Reorder previously purchased items at current prices.
 */
export const reorderItems = async (userId, orderId) => {
  const order = await Order.findById(orderId);
  if (!order) throw AppError.notFound('Original order not found.');

  if (order.user.toString() !== userId.toString()) {
    throw AppError.forbidden('Unauthorized access: You do not own this order.');
  }

  const addedItems = [];
  const unavailableItems = [];

  for (const item of order.items) {
    try {
      await addToCart(userId, {
        productId: item.product,
        variantId: item.variant,
        quantity: item.quantity,
      });
      addedItems.push({ productName: item.productName, quantity: item.quantity });
    } catch (err) {
      unavailableItems.push({ productName: item.productName, reason: err.message });
    }
  }

  return {
    addedCount: addedItems.length,
    addedItems,
    unavailableCount: unavailableItems.length,
    unavailableItems,
  };
};

// --- Seller Order Management ---

/**
 * Seller: List orders containing items belonging to the seller's atelier.
 */
export const getSellerOrders = async (userId, query = {}) => {
  const seller = await Seller.findOne({ user: userId, approvalStatus: SELLER_APPROVAL_STATUS.APPROVED });
  if (!seller) throw AppError.forbidden('Seller profile not found.');

  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(query.limit, 10) || 15));
  const skip = (page - 1) * limit;

  const filter = { 'items.seller': seller._id };
  if (query.status) filter.orderStatus = query.status;

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Order.countDocuments(filter),
  ]);

  // Isolate and project only this seller's order items
  const sellerOrders = orders.map((o) => {
    const myItems = o.items.filter((i) => i.seller.toString() === seller._id.toString());
    const mySubtotal = myItems.reduce((acc, i) => acc + i.finalItemTotal, 0);

    return {
      _id: o._id,
      orderNumber: o.orderNumber,
      orderStatus: o.orderStatus,
      createdAt: o.createdAt,
      shippingAddress: {
        fullName: o.shippingAddress.fullName,
        city: o.shippingAddress.city,
        state: o.shippingAddress.state,
      },
      items: myItems,
      sellerSubtotal: mySubtotal,
    };
  });

  return {
    items: sellerOrders,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Seller: View single order (only seller's items).
 */
export const getSellerOrderById = async (userId, orderId) => {
  const seller = await Seller.findOne({ user: userId });
  if (!seller) throw AppError.forbidden('Seller profile not found.');

  const order = await Order.findById(orderId).lean();
  if (!order) throw AppError.notFound('Order not found.');

  const myItems = order.items.filter((i) => i.seller.toString() === seller._id.toString());
  if (myItems.length === 0) {
    throw AppError.forbidden('Unauthorized access: This order contains no items from your store.');
  }

  return {
    _id: order._id,
    orderNumber: order.orderNumber,
    orderStatus: order.orderStatus,
    createdAt: order.createdAt,
    shippingAddress: order.shippingAddress,
    shippingMethod: order.shippingMethod,
    items: myItems,
    sellerSubtotal: myItems.reduce((acc, i) => acc + i.finalItemTotal, 0),
  };
};

/**
 * Seller: Update status of their item in an order.
 */
export const updateSellerItemStatus = async (userId, orderId, { itemId, status }) => {
  const seller = await Seller.findOne({ user: userId });
  if (!seller) throw AppError.forbidden('Seller profile not found.');

  const order = await Order.findById(orderId);
  if (!order) throw AppError.notFound('Order not found.');

  const item = order.items.id(itemId);
  if (!item || item.seller.toString() !== seller._id.toString()) {
    throw AppError.forbidden('Unauthorized access: You do not own this order item.');
  }

  item.status = status;

  // If all items in order are shipped/delivered, synchronize overall order status
  const allDelivered = order.items.every((i) => i.status === ITEM_STATUS.DELIVERED);
  const allShipped = order.items.every((i) => i.status === ITEM_STATUS.SHIPPED || i.status === ITEM_STATUS.DELIVERED);

  if (allDelivered) {
    order.orderStatus = ORDER_STATUS.DELIVERED;
  } else if (allShipped) {
    order.orderStatus = ORDER_STATUS.SHIPPED;
  }

  await order.save();
  return order;
};

// --- Admin Order Management ---

export const getAdminOrders = async (query = {}) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 20));
  const skip = (page - 1) * limit;

  const filter = {};
  if (query.status) filter.orderStatus = query.status;
  if (query.search) {
    filter.orderNumber = new RegExp(query.search.trim(), 'i');
  }

  const [items, total] = await Promise.all([
    Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name email phone')
      .populate('items.seller', 'businessName businessEmail')
      .populate('items.store', 'name slug')
      .lean(),
    Order.countDocuments(filter),
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getAdminOrderById = async (orderId) => {
  const order = await Order.findById(orderId)
    .populate('user', 'name email phone avatar')
    .populate('items.seller', 'businessName businessEmail businessPhone')
    .populate('items.store')
    .lean();

  if (!order) throw AppError.notFound('Order not found.');
  return order;
};

export const updateAdminOrderStatus = async (adminId, orderId, status) => {
  const order = await Order.findById(orderId);
  if (!order) throw AppError.notFound('Order not found.');

  if (!Object.values(ORDER_STATUS).includes(status)) {
    throw AppError.badRequest('Invalid order status.');
  }

  order.orderStatus = status;

  // Synchronize item statuses if overall order is shipped or delivered
  if (status === ORDER_STATUS.SHIPPED) {
    order.items.forEach((i) => {
      if (i.status === ITEM_STATUS.PENDING || i.status === ITEM_STATUS.PROCESSING) {
        i.status = ITEM_STATUS.SHIPPED;
      }
    });
  } else if (status === ORDER_STATUS.DELIVERED) {
    order.items.forEach((i) => {
      i.status = ITEM_STATUS.DELIVERED;
    });
  }

  await order.save();
  return order;
};

export default {
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
  generateOrderNumber,
};
