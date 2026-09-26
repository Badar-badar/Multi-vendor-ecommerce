import mongoose from 'mongoose';
import { Order, ORDER_STATUS } from '../models/Order.js';
import { Product, PRODUCT_STATUS } from '../models/Product.js';
import { Seller, SELLER_STATUS } from '../models/Seller.js';
import { User } from '../models/User.js';
import { Payment, PAYMENT_STATUS } from '../models/Payment.js';
import { Refund } from '../models/Refund.js';
import { Commission, COMMISSION_STATUS } from '../models/Commission.js';
import { Setting } from '../models/Setting.js';

// ==========================================
// 1. SELLER ANALYTICS
// ==========================================

/**
 * Computes authoritative overview metrics for a seller
 */
export const getSellerOverview = async (sellerId) => {
  const sellerObjectId = new mongoose.Types.ObjectId(sellerId);

  const [orderMetrics, productStats, refundStats] = await Promise.all([
    // Aggregate order totals for items belonging to this seller
    Order.aggregate([
      { $match: { 'items.seller': sellerObjectId, 'payment.status': { $in: ['paid', 'partially_refunded', 'refunded'] } } },
      { $unwind: '$items' },
      { $match: { 'items.seller': sellerObjectId } },
      {
        $group: {
          _id: '$orderStatus',
          itemRevenue: { $sum: '$items.finalItemTotal' },
          itemCount: { $sum: '$items.quantity' },
          orderIds: { $addToSet: '$_id' },
        },
      },
    ]),

    // Product counts & stock levels
    Product.aggregate([
      { $match: { seller: sellerObjectId } },
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          activeProducts: {
            $sum: { $cond: [{ $eq: ['$status', PRODUCT_STATUS.ACTIVE] }, 1, 0] },
          },
          lowStockProducts: {
            $sum: { $cond: [{ $lte: ['$stockQuantity', 5] }, 1, 0] },
          },
          outOfStockProducts: {
            $sum: { $cond: [{ $lte: ['$stockQuantity', 0] }, 1, 0] },
          },
        },
      },
    ]),

    // Refund stats for seller
    Commission.aggregate([
      { $match: { seller: sellerObjectId, status: { $in: [COMMISSION_STATUS.REVERSED, COMMISSION_STATUS.REFUNDED] } } },
      {
        $group: {
          _id: null,
          totalRefundedAmount: { $sum: '$itemPrice' },
        },
      },
    ]),
  ]);

  let grossRevenue = 0;
  let totalOrderSet = new Set();
  let completedOrders = 0;
  let cancelledOrders = 0;

  orderMetrics.forEach((m) => {
    grossRevenue += m.itemRevenue;
    m.orderIds.forEach((id) => totalOrderSet.add(id.toString()));
    if (m._id === ORDER_STATUS.DELIVERED) {
      completedOrders += m.orderIds.length;
    } else if (m._id === ORDER_STATUS.CANCELLED) {
      cancelledOrders += m.orderIds.length;
    }
  });

  const totalOrders = totalOrderSet.size;
  const refundedAmount = refundStats[0]?.totalRefundedAmount || 0;
  const platformCommissionRate = 0.10;
  const platformCommission = Math.round(grossRevenue * platformCommissionRate * 100) / 100;
  const netRevenue = Math.max(0, grossRevenue - platformCommission - refundedAmount);
  const averageOrderValue = totalOrders > 0 ? Math.round((grossRevenue / totalOrders) * 100) / 100 : 0;

  const pStats = productStats[0] || {
    totalProducts: 0,
    activeProducts: 0,
    lowStockProducts: 0,
    outOfStockProducts: 0,
  };

  return {
    sellerId,
    currency: 'PKR',
    grossRevenue: Math.round(grossRevenue * 100) / 100,
    platformCommission,
    refundedAmount: Math.round(refundedAmount * 100) / 100,
    netRevenue: Math.round(netRevenue * 100) / 100,
    totalOrders,
    completedOrders,
    cancelledOrders,
    averageOrderValue,
    products: pStats,
  };
};

/**
 * Computes time-series sales data for a seller
 */
export const getSellerSalesAnalytics = async (sellerId, query = {}) => {
  const sellerObjectId = new mongoose.Types.ObjectId(sellerId);
  const { period = 'day', startDate, endDate } = query;

  const matchFilter = {
    'items.seller': sellerObjectId,
    'payment.status': { $in: ['paid', 'partially_refunded'] },
  };

  if (startDate || endDate) {
    matchFilter.createdAt = {};
    if (startDate) matchFilter.createdAt.$gte = new Date(startDate);
    if (endDate) matchFilter.createdAt.$lte = new Date(endDate);
  }

  let dateFormat = '%Y-%m-%d';
  if (period === 'month') dateFormat = '%Y-%m';
  if (period === 'year') dateFormat = '%Y';

  const salesSeries = await Order.aggregate([
    { $match: matchFilter },
    { $unwind: '$items' },
    { $match: { 'items.seller': sellerObjectId } },
    {
      $group: {
        _id: { $dateToString: { format: dateFormat, date: '$createdAt' } },
        sales: { $sum: '$items.finalItemTotal' },
        itemsCount: { $sum: '$items.quantity' },
        orders: { $addToSet: '$_id' },
      },
    },
    {
      $project: {
        date: '$_id',
        sales: { $round: ['$sales', 2] },
        itemsCount: 1,
        ordersCount: { $size: '$orders' },
        _id: 0,
      },
    },
    { $sort: { date: 1 } },
  ]);

  return {
    period,
    series: salesSeries,
  };
};

/**
 * Identifies top-selling products for a seller
 */
export const getSellerTopProducts = async (sellerId, limit = 10) => {
  const sellerObjectId = new mongoose.Types.ObjectId(sellerId);
  const safeLimit = Math.min(50, Math.max(1, parseInt(limit, 10)));

  const topProducts = await Order.aggregate([
    { $match: { 'items.seller': sellerObjectId, 'payment.status': { $in: ['paid', 'partially_refunded'] } } },
    { $unwind: '$items' },
    { $match: { 'items.seller': sellerObjectId } },
    {
      $group: {
        _id: '$items.product',
        productName: { $first: '$items.productName' },
        sku: { $first: '$items.sku' },
        image: { $first: '$items.image' },
        unitsSold: { $sum: '$items.quantity' },
        totalRevenue: { $sum: '$items.finalItemTotal' },
        ordersCount: { $sum: 1 },
      },
    },
    { $sort: { totalRevenue: -1 } },
    { $limit: safeLimit },
    {
      $project: {
        productId: '$_id',
        productName: 1,
        sku: 1,
        image: 1,
        unitsSold: 1,
        totalRevenue: { $round: ['$totalRevenue', 2] },
        ordersCount: 1,
        _id: 0,
      },
    },
  ]);

  return { topProducts };
};

/**
 * Computes customer metrics for a seller
 */
export const getSellerCustomerAnalytics = async (sellerId) => {
  const sellerObjectId = new mongoose.Types.ObjectId(sellerId);

  const customerStats = await Order.aggregate([
    { $match: { 'items.seller': sellerObjectId, 'payment.status': { $in: ['paid', 'partially_refunded'] } } },
    { $unwind: '$items' },
    { $match: { 'items.seller': sellerObjectId } },
    {
      $group: {
        _id: '$user',
        orderCount: { $addToSet: '$_id' },
        totalSpend: { $sum: '$items.finalItemTotal' },
      },
    },
    {
      $project: {
        userId: '$_id',
        ordersPlaced: { $size: '$orderCount' },
        totalSpend: 1,
      },
    },
  ]);

  const uniqueCustomers = customerStats.length;
  let repeatCustomers = 0;
  let totalRevenue = 0;

  customerStats.forEach((c) => {
    totalRevenue += c.totalSpend;
    if (c.ordersPlaced > 1) {
      repeatCustomers++;
    }
  });

  const averageRevenuePerCustomer = uniqueCustomers > 0 ? Math.round((totalRevenue / uniqueCustomers) * 100) / 100 : 0;

  return {
    uniqueCustomers,
    repeatCustomers,
    oneTimeCustomers: uniqueCustomers - repeatCustomers,
    averageRevenuePerCustomer,
  };
};

// ==========================================
// 2. ADMIN ANALYTICS
// ==========================================

/**
 * Computes platform-wide master overview metrics for administrators
 */
export const getAdminOverview = async () => {
  const [
    userCounts,
    sellerCounts,
    productCounts,
    orderStats,
    financialStats,
  ] = await Promise.all([
    User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
        },
      },
    ]),

    Seller.aggregate([
      {
        $group: {
          _id: '$approvalStatus',
          count: { $sum: 1 },
        },
      },
    ]),

    Product.aggregate([
      {
        $group: {
          _id: '$approvalStatus',
          count: { $sum: 1 },
        },
      },
    ]),

    Order.aggregate([
      {
        $group: {
          _id: '$orderStatus',
          count: { $sum: 1 },
        },
      },
    ]),

    Order.aggregate([
      { $match: { 'payment.status': { $in: ['paid', 'partially_refunded', 'refunded'] } } },
      {
        $group: {
          _id: null,
          grossSales: { $sum: '$total' },
          totalDiscount: { $sum: '$discount' },
          ordersPaid: { $sum: 1 },
        },
      },
    ]),
  ]);

  // Calculate Customer count
  let totalCustomers = 0;
  userCounts.forEach((u) => {
    if (u._id === 'customer') totalCustomers = u.count;
  });

  // Calculate Seller metrics
  let totalSellers = 0;
  let pendingSellers = 0;
  let approvedSellers = 0;
  sellerCounts.forEach((s) => {
    totalSellers += s.count;
    if (s._id === 'pending') pendingSellers = s.count;
    if (s._id === 'approved') approvedSellers = s.count;
  });

  // Product metrics
  let totalProducts = 0;
  let activeProducts = 0;
  let pendingProducts = 0;
  productCounts.forEach((p) => {
    totalProducts += p.count;
    if (p._id === 'approved') activeProducts = p.count;
    if (p._id === 'pending_review') pendingProducts = p.count;
  });

  // Order metrics
  let totalOrders = 0;
  let completedOrders = 0;
  let cancelledOrders = 0;
  orderStats.forEach((o) => {
    totalOrders += o.count;
    if (o._id === ORDER_STATUS.DELIVERED) completedOrders = o.count;
    if (o._id === ORDER_STATUS.CANCELLED) cancelledOrders = o.count;
  });

  const grossSales = financialStats[0]?.grossSales || 0;
  const totalDiscounts = financialStats[0]?.totalDiscount || 0;

  // Retrieve total refunds
  const refundsAgg = await Refund.aggregate([
    { $match: { status: 'succeeded' } },
    { $group: { _id: null, totalRefunds: { $sum: '$amount' } } },
  ]);
  const totalRefunds = refundsAgg[0]?.totalRefunds || 0;

  // Retrieve platform commissions
  const commissionsAgg = await Commission.aggregate([
    { $match: { status: COMMISSION_STATUS.EARNED } },
    { $group: { _id: null, totalCommission: { $sum: '$amount' } } },
  ]);
  const platformCommission = commissionsAgg[0]?.totalCommission || Math.round(grossSales * 0.10 * 100) / 100;
  const netPlatformRevenue = platformCommission;

  return {
    currency: 'PKR',
    overview: {
      totalCustomers,
      totalSellers,
      pendingSellers,
      approvedSellers,
      totalProducts,
      activeProducts,
      pendingProducts,
      totalOrders,
      completedOrders,
      cancelledOrders,
    },
    financials: {
      grossSales: Math.round(grossSales * 100) / 100,
      totalDiscounts: Math.round(totalDiscounts * 100) / 100,
      totalRefunds: Math.round(totalRefunds * 100) / 100,
      platformCommission: Math.round(platformCommission * 100) / 100,
      netPlatformRevenue: Math.round(netPlatformRevenue * 100) / 100,
    },
  };
};

/**
 * Computes platform-wide sales analytics over time
 */
export const getAdminSalesAnalytics = async (query = {}) => {
  const { period = 'day', startDate, endDate } = query;

  const matchFilter = {
    'payment.status': { $in: ['paid', 'partially_refunded', 'refunded'] },
  };

  if (startDate || endDate) {
    matchFilter.createdAt = {};
    if (startDate) matchFilter.createdAt.$gte = new Date(startDate);
    if (endDate) matchFilter.createdAt.$lte = new Date(endDate);
  }

  let dateFormat = '%Y-%m-%d';
  if (period === 'month') dateFormat = '%Y-%m';
  if (period === 'year') dateFormat = '%Y';

  const series = await Order.aggregate([
    { $match: matchFilter },
    {
      $group: {
        _id: { $dateToString: { format: dateFormat, date: '$createdAt' } },
        orderCount: { $sum: 1 },
        grossSales: { $sum: '$total' },
        discounts: { $sum: '$discount' },
      },
    },
    {
      $project: {
        date: '$_id',
        orderCount: 1,
        grossSales: { $round: ['$grossSales', 2] },
        discounts: { $round: ['$discounts', 2] },
        commission: { $round: [{ $multiply: ['$grossSales', 0.10] }, 2] },
        _id: 0,
      },
    },
    { $sort: { date: 1 } },
  ]);

  return {
    period,
    series,
  };
};

/**
 * Returns admin breakdown of seller performance
 */
export const getAdminSellerPerformance = async (query = {}) => {
  const limit = Math.min(100, Math.max(1, parseInt(query.limit || '20', 10)));

  const sellers = await Seller.aggregate([
    { $match: { approvalStatus: 'approved' } },
    {
      $lookup: {
        from: 'commissions',
        localField: '_id',
        foreignField: 'seller',
        as: 'commissions',
      },
    },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: 'seller',
        as: 'products',
      },
    },
    {
      $project: {
        sellerId: '$_id',
        businessName: 1,
        businessEmail: 1,
        businessPhone: 1,
        totalProducts: { $size: '$products' },
        grossSales: {
          $sum: '$commissions.itemPrice',
        },
        platformCommissions: {
          $sum: '$commissions.amount',
        },
        netEarnings: {
          $sum: '$commissions.sellerNetEarnings',
        },
      },
    },
    { $sort: { grossSales: -1 } },
    { $limit: limit },
  ]);

  return { sellers };
};

/**
 * Returns product performance metrics across the entire platform
 */
export const getAdminProductPerformance = async (limit = 10) => {
  const safeLimit = Math.min(50, Math.max(1, parseInt(limit, 10)));

  const topProducts = await Order.aggregate([
    { $match: { 'payment.status': { $in: ['paid', 'partially_refunded'] } } },
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.product',
        productName: { $first: '$items.productName' },
        unitsSold: { $sum: '$items.quantity' },
        revenue: { $sum: '$items.finalItemTotal' },
        ordersCount: { $sum: 1 },
      },
    },
    { $sort: { revenue: -1 } },
    { $limit: safeLimit },
    {
      $project: {
        productId: '$_id',
        productName: 1,
        unitsSold: 1,
        revenue: { $round: ['$revenue', 2] },
        ordersCount: 1,
        _id: 0,
      },
    },
  ]);

  return { topProducts };
};

/**
 * Platform customer analytics
 */
export const getAdminCustomerAnalytics = async () => {
  const [totalCustomers, orderUserStats] = await Promise.all([
    User.countDocuments({ role: 'customer' }),
    Order.aggregate([
      { $match: { 'payment.status': { $in: ['paid', 'partially_refunded'] } } },
      {
        $group: {
          _id: '$user',
          ordersCount: { $sum: 1 },
          totalSpent: { $sum: '$total' },
        },
      },
    ]),
  ]);

  const activeBuyers = orderUserStats.length;
  let repeatBuyers = 0;
  let totalSpentSum = 0;

  orderUserStats.forEach((buyer) => {
    totalSpentSum += buyer.totalSpent;
    if (buyer.ordersCount > 1) {
      repeatBuyers++;
    }
  });

  const averageCustomerSpend = activeBuyers > 0 ? Math.round((totalSpentSum / activeBuyers) * 100) / 100 : 0;

  return {
    totalCustomers,
    activeBuyers,
    repeatBuyers,
    oneTimeBuyers: activeBuyers - repeatBuyers,
    averageCustomerSpend,
  };
};

/**
 * Payment performance and status distribution analytics
 */
export const getAdminPaymentAnalytics = async () => {
  const [paymentStats, refundStats] = await Promise.all([
    Payment.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
        },
      },
    ]),
    Refund.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalRefunded: { $sum: '$amount' },
        },
      },
    ]),
  ]);

  return {
    paymentsByStatus: paymentStats,
    refundsByStatus: refundStats,
  };
};

export default {
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
};
