import { createSlice } from '@reduxjs/toolkit';
import {
  mockAdminMetrics,
  mockAdminUsers,
  mockAdminSellers,
  mockAdminProducts,
  mockAdminCategories,
  mockAdminSubcategories,
  mockAdminBrands,
  mockAdminOrders,
  mockAdminPayments,
  mockAdminRefunds,
  mockAdminCommissions,
  mockAdminReviews,
  mockAdminCoupons,
  mockAdminPromotions,
  mockAdminNotifications,
  mockAdminAuditLogs,
  mockAdminSettings,
} from '../../data/adminMockData';
import {
  fetchAdminDashboard,
  fetchAdminUsers,
  fetchAdminSellers,
  fetchAdminProducts,
  fetchAdminCategories,
  fetchAdminOrders,
  fetchAdminPayments,
  fetchAdminCommissions,
  fetchAdminReviews,
  fetchAdminCoupons,
  fetchAdminAuditLogs,
  fetchAdminSettings,
} from './adminThunk';

const initialState = {
  metrics: mockAdminMetrics,
  timeframe: '6m',
  users: mockAdminUsers,
  sellers: mockAdminSellers,
  products: mockAdminProducts,
  categories: mockAdminCategories,
  subcategories: mockAdminSubcategories,
  brands: mockAdminBrands,
  orders: mockAdminOrders,
  payments: mockAdminPayments,
  refunds: mockAdminRefunds,
  commissions: mockAdminCommissions,
  reviews: mockAdminReviews,
  coupons: mockAdminCoupons,
  promotions: mockAdminPromotions,
  notifications: mockAdminNotifications,
  auditLogs: mockAdminAuditLogs,
  settings: mockAdminSettings,
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setTimeframe: (state, action) => {
      state.timeframe = action.payload;
    },
    updateUserStatusLocal: (state, action) => {
      const { userId, status } = action.payload;
      const user = state.users.find((u) => u.id === userId);
      if (user) user.status = status;
    },
    updateSellerStatusLocal: (state, action) => {
      const { sellerId, status } = action.payload;
      const seller = state.sellers.find((s) => s.id === sellerId);
      if (seller) {
        seller.status = status;
        if (status === 'Approved') seller.approvedDate = new Date().toISOString().slice(0, 10);
      }
    },
    updateProductStatusLocal: (state, action) => {
      const { productId, status } = action.payload;
      const product = state.products.find((p) => p.id === productId);
      if (product) product.status = status;
    },
    deleteProductLocal: (state, action) => {
      state.products = state.products.filter((p) => p.id !== action.payload);
    },
    addCategoryLocal: (state, action) => {
      state.categories.unshift(action.payload);
    },
    updateCategoryLocal: (state, action) => {
      const idx = state.categories.findIndex((c) => c.id === action.payload.id);
      if (idx !== -1) state.categories[idx] = { ...state.categories[idx], ...action.payload };
    },
    deleteCategoryLocal: (state, action) => {
      state.categories = state.categories.filter((c) => c.id !== action.payload);
    },
    addSubcategoryLocal: (state, action) => {
      state.subcategories.unshift(action.payload);
    },
    updateSubcategoryLocal: (state, action) => {
      const idx = state.subcategories.findIndex((s) => s.id === action.payload.id);
      if (idx !== -1) state.subcategories[idx] = { ...state.subcategories[idx], ...action.payload };
    },
    deleteSubcategoryLocal: (state, action) => {
      state.subcategories = state.subcategories.filter((s) => s.id !== action.payload);
    },
    addBrandLocal: (state, action) => {
      state.brands.unshift(action.payload);
    },
    updateBrandLocal: (state, action) => {
      const idx = state.brands.findIndex((b) => b.id === action.payload.id);
      if (idx !== -1) state.brands[idx] = { ...state.brands[idx], ...action.payload };
    },
    deleteBrandLocal: (state, action) => {
      state.brands = state.brands.filter((b) => b.id !== action.payload);
    },
    updateOrderStatusLocal: (state, action) => {
      const { orderId, fulfillmentStatus, paymentStatus } = action.payload;
      const order = state.orders.find((o) => o.id === orderId);
      if (order) {
        if (fulfillmentStatus) order.fulfillmentStatus = fulfillmentStatus;
        if (paymentStatus) order.paymentStatus = paymentStatus;
      }
    },
    updateRefundStatusLocal: (state, action) => {
      const { refundId, status } = action.payload;
      const ref = state.refunds.find((r) => r.id === refundId);
      if (ref) ref.status = status;
    },
    updateCommissionRateLocal: (state, action) => {
      const { sellerId, rate } = action.payload;
      const com = state.commissions.find((c) => c.sellerId === sellerId);
      if (com) com.commissionRate = rate;
      const seller = state.sellers.find((s) => s.id === sellerId);
      if (seller) seller.commissionRate = rate;
    },
    moderateReviewLocal: (state, action) => {
      const { reviewId, status } = action.payload;
      const rev = state.reviews.find((r) => r.id === reviewId);
      if (rev) rev.status = status;
    },
    addCouponLocal: (state, action) => {
      state.coupons.unshift(action.payload);
    },
    updateCouponLocal: (state, action) => {
      const idx = state.coupons.findIndex((c) => c.id === action.payload.id);
      if (idx !== -1) state.coupons[idx] = { ...state.coupons[idx], ...action.payload };
    },
    deleteCouponLocal: (state, action) => {
      state.coupons = state.coupons.filter((c) => c.id !== action.payload);
    },
    addPromotionLocal: (state, action) => {
      state.promotions.unshift(action.payload);
    },
    updatePromotionLocal: (state, action) => {
      const idx = state.promotions.findIndex((p) => p.id === action.payload.id);
      if (idx !== -1) state.promotions[idx] = { ...state.promotions[idx], ...action.payload };
    },
    deletePromotionLocal: (state, action) => {
      state.promotions = state.promotions.filter((p) => p.id !== action.payload);
    },
    markNotificationReadLocal: (state, action) => {
      const notif = state.notifications.find((n) => n.id === action.payload);
      if (notif) notif.unread = false;
    },
    markAllNotificationsReadLocal: (state) => {
      state.notifications.forEach((n) => {
        n.unread = false;
      });
    },
    updateSettingsLocal: (state, action) => {
      state.settings = { ...state.settings, ...action.payload };
    },
    addAuditLogLocal: (state, action) => {
      state.auditLogs.unshift({
        id: `LOG-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        ...action.payload,
      });
    },
  },
  extraReducers: (builder) => {
    builder
      // Dashboard
      .addCase(fetchAdminDashboard.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminDashboard.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) state.metrics = action.payload;
      })
      .addCase(fetchAdminDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Users
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        if (action.payload) state.users = action.payload;
      })
      // Sellers
      .addCase(fetchAdminSellers.fulfilled, (state, action) => {
        if (action.payload) state.sellers = action.payload;
      })
      // Products
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        if (action.payload) state.products = action.payload;
      })
      // Categories
      .addCase(fetchAdminCategories.fulfilled, (state, action) => {
        if (action.payload) state.categories = action.payload;
      })
      // Orders
      .addCase(fetchAdminOrders.fulfilled, (state, action) => {
        if (action.payload) state.orders = action.payload;
      })
      // Payments
      .addCase(fetchAdminPayments.fulfilled, (state, action) => {
        if (action.payload) state.payments = action.payload;
      })
      // Commissions
      .addCase(fetchAdminCommissions.fulfilled, (state, action) => {
        if (action.payload) state.commissions = action.payload;
      })
      // Reviews
      .addCase(fetchAdminReviews.fulfilled, (state, action) => {
        if (action.payload) state.reviews = action.payload;
      })
      // Coupons
      .addCase(fetchAdminCoupons.fulfilled, (state, action) => {
        if (action.payload) state.coupons = action.payload;
      })
      // Audit Logs
      .addCase(fetchAdminAuditLogs.fulfilled, (state, action) => {
        if (action.payload) state.auditLogs = action.payload;
      })
      // Settings
      .addCase(fetchAdminSettings.fulfilled, (state, action) => {
        if (action.payload) state.settings = action.payload;
      });
  },
});

export const {
  setTimeframe,
  updateUserStatusLocal,
  updateSellerStatusLocal,
  updateProductStatusLocal,
  deleteProductLocal,
  addCategoryLocal,
  updateCategoryLocal,
  deleteCategoryLocal,
  addSubcategoryLocal,
  updateSubcategoryLocal,
  deleteSubcategoryLocal,
  addBrandLocal,
  updateBrandLocal,
  deleteBrandLocal,
  updateOrderStatusLocal,
  updateRefundStatusLocal,
  updateCommissionRateLocal,
  moderateReviewLocal,
  addCouponLocal,
  updateCouponLocal,
  deleteCouponLocal,
  addPromotionLocal,
  updatePromotionLocal,
  deletePromotionLocal,
  markNotificationReadLocal,
  markAllNotificationsReadLocal,
  updateSettingsLocal,
  addAuditLogLocal,
} = adminSlice.actions;

export default adminSlice.reducer;
