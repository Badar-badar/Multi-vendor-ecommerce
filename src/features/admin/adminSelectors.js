import { createSelector } from '@reduxjs/toolkit';

const selectAdminDomain = (state) => state.admin;

export const selectAdminMetrics = createSelector(
  [selectAdminDomain],
  (admin) => admin?.metrics || {}
);

export const selectAdminTimeframe = createSelector(
  [selectAdminDomain],
  (admin) => admin?.timeframe || '6m'
);

export const selectAdminUsers = createSelector(
  [selectAdminDomain],
  (admin) => admin?.users || []
);

export const selectAdminSellers = createSelector(
  [selectAdminDomain],
  (admin) => admin?.sellers || []
);

export const selectAdminProducts = createSelector(
  [selectAdminDomain],
  (admin) => admin?.products || []
);

export const selectAdminCategories = createSelector(
  [selectAdminDomain],
  (admin) => admin?.categories || []
);

export const selectAdminSubcategories = createSelector(
  [selectAdminDomain],
  (admin) => admin?.subcategories || []
);

export const selectAdminBrands = createSelector(
  [selectAdminDomain],
  (admin) => admin?.brands || []
);

export const selectAdminOrders = createSelector(
  [selectAdminDomain],
  (admin) => admin?.orders || []
);

export const selectAdminPayments = createSelector(
  [selectAdminDomain],
  (admin) => admin?.payments || []
);

export const selectAdminRefunds = createSelector(
  [selectAdminDomain],
  (admin) => admin?.refunds || []
);

export const selectAdminCommissions = createSelector(
  [selectAdminDomain],
  (admin) => admin?.commissions || []
);

export const selectAdminReviews = createSelector(
  [selectAdminDomain],
  (admin) => admin?.reviews || []
);

export const selectAdminCoupons = createSelector(
  [selectAdminDomain],
  (admin) => admin?.coupons || []
);

export const selectAdminPromotions = createSelector(
  [selectAdminDomain],
  (admin) => admin?.promotions || []
);

export const selectAdminNotifications = createSelector(
  [selectAdminDomain],
  (admin) => admin?.notifications || []
);

export const selectAdminAuditLogs = createSelector(
  [selectAdminDomain],
  (admin) => admin?.auditLogs || []
);

export const selectAdminSettings = createSelector(
  [selectAdminDomain],
  (admin) => admin?.settings || {}
);

export const selectAdminLoading = createSelector(
  [selectAdminDomain],
  (admin) => admin?.loading || false
);

export const selectPendingSellers = createSelector(
  [selectAdminSellers],
  (sellers) => sellers.filter((s) => s.status === 'Pending')
);

export const selectPendingProducts = createSelector(
  [selectAdminProducts],
  (products) => products.filter((p) => p.status === 'Pending Approval' || p.status === 'Pending')
);

export const selectPendingRefunds = createSelector(
  [selectAdminRefunds],
  (refunds) => refunds.filter((r) => r.status === 'Requested' || r.status === 'Pending')
);

export const selectFlaggedReviews = createSelector(
  [selectAdminReviews],
  (reviews) => reviews.filter((r) => r.status === 'Flagged' || r.status === 'Pending')
);
