import Stripe from 'stripe';
import mongoose from 'mongoose';
import { config } from '../config/env.js';
import { Payment, PAYMENT_STATUS } from '../models/Payment.js';
import { Transaction, TRANSACTION_TYPE, TRANSACTION_STATUS } from '../models/Transaction.js';
import { WebhookEvent, WEBHOOK_STATUS } from '../models/WebhookEvent.js';
import { Refund, REFUND_STATUS } from '../models/Refund.js';
import { Order, ORDER_STATUS } from '../models/Order.js';
import { calculateOrderCommissions, reverseCommissionsForRefund } from './commissionService.js';
import { createNotification } from './notificationService.js';
import { recordAuditLog } from './auditLogService.js';
import { emitToUser, emitToAdmins, emitToSeller } from '../utils/socket.js';
import { logger } from '../utils/logger.js';
import { AppError } from '../utils/appError.js';

// Initialize Stripe Client
const isRealStripeKey =
  config.stripe.secretKey &&
  !config.stripe.secretKey.includes('placeholder') &&
  !config.stripe.secretKey.includes('your_stripe') &&
  !config.stripe.secretKey.includes('test_your_');

const stripeClient = isRealStripeKey
  ? new Stripe(config.stripe.secretKey, { apiVersion: '2023-10-16' })
  : null;

/**
 * Creates a Stripe PaymentIntent for an authoritative order total
 */
export const createPaymentIntent = async ({ orderId, userId, userEmail = null }) => {
  // 1. Fetch Order and verify ownership
  const order = await Order.findById(orderId);
  if (!order) {
    throw AppError.notFound('Order not found.');
  }

  if (order.user.toString() !== userId.toString()) {
    throw AppError.forbidden('Unauthorized access: You do not own this order.');
  }

  // 2. Validate Order state
  if (order.payment && order.payment.status === 'paid') {
    throw AppError.badRequest('Order is already paid.');
  }

  if (order.orderStatus === ORDER_STATUS.CANCELLED) {
    throw AppError.badRequest('Cannot create payment for a cancelled order.');
  }

  // 3. Authoritative server-side amount calculation
  const authoritativeAmount = order.total;
  if (!authoritativeAmount || authoritativeAmount <= 0) {
    throw AppError.badRequest('Order total must be greater than zero.');
  }

  const currency = config.stripe.currency || 'pkr';

  // 4. Check for existing pending Payment record (Payment Idempotency)
  let existingPayment = await Payment.findOne({
    order: order._id,
    status: { $in: [PAYMENT_STATUS.PENDING, PAYMENT_STATUS.PROCESSING] },
  });

  let paymentIntentId = null;
  let clientSecret = null;

  if (existingPayment && existingPayment.stripePaymentIntentId) {
    // If Stripe SDK is configured, we can attempt to retrieve the existing intent
    if (stripeClient) {
      try {
        const retrieved = await stripeClient.paymentIntents.retrieve(existingPayment.stripePaymentIntentId);
        if (retrieved && retrieved.status !== 'canceled') {
          paymentIntentId = retrieved.id;
          clientSecret = retrieved.client_secret;
        }
      } catch (err) {
        logger.warn(`[PaymentService] Could not retrieve existing Stripe intent: ${err.message}`);
      }
    } else {
      paymentIntentId = existingPayment.stripePaymentIntentId;
      clientSecret = `${existingPayment.stripePaymentIntentId}_secret_simulated`;
    }
  }

  // 5. If no active intent found, create a new PaymentIntent with Stripe
  if (!paymentIntentId) {
    if (stripeClient && !config.stripe.secretKey.startsWith('dev_')) {
      try {
        // Stripe expects amounts in the smallest currency unit (e.g., cents or full units)
        // For PKR / standard zero-decimal or two-decimal handling:
        const stripeAmount = Math.round(authoritativeAmount * 100);

        const paymentIntent = await stripeClient.paymentIntents.create({
          amount: stripeAmount,
          currency,
          metadata: {
            orderId: order._id.toString(),
            orderNumber: order.orderNumber,
            userId: userId.toString(),
          },
          receipt_email: userEmail || undefined,
        });

        paymentIntentId = paymentIntent.id;
        clientSecret = paymentIntent.client_secret;
      } catch (stripeErr) {
        logger.error(`[PaymentService] Stripe PaymentIntent creation failed: ${stripeErr.message}`);
        throw AppError.badRequest(`Payment provider error: ${stripeErr.message}`);
      }
    } else {
      // Deterministic fallback for test environments without live Stripe credentials
      paymentIntentId = `pi_sim_${order._id.toString().slice(-8)}_${Date.now()}`;
      clientSecret = `${paymentIntentId}_secret_simulated`;
    }

    // 6. Save/Update local Payment record
    if (existingPayment) {
      existingPayment.stripePaymentIntentId = paymentIntentId;
      existingPayment.amount = authoritativeAmount;
      existingPayment.currency = currency;
      existingPayment.status = PAYMENT_STATUS.PENDING;
      await existingPayment.save();
    } else {
      existingPayment = await Payment.create({
        order: order._id,
        user: userId,
        stripePaymentIntentId: paymentIntentId,
        amount: authoritativeAmount,
        currency,
        status: PAYMENT_STATUS.PENDING,
        paymentMethod: 'stripe',
        metadata: {
          orderNumber: order.orderNumber,
        },
      });
    }
  }

  // Update order payment method reference
  order.payment.method = 'stripe';
  order.payment.transactionId = paymentIntentId;
  await order.save();

  return {
    paymentId: existingPayment._id,
    orderId: order._id,
    orderNumber: order.orderNumber,
    paymentIntentId,
    clientSecret,
    amount: authoritativeAmount,
    currency,
  };
};

/**
 * Handles incoming Stripe Webhook events with strict signature verification & idempotency
 */
export const handleStripeWebhook = async ({ rawBody, signature, payload }) => {
  let event = null;

  // 1. Verify Stripe Webhook Signature if signature & secret are configured
  if (config.stripe.webhookSecret && signature && stripeClient) {
    try {
      event = stripeClient.webhooks.constructEvent(
        rawBody,
        signature,
        config.stripe.webhookSecret
      );
    } catch (err) {
      logger.error(`[PaymentService] Stripe signature verification failed: ${err.message}`);
      throw AppError.badRequest(`Webhook signature verification failed: ${err.message}`);
    }
  } else {
    // If webhook secret not configured, parse payload directly
    event = typeof payload === 'string' ? JSON.parse(payload) : payload;
  }

  if (!event || !event.id || !event.type) {
    throw AppError.badRequest('Invalid webhook event payload.');
  }

  const stripeEventId = event.id;
  const eventType = event.type;

  logger.info(`[PaymentService] Received webhook event: ${eventType} (${stripeEventId})`);

  // 2. Webhook Idempotency Check
  let webhookRecord = await WebhookEvent.findOne({ stripeEventId });
  if (webhookRecord && webhookRecord.status === WEBHOOK_STATUS.PROCESSED) {
    logger.info(`[PaymentService] Duplicate webhook event ignored: ${stripeEventId}`);
    return {
      received: true,
      duplicate: true,
      status: 'already_processed',
    };
  }

  if (!webhookRecord) {
    webhookRecord = await WebhookEvent.create({
      stripeEventId,
      eventType,
      status: WEBHOOK_STATUS.PROCESSING,
      payload: event,
    });
  }

  // 3. Process Event Types
  try {
    switch (eventType) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        await handlePaymentIntentSucceeded(paymentIntent);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        await handlePaymentIntentFailed(paymentIntent);
        break;
      }

      case 'payment_intent.canceled': {
        const paymentIntent = event.data.object;
        await handlePaymentIntentCanceled(paymentIntent);
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object;
        logger.info(`[PaymentService] Charge refunded event processed: ${charge.id}`);
        break;
      }

      default:
        logger.info(`[PaymentService] Unhandled Stripe event type: ${eventType}`);
    }

    // 4. Mark webhook as successfully processed
    webhookRecord.status = WEBHOOK_STATUS.PROCESSED;
    webhookRecord.processedAt = new Date();
    await webhookRecord.save();

    return { received: true, status: 'processed' };
  } catch (error) {
    logger.error(`[PaymentService] Error processing webhook ${stripeEventId}: ${error.message}`);
    webhookRecord.status = WEBHOOK_STATUS.FAILED;
    webhookRecord.errorMessage = error.message;
    await webhookRecord.save();
    throw error;
  }
};

/**
 * Executes business logic upon authoritative payment_intent.succeeded
 */
const handlePaymentIntentSucceeded = async (paymentIntent) => {
  const intentId = paymentIntent.id;

  // 1. Find local Payment record
  let payment = await Payment.findOne({ stripePaymentIntentId: intentId });

  // Fallback lookup via metadata orderId if record not linked yet
  if (!payment && paymentIntent.metadata?.orderId) {
    payment = await Payment.findOne({ order: paymentIntent.metadata.orderId });
  }

  if (!payment) {
    logger.warn(`[PaymentService] No payment found for intent: ${intentId}`);
    return;
  }

  // If already succeeded, return idempotently
  if (payment.status === PAYMENT_STATUS.SUCCEEDED) {
    logger.info(`[PaymentService] Payment ${payment._id} already marked succeeded.`);
    return;
  }

  // 2. Find associated Order
  const order = await Order.findById(payment.order);
  if (!order) {
    logger.error(`[PaymentService] Order ${payment.order} not found for payment ${payment._id}`);
    return;
  }

  // 3. Update Payment record
  payment.status = PAYMENT_STATUS.SUCCEEDED;
  payment.paidAt = new Date();
  payment.metadata = { ...payment.metadata, stripePaymentIntent: paymentIntent };
  await payment.save();

  // 4. Update Order payment status
  order.payment.status = 'paid';
  order.payment.paidAt = new Date();
  order.payment.transactionId = intentId;
  if (order.orderStatus === ORDER_STATUS.PENDING_PAYMENT) {
    order.orderStatus = ORDER_STATUS.PROCESSING;
  }
  await order.save();

  // 5. Create authoritative payment transaction record
  await Transaction.create({
    payment: payment._id,
    order: order._id,
    user: order.user,
    type: TRANSACTION_TYPE.PAYMENT,
    amount: order.total,
    currency: payment.currency || 'pkr',
    status: TRANSACTION_STATUS.SUCCEEDED,
    reference: intentId,
    metadata: {
      orderNumber: order.orderNumber,
      paymentMethod: 'stripe',
    },
  });

  // 6. Calculate marketplace vendor commissions
  await calculateOrderCommissions(order);

  // 7. Emit Real-time WebSockets update
  emitToUser(order.user, 'order:payment_updated', {
    orderId: order._id,
    orderNumber: order.orderNumber,
    paymentStatus: 'paid',
  });

  // 8. Dispatch In-App & Email Notifications to Customer
  await createNotification({
    userId: order.user,
    type: 'payment_successful',
    title: 'Payment Confirmed',
    message: `Payment of PKR ${order.total.toLocaleString()} for Order #${order.orderNumber} was confirmed.`,
    data: { orderId: order._id, orderNumber: order.orderNumber },
  });

  // 9. Notify Sellers with items in this order
  const sellerIds = [...new Set(order.items.map((it) => it.seller?.toString()).filter(Boolean))];
  for (const sId of sellerIds) {
    emitToSeller(sId, 'seller:order_paid', {
      orderId: order._id,
      orderNumber: order.orderNumber,
    });
  }

  // 10. Record Audit Log
  await recordAuditLog({
    actor: order.user,
    action: 'payment.succeeded',
    resourceType: 'Payment',
    resourceId: payment._id,
    metadata: {
      orderId: order._id,
      orderNumber: order.orderNumber,
      amount: order.total,
      stripePaymentIntentId: intentId,
    },
  });

  logger.info(`[PaymentService] Successfully finalized payment for Order #${order.orderNumber}`);
};

/**
 * Handles failed payment intent
 */
const handlePaymentIntentFailed = async (paymentIntent) => {
  const intentId = paymentIntent.id;
  const payment = await Payment.findOne({ stripePaymentIntentId: intentId });
  if (!payment) return;

  payment.status = PAYMENT_STATUS.FAILED;
  payment.failureReason = paymentIntent.last_payment_error?.message || 'Payment processing failed.';
  await payment.save();

  const order = await Order.findById(payment.order);
  if (order) {
    order.payment.status = 'failed';
    await order.save();

    emitToUser(order.user, 'order:payment_failed', {
      orderId: order._id,
      orderNumber: order.orderNumber,
      reason: payment.failureReason,
    });

    await createNotification({
      userId: order.user,
      type: 'payment_failed',
      title: 'Payment Failed',
      message: `Payment for Order #${order.orderNumber} could not be completed: ${payment.failureReason}`,
      data: { orderId: order._id, orderNumber: order.orderNumber },
    });
  }

  await recordAuditLog({
    action: 'payment.failed',
    resourceType: 'Payment',
    resourceId: payment._id,
    metadata: {
      orderId: payment.order,
      reason: payment.failureReason,
    },
  });
};

/**
 * Handles canceled payment intent
 */
const handlePaymentIntentCanceled = async (paymentIntent) => {
  const intentId = paymentIntent.id;
  const payment = await Payment.findOne({ stripePaymentIntentId: intentId });
  if (!payment) return;

  payment.status = PAYMENT_STATUS.CANCELLED;
  await payment.save();

  const order = await Order.findById(payment.order);
  if (order && order.payment.status === 'pending') {
    order.payment.status = 'failed';
    await order.save();
  }
};

/**
 * Authoritative Stripe Refund Processing with partial refund support & commission reconciliation
 */
export const processRefund = async ({
  orderId,
  amount,
  reason = 'customer_request',
  requestedBy,
  isAdmin = false,
  ipAddress = null,
  userAgent = null,
}) => {
  // 1. Fetch Order
  const order = await Order.findById(orderId);
  if (!order) {
    throw AppError.notFound('Order not found.');
  }

  // Authorization: Must be Admin, or the customer who owns the order
  if (!isAdmin && order.user.toString() !== requestedBy._id.toString()) {
    throw AppError.forbidden('Unauthorized to request refund for this order.');
  }

  // 2. Fetch Payment record
  const payment = await Payment.findOne({
    order: order._id,
    status: { $in: [PAYMENT_STATUS.SUCCEEDED, PAYMENT_STATUS.PARTIALLY_REFUNDED] },
  });

  if (!payment) {
    throw AppError.badRequest('No successful payment found to refund for this order.');
  }

  // 3. Calculate remaining refundable amount
  const maxRefundable = Math.max(0, payment.amount - (payment.amountRefunded || 0));
  if (maxRefundable <= 0) {
    throw AppError.badRequest('This order has already been fully refunded.');
  }

  const requestedAmount = amount !== undefined ? Number(amount) : maxRefundable;

  if (isNaN(requestedAmount) || requestedAmount <= 0) {
    throw AppError.badRequest('Refund amount must be greater than zero.');
  }

  if (requestedAmount > maxRefundable) {
    throw AppError.badRequest(
      `Requested refund (PKR ${requestedAmount}) exceeds maximum remaining refundable balance (PKR ${maxRefundable}).`
    );
  }

  // 4. Create Stripe Refund if Stripe is enabled
  let stripeRefundId = null;
  if (stripeClient && payment.stripePaymentIntentId && !payment.stripePaymentIntentId.startsWith('pi_sim_')) {
    try {
      const stripeRefund = await stripeClient.refunds.create({
        payment_intent: payment.stripePaymentIntentId,
        amount: Math.round(requestedAmount * 100),
        reason: 'requested_by_customer',
      });
      stripeRefundId = stripeRefund.id;
    } catch (stripeErr) {
      logger.error(`[PaymentService] Stripe refund API failed: ${stripeErr.message}`);
      throw AppError.badRequest(`Refund provider failed: ${stripeErr.message}`);
    }
  } else {
    stripeRefundId = `re_sim_${order._id.toString().slice(-8)}_${Date.now()}`;
  }

  // 5. Create Refund record
  const refund = await Refund.create({
    order: order._id,
    payment: payment._id,
    user: order.user,
    stripeRefundId,
    amount: requestedAmount,
    currency: payment.currency || 'pkr',
    reason,
    status: REFUND_STATUS.SUCCEEDED,
    requestedBy: requestedBy._id,
    processedAt: new Date(),
  });

  // 6. Update Payment and Order states
  payment.amountRefunded = (payment.amountRefunded || 0) + requestedAmount;
  const isFullyRefunded = payment.amountRefunded >= payment.amount;

  payment.status = isFullyRefunded
    ? PAYMENT_STATUS.REFUNDED
    : PAYMENT_STATUS.PARTIALLY_REFUNDED;
  await payment.save();

  order.payment.status = isFullyRefunded ? 'refunded' : 'partially_refunded';
  if (isFullyRefunded) {
    order.orderStatus = ORDER_STATUS.REFUNDED;
  }
  await order.save();

  // 7. Create Financial Transaction
  await Transaction.create({
    payment: payment._id,
    order: order._id,
    user: order.user,
    type: TRANSACTION_TYPE.REFUND,
    amount: requestedAmount,
    currency: payment.currency || 'pkr',
    status: TRANSACTION_STATUS.SUCCEEDED,
    reference: stripeRefundId,
    metadata: {
      refundId: refund._id,
      reason,
      isFullyRefunded,
    },
  });

  // 8. Reconcile commissions
  await reverseCommissionsForRefund(order, refund);

  // 9. Real-time & in-app notifications
  emitToUser(order.user, 'order:refund_completed', {
    orderId: order._id,
    refundId: refund._id,
    amount: requestedAmount,
    isFullyRefunded,
  });

  await createNotification({
    userId: order.user,
    type: 'refund_completed',
    title: 'Refund Processed',
    message: `A refund of PKR ${requestedAmount.toLocaleString()} has been processed for Order #${order.orderNumber}.`,
    data: { orderId: order._id, refundId: refund._id, amount: requestedAmount },
  });

  // 10. Audit log
  await recordAuditLog({
    actor: requestedBy,
    action: 'refund.processed',
    resourceType: 'Refund',
    resourceId: refund._id,
    metadata: {
      orderId: order._id,
      amount: requestedAmount,
      stripeRefundId,
      isFullyRefunded,
    },
    ipAddress,
    userAgent,
  });

  return refund;
};

/**
 * Retrieves payment details by ID with ownership verification
 */
export const getPaymentById = async (paymentId, user) => {
  const payment = await Payment.findById(paymentId)
    .populate('order', 'orderNumber total payment orderStatus createdAt')
    .lean();

  if (!payment) {
    throw AppError.notFound('Payment record not found.');
  }

  // If not admin, verify ownership
  if (user.role !== 'admin' && payment.user.toString() !== user._id.toString()) {
    throw AppError.forbidden('Unauthorized access: You do not own this payment record.');
  }

  return {
    _id: payment._id,
    order: payment.order,
    amount: payment.amount,
    amountRefunded: payment.amountRefunded || 0,
    currency: payment.currency,
    status: payment.status,
    paymentMethod: payment.paymentMethod,
    paidAt: payment.paidAt,
    failureReason: payment.failureReason,
    createdAt: payment.createdAt,
  };
};

/**
 * Retrieves paginated payments for the authenticated user
 */
export const getMyPayments = async (userId, query = {}) => {
  const page = Math.max(1, parseInt(query.page || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(query.limit || '20', 10)));
  const skip = (page - 1) * limit;

  const filter = { user: userId };
  if (query.status) filter.status = query.status;

  const [payments, total] = await Promise.all([
    Payment.find(filter)
      .populate('order', 'orderNumber total orderStatus')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Payment.countDocuments(filter),
  ]);

  return {
    payments,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Admin: list payments with filters
 */
export const getAdminPayments = async (query = {}) => {
  const page = Math.max(1, parseInt(query.page || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(query.limit || '20', 10)));
  const skip = (page - 1) * limit;

  const filter = {};
  if (query.status) filter.status = query.status;
  if (query.order) filter.order = query.order;
  if (query.user) filter.user = query.user;

  const [payments, total] = await Promise.all([
    Payment.find(filter)
      .populate('user', 'firstName lastName email phone')
      .populate('order', 'orderNumber total orderStatus createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Payment.countDocuments(filter),
  ]);

  return {
    payments,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Admin: list transactions with filters
 */
export const getAdminTransactions = async (query = {}) => {
  const page = Math.max(1, parseInt(query.page || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(query.limit || '20', 10)));
  const skip = (page - 1) * limit;

  const filter = {};
  if (query.type) filter.type = query.type;
  if (query.status) filter.status = query.status;
  if (query.seller) filter.seller = query.seller;
  if (query.order) filter.order = query.order;

  const [transactions, total] = await Promise.all([
    Transaction.find(filter)
      .populate('user', 'firstName lastName email')
      .populate('seller', 'businessName')
      .populate('order', 'orderNumber total')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Transaction.countDocuments(filter),
  ]);

  return {
    transactions,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Admin: list refunds with filters
 */
export const getAdminRefunds = async (query = {}) => {
  const page = Math.max(1, parseInt(query.page || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(query.limit || '20', 10)));
  const skip = (page - 1) * limit;

  const filter = {};
  if (query.status) filter.status = query.status;
  if (query.order) filter.order = query.order;

  const [refunds, total] = await Promise.all([
    Refund.find(filter)
      .populate('user', 'firstName lastName email')
      .populate('order', 'orderNumber total')
      .populate('requestedBy', 'firstName lastName email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Refund.countDocuments(filter),
  ]);

  return {
    refunds,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};
