import {
  getSellerEarningsSummary,
  getSellerTransactions,
  getAdminCommissions,
} from '../services/commissionService.js';
import {
  getAdminPayments,
  getAdminTransactions,
  getAdminRefunds,
  processRefund,
} from '../services/paymentService.js';
import { Seller } from '../models/Seller.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { AppError } from '../utils/appError.js';

/**
 * Retrieves authenticated seller's earnings breakdown
 * GET /api/v1/seller/earnings
 */
export const getSellerEarnings = async (req, res) => {
  const seller = await Seller.findOne({ user: req.user._id });
  if (!seller) {
    throw AppError.forbidden('Only approved sellers can access seller earnings.');
  }

  const summary = await getSellerEarningsSummary(seller._id);

  return sendSuccess(res, {
    statusCode: 200,
    message: 'Seller earnings retrieved successfully.',
    data: summary,
  });
};

/**
 * Retrieves authenticated seller's financial transaction history
 * GET /api/v1/seller/transactions
 */
export const getSellerTransactionsList = async (req, res) => {
  const seller = await Seller.findOne({ user: req.user._id });
  if (!seller) {
    throw AppError.forbidden('Only approved sellers can access seller transactions.');
  }

  const result = await getSellerTransactions(seller._id, req.query);

  return sendSuccess(res, {
    statusCode: 200,
    message: 'Seller transactions retrieved successfully.',
    data: result,
  });
};

/**
 * Admin: List payments
 * GET /api/v1/admin/payments
 */
export const getAdminPaymentsList = async (req, res) => {
  const result = await getAdminPayments(req.query);

  return sendSuccess(res, {
    statusCode: 200,
    message: 'Admin payments retrieved successfully.',
    data: result,
  });
};

/**
 * Admin: List transactions
 * GET /api/v1/admin/transactions
 */
export const getAdminTransactionsList = async (req, res) => {
  const result = await getAdminTransactions(req.query);

  return sendSuccess(res, {
    statusCode: 200,
    message: 'Admin transactions retrieved successfully.',
    data: result,
  });
};

/**
 * Admin: List refunds
 * GET /api/v1/admin/refunds
 */
export const getAdminRefundsList = async (req, res) => {
  const result = await getAdminRefunds(req.query);

  return sendSuccess(res, {
    statusCode: 200,
    message: 'Admin refunds retrieved successfully.',
    data: result,
  });
};

/**
 * Admin: List commissions
 * GET /api/v1/admin/commissions
 */
export const getAdminCommissionsList = async (req, res) => {
  const result = await getAdminCommissions(req.query);

  return sendSuccess(res, {
    statusCode: 200,
    message: 'Admin commissions retrieved successfully.',
    data: result,
  });
};

/**
 * Admin: Process Refund
 * POST /api/v1/admin/orders/:id/refund
 */
export const processAdminRefund = async (req, res) => {
  const orderId = req.params.id;
  const { amount, reason } = req.body || {};

  const refund = await processRefund({
    orderId,
    amount,
    reason: reason || 'admin_issued_refund',
    requestedBy: req.user,
    isAdmin: true,
    ipAddress: req.ip,
    userAgent: req.get('User-Agent'),
  });

  return sendSuccess(res, {
    statusCode: 200,
    message: 'Refund processed successfully by administrator.',
    data: { refund },
  });
};
