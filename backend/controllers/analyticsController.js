import {
  getSellerOverview,
  getSellerSalesAnalytics,
  getSellerTopProducts,
  getSellerCustomerAnalytics,
  getAdminOverview,
  getAdminSalesAnalytics,
  getAdminSellerPerformance,
  getAdminProductPerformance,
  getAdminCustomerAnalytics,
  getAdminPaymentAnalytics,
} from '../services/analyticsService.js';
import { Seller } from '../models/Seller.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { AppError } from '../utils/appError.js';

// ==========================================
// SELLER CONTROLLERS
// ==========================================

export const getSellerAnalyticsOverview = async (req, res) => {
  const seller = await Seller.findOne({ user: req.user._id });
  if (!seller) {
    throw AppError.forbidden('Only approved sellers can access seller analytics.');
  }

  const result = await getSellerOverview(seller._id);

  return sendSuccess(res, {
    statusCode: 200,
    message: 'Seller analytics overview retrieved successfully.',
    data: result,
  });
};

export const getSellerAnalyticsSales = async (req, res) => {
  const seller = await Seller.findOne({ user: req.user._id });
  if (!seller) {
    throw AppError.forbidden('Only approved sellers can access seller sales analytics.');
  }

  const result = await getSellerSalesAnalytics(seller._id, req.query);

  return sendSuccess(res, {
    statusCode: 200,
    message: 'Seller sales analytics retrieved successfully.',
    data: result,
  });
};

export const getSellerAnalyticsProducts = async (req, res) => {
  const seller = await Seller.findOne({ user: req.user._id });
  if (!seller) {
    throw AppError.forbidden('Only approved sellers can access top product analytics.');
  }

  const result = await getSellerTopProducts(seller._id, req.query.limit);

  return sendSuccess(res, {
    statusCode: 200,
    message: 'Seller top products analytics retrieved successfully.',
    data: result,
  });
};

export const getSellerAnalyticsCustomers = async (req, res) => {
  const seller = await Seller.findOne({ user: req.user._id });
  if (!seller) {
    throw AppError.forbidden('Only approved sellers can access customer analytics.');
  }

  const result = await getSellerCustomerAnalytics(seller._id);

  return sendSuccess(res, {
    statusCode: 200,
    message: 'Seller customer analytics retrieved successfully.',
    data: result,
  });
};

// ==========================================
// ADMIN CONTROLLERS
// ==========================================

export const getAdminAnalyticsOverviewController = async (req, res) => {
  const result = await getAdminOverview();

  return sendSuccess(res, {
    statusCode: 200,
    message: 'Platform overview analytics retrieved successfully.',
    data: result,
  });
};

export const getAdminAnalyticsSalesController = async (req, res) => {
  const result = await getAdminSalesAnalytics(req.query);

  return sendSuccess(res, {
    statusCode: 200,
    message: 'Platform sales analytics retrieved successfully.',
    data: result,
  });
};

export const getAdminAnalyticsSellersController = async (req, res) => {
  const result = await getAdminSellerPerformance(req.query);

  return sendSuccess(res, {
    statusCode: 200,
    message: 'Seller performance analytics retrieved successfully.',
    data: result,
  });
};

export const getAdminAnalyticsProductsController = async (req, res) => {
  const result = await getAdminProductPerformance(req.query.limit);

  return sendSuccess(res, {
    statusCode: 200,
    message: 'Product performance analytics retrieved successfully.',
    data: result,
  });
};

export const getAdminAnalyticsCustomersController = async (req, res) => {
  const result = await getAdminCustomerAnalytics();

  return sendSuccess(res, {
    statusCode: 200,
    message: 'Customer analytics retrieved successfully.',
    data: result,
  });
};

export const getAdminAnalyticsPaymentsController = async (req, res) => {
  const result = await getAdminPaymentAnalytics();

  return sendSuccess(res, {
    statusCode: 200,
    message: 'Payment analytics retrieved successfully.',
    data: result,
  });
};

export default {
  getSellerAnalyticsOverview,
  getSellerAnalyticsSales,
  getSellerAnalyticsProducts,
  getSellerCustomerAnalytics,
  getAdminAnalyticsOverviewController,
  getAdminAnalyticsSalesController,
  getAdminAnalyticsSellersController,
  getAdminAnalyticsProductsController,
  getAdminAnalyticsCustomersController,
  getAdminAnalyticsPaymentsController,
};
