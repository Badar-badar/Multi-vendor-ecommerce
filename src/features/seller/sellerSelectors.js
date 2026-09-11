export const selectSellerProfile = (state) => state.seller.profile;
export const selectSellerProducts = (state) => state.seller.products || [];
export const selectSellerOrders = (state) => state.seller.orders || [];
export const selectSellerReturns = (state) => state.seller.returns || [];
export const selectSellerNotifications = (state) => state.seller.notifications || [];
export const selectSellerAnalytics = (state) => state.seller.analytics || {};
export const selectSellerEarnings = (state) => state.seller.earnings || {
  grossSales: 65490,
  platformCommission: 6549,
  refundDeductions: 840,
  netEarnings: 58101,
  pendingPayout: 12450,
  paidPayout: 45651,
  settlements: [],
};
export const selectSellerApplication = (state) => state.seller.application || {
  status: state.seller.profile?.status || 'Approved',
  submittedAt: '2026-08-15T10:00:00Z',
  feedback: null,
};
export const selectSellerLoading = (state) => state.seller.loading;
export const selectSellerError = (state) => state.seller.error;
