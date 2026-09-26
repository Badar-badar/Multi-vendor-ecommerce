import mongoose from 'mongoose';
import { Commission, COMMISSION_STATUS } from '../models/Commission.js';
import { Transaction, TRANSACTION_TYPE, TRANSACTION_STATUS } from '../models/Transaction.js';
import { Seller } from '../models/Seller.js';
import { Order } from '../models/Order.js';
import { logger } from '../utils/logger.js';
import { AppError } from '../utils/appError.js';

// Default platform commission rate is 10% (0.10)
const DEFAULT_COMMISSION_RATE = 0.10;

/**
 * Calculates and records multi-vendor commission records for a successfully paid order
 */
export const calculateOrderCommissions = async (order, session = null) => {
  if (!order || !order.items || order.items.length === 0) {
    return [];
  }

  const commissionRecords = [];

  for (const item of order.items) {
    // If seller not present, skip
    if (!item.seller) continue;

    // Check if commission for this order item already exists (idempotency)
    const existing = await Commission.findOne({
      order: order._id,
      orderItem: item._id,
    }).session(session);

    if (existing) {
      if (existing.status === COMMISSION_STATUS.PENDING) {
        existing.status = COMMISSION_STATUS.EARNED;
        await existing.save({ session });
      }
      commissionRecords.push(existing);
      continue;
    }

    const rate = DEFAULT_COMMISSION_RATE;
    const itemTotal = item.finalItemTotal;
    const commissionAmount = Math.round(itemTotal * rate * 100) / 100;
    const sellerNet = Math.max(0, itemTotal - commissionAmount);

    const [createdCommission] = await Commission.create(
      [
        {
          order: order._id,
          orderItem: item._id,
          seller: item.seller,
          amount: commissionAmount,
          rate,
          itemPrice: itemTotal,
          sellerNetEarnings: sellerNet,
          currency: 'pkr',
          status: COMMISSION_STATUS.EARNED,
        },
      ],
      { session }
    );

    // Create a transaction record for seller commission ledger
    await Transaction.create(
      [
        {
          order: order._id,
          user: order.user,
          seller: item.seller,
          type: TRANSACTION_TYPE.COMMISSION,
          amount: commissionAmount,
          currency: 'pkr',
          status: TRANSACTION_STATUS.SUCCEEDED,
          reference: `COMM-${order.orderNumber}-${item._id.toString().slice(-6)}`,
          metadata: {
            orderItem: item._id,
            productName: item.productName,
            itemPrice: itemTotal,
            sellerNetEarnings: sellerNet,
          },
        },
      ],
      { session }
    );

    commissionRecords.push(createdCommission);
  }

  logger.info(
    `[CommissionService] Created ${commissionRecords.length} commission entries for Order ${order.orderNumber}`
  );
  return commissionRecords;
};

/**
 * Reverses or adjusts marketplace commissions when a refund is processed
 */
export const reverseCommissionsForRefund = async (order, refund, session = null) => {
  const commissions = await Commission.find({
    order: order._id,
    status: COMMISSION_STATUS.EARNED,
  }).session(session);

  if (!commissions || commissions.length === 0) {
    return [];
  }

  const reversed = [];
  const refundRatio = Math.min(1, refund.amount / (order.total || 1));

  for (const comm of commissions) {
    // If full refund or proportionate refund
    if (refundRatio >= 0.999) {
      comm.status = COMMISSION_STATUS.REVERSED;
      comm.refundReference = refund._id;
      await comm.save({ session });
      reversed.push(comm);
    } else {
      // Create a reversal record for the refund portion
      const reversedAmount = Math.round(comm.amount * refundRatio * 100) / 100;
      await Transaction.create(
        [
          {
            order: order._id,
            user: order.user,
            seller: comm.seller,
            type: TRANSACTION_TYPE.REFUND,
            amount: reversedAmount,
            currency: comm.currency || 'pkr',
            status: TRANSACTION_STATUS.SUCCEEDED,
            reference: `COMM-REV-${refund._id.toString().slice(-6)}`,
            metadata: {
              originalCommissionId: comm._id,
              refundId: refund._id,
            },
          },
        ],
        { session }
      );
    }
  }

  return reversed;
};

/**
 * Computes authoritative financial metrics for a seller
 */
export const getSellerEarningsSummary = async (sellerId) => {
  const sellerObjectId = new mongoose.Types.ObjectId(sellerId);

  // 1. Aggregate earned commissions & net earnings
  const commissionStats = await Commission.aggregate([
    { $match: { seller: sellerObjectId } },
    {
      $group: {
        _id: '$status',
        totalItemSales: { $sum: '$itemPrice' },
        totalCommission: { $sum: '$amount' },
        totalNetEarnings: { $sum: '$sellerNetEarnings' },
        count: { $sum: 1 },
      },
    },
  ]);

  let grossSales = 0;
  let platformCommission = 0;
  let netEarnings = 0;
  let refundedAmount = 0;

  commissionStats.forEach((stat) => {
    if (stat._id === COMMISSION_STATUS.EARNED) {
      grossSales += stat.totalItemSales;
      platformCommission += stat.totalCommission;
      netEarnings += stat.totalNetEarnings;
    } else if (stat._id === COMMISSION_STATUS.REVERSED || stat._id === COMMISSION_STATUS.REFUNDED) {
      refundedAmount += stat.totalItemSales;
    }
  });

  return {
    sellerId,
    currency: 'PKR',
    grossSales: Math.round(grossSales * 100) / 100,
    platformCommission: Math.round(platformCommission * 100) / 100,
    refunds: Math.round(refundedAmount * 100) / 100,
    netEarnings: Math.round(netEarnings * 100) / 100,
    statusBreakdown: commissionStats,
  };
};

/**
 * Returns paginated transactions for a seller
 */
export const getSellerTransactions = async (sellerId, query = {}) => {
  const page = Math.max(1, parseInt(query.page || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(query.limit || '20', 10)));
  const skip = (page - 1) * limit;

  const filter = { seller: sellerId };
  if (query.type) filter.type = query.type;
  if (query.status) filter.status = query.status;

  const [transactions, total] = await Promise.all([
    Transaction.find(filter)
      .populate('order', 'orderNumber total createdAt')
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
 * Returns admin commissions list with filters
 */
export const getAdminCommissions = async (query = {}) => {
  const page = Math.max(1, parseInt(query.page || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(query.limit || '20', 10)));
  const skip = (page - 1) * limit;

  const filter = {};
  if (query.seller) filter.seller = query.seller;
  if (query.order) filter.order = query.order;
  if (query.status) filter.status = query.status;

  const [commissions, total] = await Promise.all([
    Commission.find(filter)
      .populate('seller', 'businessName email phone')
      .populate('order', 'orderNumber total createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Commission.countDocuments(filter),
  ]);

  return {
    commissions,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};
