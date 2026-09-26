import {
  createPaymentIntent,
  getPaymentById,
  getMyPayments,
  handleStripeWebhook,
  processRefund,
} from '../services/paymentService.js';
import { sendSuccess } from '../utils/apiResponse.js';

/**
 * Initiates a Stripe PaymentIntent with authoritative server-side calculation
 * POST /api/v1/payments/create-intent
 */
export const createIntent = async (req, res) => {
  const { orderId } = req.body;
  const result = await createPaymentIntent({
    orderId,
    userId: req.user._id,
    userEmail: req.user.email,
  });

  return sendSuccess(res, {
    statusCode: 200,
    message: 'PaymentIntent created successfully.',
    data: result,
  });
};

/**
 * Gets payment details by ID
 * GET /api/v1/payments/:id
 */
export const getPayment = async (req, res) => {
  const payment = await getPaymentById(req.params.id, req.user);

  return sendSuccess(res, {
    statusCode: 200,
    message: 'Payment details retrieved successfully.',
    data: { payment },
  });
};

/**
 * Gets customer payment history
 * GET /api/v1/payments
 */
export const getMyPaymentList = async (req, res) => {
  const result = await getMyPayments(req.user._id, req.query);

  return sendSuccess(res, {
    statusCode: 200,
    message: 'Payment history retrieved successfully.',
    data: result,
  });
};

/**
 * Stripe Webhook Handler
 * POST /api/v1/payments/webhook
 */
export const handleWebhook = async (req, res) => {
  const signature = req.headers['stripe-signature'];
  const rawBody = req.rawBody;
  const payload = req.body;

  const result = await handleStripeWebhook({
    rawBody,
    signature,
    payload,
  });

  return res.status(200).json(result);
};

/**
 * Initiates an order refund
 * POST /api/v1/orders/:id/refund
 */
export const requestRefund = async (req, res) => {
  const orderId = req.params.id;
  const { amount, reason } = req.body || {};
  const isAdmin = req.user.role === 'admin';

  const refund = await processRefund({
    orderId,
    amount,
    reason,
    requestedBy: req.user,
    isAdmin,
    ipAddress: req.ip,
    userAgent: req.get('User-Agent'),
  });

  return sendSuccess(res, {
    statusCode: 200,
    message: 'Refund processed successfully.',
    data: { refund },
  });
};
