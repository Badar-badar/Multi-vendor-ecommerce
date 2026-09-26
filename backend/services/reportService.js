import { Order } from '../models/Order.js';
import { Payment } from '../models/Payment.js';
import { Seller } from '../models/Seller.js';
import { Commission, COMMISSION_STATUS } from '../models/Commission.js';
import { Refund } from '../models/Refund.js';

/**
 * Converts array of objects into standard CSV text representation
 */
export const convertToCSV = (data, fields) => {
  if (!data || data.length === 0) {
    return fields.join(',') + '\n';
  }

  const headerRow = fields.join(',');
  const rows = data.map((item) => {
    return fields
      .map((field) => {
        let val = item[field];
        if (val === undefined || val === null) val = '';
        if (typeof val === 'string') {
          // Escape quotes and wrap in quotes
          val = `"${val.replace(/"/g, '""')}"`;
        } else if (val instanceof Date) {
          val = `"${val.toISOString()}"`;
        }
        return val;
      })
      .join(',');
  });

  return [headerRow, ...rows].join('\n');
};

/**
 * Generates Sales Report with optional CSV format
 */
export const generateSalesReport = async (query = {}) => {
  const { startDate, endDate, format = 'json' } = query;

  const match = { 'payment.status': { $in: ['paid', 'partially_refunded', 'refunded'] } };
  if (startDate || endDate) {
    match.createdAt = {};
    if (startDate) match.createdAt.$gte = new Date(startDate);
    if (endDate) match.createdAt.$lte = new Date(endDate);
  }

  const orders = await Order.find(match)
    .populate('user', 'name email phone')
    .sort({ createdAt: -1 })
    .lean();

  const reportData = orders.map((o) => ({
    orderNumber: o.orderNumber,
    date: o.createdAt?.toISOString(),
    customerName: o.user?.name || o.shippingAddress?.fullName || 'Customer',
    customerEmail: o.user?.email || '',
    itemsCount: o.items?.length || 0,
    subtotal: o.subtotal,
    discount: o.discount,
    shippingCost: o.shippingCost,
    total: o.total,
    paymentMethod: o.payment?.method || 'stripe',
    paymentStatus: o.payment?.status || 'pending',
    orderStatus: o.orderStatus,
  }));

  if (format === 'csv') {
    const fields = [
      'orderNumber',
      'date',
      'customerName',
      'customerEmail',
      'itemsCount',
      'subtotal',
      'discount',
      'shippingCost',
      'total',
      'paymentMethod',
      'paymentStatus',
      'orderStatus',
    ];
    return {
      contentType: 'text/csv',
      filename: `sales_report_${Date.now()}.csv`,
      data: convertToCSV(reportData, fields),
    };
  }

  return {
    contentType: 'application/json',
    totalRecords: reportData.length,
    data: reportData,
  };
};

/**
 * Generates Orders Report with optional CSV format
 */
export const generateOrdersReport = async (query = {}) => {
  const { startDate, endDate, status, format = 'json' } = query;

  const match = {};
  if (status) match.orderStatus = status;
  if (startDate || endDate) {
    match.createdAt = {};
    if (startDate) match.createdAt.$gte = new Date(startDate);
    if (endDate) match.createdAt.$lte = new Date(endDate);
  }

  const orders = await Order.find(match)
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .lean();

  const reportData = orders.map((o) => ({
    orderNumber: o.orderNumber,
    date: o.createdAt?.toISOString(),
    customerName: o.user?.name || o.shippingAddress?.fullName || 'Customer',
    city: o.shippingAddress?.city || '',
    state: o.shippingAddress?.state || '',
    total: o.total,
    orderStatus: o.orderStatus,
    paymentStatus: o.payment?.status || 'pending',
  }));

  if (format === 'csv') {
    const fields = ['orderNumber', 'date', 'customerName', 'city', 'state', 'total', 'orderStatus', 'paymentStatus'];
    return {
      contentType: 'text/csv',
      filename: `orders_report_${Date.now()}.csv`,
      data: convertToCSV(reportData, fields),
    };
  }

  return {
    contentType: 'application/json',
    totalRecords: reportData.length,
    data: reportData,
  };
};

/**
 * Generates Seller Performance Report with optional CSV format
 */
export const generateSellerReport = async (query = {}) => {
  const { format = 'json' } = query;

  const sellers = await Seller.find({ approvalStatus: 'approved' })
    .populate('user', 'name email')
    .lean();

  const reportData = [];

  for (const s of sellers) {
    const commissions = await Commission.aggregate([
      { $match: { seller: s._id, status: COMMISSION_STATUS.EARNED } },
      {
        $group: {
          _id: null,
          grossSales: { $sum: '$itemPrice' },
          commission: { $sum: '$amount' },
          netEarnings: { $sum: '$sellerNetEarnings' },
        },
      },
    ]);

    const stats = commissions[0] || { grossSales: 0, commission: 0, netEarnings: 0 };

    reportData.push({
      sellerId: s._id.toString(),
      businessName: s.businessName,
      businessEmail: s.businessEmail,
      contactPhone: s.businessPhone,
      grossSales: stats.grossSales,
      platformCommission: stats.commission,
      netEarnings: stats.netEarnings,
    });
  }

  if (format === 'csv') {
    const fields = [
      'sellerId',
      'businessName',
      'businessEmail',
      'contactPhone',
      'grossSales',
      'platformCommission',
      'netEarnings',
    ];
    return {
      contentType: 'text/csv',
      filename: `seller_report_${Date.now()}.csv`,
      data: convertToCSV(reportData, fields),
    };
  }

  return {
    contentType: 'application/json',
    totalRecords: reportData.length,
    data: reportData,
  };
};

/**
 * Generates Payments Report with optional CSV format
 */
export const generatePaymentsReport = async (query = {}) => {
  const { startDate, endDate, status, format = 'json' } = query;

  const match = {};
  if (status) match.status = status;
  if (startDate || endDate) {
    match.createdAt = {};
    if (startDate) match.createdAt.$gte = new Date(startDate);
    if (endDate) match.createdAt.$lte = new Date(endDate);
  }

  const payments = await Payment.find(match)
    .populate('order', 'orderNumber total')
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .lean();

  const reportData = payments.map((p) => ({
    paymentId: p._id.toString(),
    stripePaymentIntentId: p.stripePaymentIntentId || '',
    orderNumber: p.order?.orderNumber || '',
    customerEmail: p.user?.email || '',
    amount: p.amount,
    amountRefunded: p.amountRefunded || 0,
    currency: (p.currency || 'pkr').toUpperCase(),
    status: p.status,
    paidAt: p.paidAt?.toISOString() || '',
    createdAt: p.createdAt?.toISOString() || '',
  }));

  if (format === 'csv') {
    const fields = [
      'paymentId',
      'stripePaymentIntentId',
      'orderNumber',
      'customerEmail',
      'amount',
      'amountRefunded',
      'currency',
      'status',
      'paidAt',
      'createdAt',
    ];
    return {
      contentType: 'text/csv',
      filename: `payments_report_${Date.now()}.csv`,
      data: convertToCSV(reportData, fields),
    };
  }

  return {
    contentType: 'application/json',
    totalRecords: reportData.length,
    data: reportData,
  };
};

export default {
  generateSalesReport,
  generateOrdersReport,
  generateSellerReport,
  generatePaymentsReport,
  convertToCSV,
};
