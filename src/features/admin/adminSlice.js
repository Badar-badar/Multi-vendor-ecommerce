import { createSlice } from '@reduxjs/toolkit';
import {
  fetchAdminDashboard,
  fetchAdminSellers,
  fetchAdminProducts,
  fetchAdminCategories,
  fetchAdminSubcategories,
  fetchAdminBrands,
  fetchAdminOrders,
  fetchAdminPayments,
  fetchAdminRefunds,
  fetchAdminCommissions,
  fetchAdminReviews,
  fetchAdminCoupons,
  fetchAdminSettings,
} from './adminThunk';

const initialState = {
  metrics: null,
  timeframe: '30d',
  sellers: [],
  users: [],
  products: [],
  categories: [],
  subcategories: [],
  brands: [],
  orders: [],
  payments: [],
  refunds: [],
  commissions: [],
  reviews: [],
  coupons: [],
  settings: null,
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
    updateSellerStatusLocal: (state, action) => {
      const { sellerId, status } = action.payload;
      const seller = state.sellers.find((s) => (s._id || s.id) === sellerId);
      if (seller) {
        seller.status = status;
      }
    },
    updateProductStatusLocal: (state, action) => {
      const { productId, status } = action.payload;
      const product = state.products.find((p) => (p._id || p.id) === productId);
      if (product) product.status = status;
    },
    deleteProductLocal: (state, action) => {
      state.products = state.products.filter((p) => (p._id || p.id) !== action.payload);
    },
    addCategoryLocal: (state, action) => {
      state.categories.unshift(action.payload);
    },
    updateCategoryLocal: (state, action) => {
      const idx = state.categories.findIndex((c) => (c._id || c.id) === (action.payload._id || action.payload.id));
      if (idx !== -1) state.categories[idx] = { ...state.categories[idx], ...action.payload };
    },
    deleteCategoryLocal: (state, action) => {
      state.categories = state.categories.filter((c) => (c._id || c.id) !== action.payload);
    },
    addSubcategoryLocal: (state, action) => {
      state.subcategories.unshift(action.payload);
    },
    updateSubcategoryLocal: (state, action) => {
      const idx = state.subcategories.findIndex((s) => (s._id || s.id) === (action.payload._id || action.payload.id));
      if (idx !== -1) state.subcategories[idx] = { ...state.subcategories[idx], ...action.payload };
    },
    deleteSubcategoryLocal: (state, action) => {
      state.subcategories = state.subcategories.filter((s) => (s._id || s.id) !== action.payload);
    },
    addBrandLocal: (state, action) => {
      state.brands.unshift(action.payload);
    },
    updateBrandLocal: (state, action) => {
      const idx = state.brands.findIndex((b) => (b._id || b.id) === (action.payload._id || action.payload.id));
      if (idx !== -1) state.brands[idx] = { ...state.brands[idx], ...action.payload };
    },
    deleteBrandLocal: (state, action) => {
      state.brands = state.brands.filter((b) => (b._id || b.id) !== action.payload);
    },
    updateOrderStatusLocal: (state, action) => {
      const { orderId, status } = action.payload;
      const order = state.orders.find((o) => (o._id || o.id) === orderId);
      if (order) order.status = status;
    },
    deleteReviewLocal: (state, action) => {
      state.reviews = state.reviews.filter((r) => (r._id || r.id) !== action.payload);
    },
    addCouponLocal: (state, action) => {
      state.coupons.unshift(action.payload);
    },
    toggleCouponStatusLocal: (state, action) => {
      const coupon = state.coupons.find((c) => (c._id || c.id) === action.payload);
      if (coupon) coupon.isActive = !coupon.isActive;
    },
    updateCommissionRateLocal: (state, action) => {
      const { sellerId, commissionRate } = action.payload;
      const seller = state.sellers.find((s) => (s._id || s.id) === sellerId);
      if (seller) seller.commissionRate = commissionRate;
    },
    updateUserStatusLocal: (state, action) => {
      const { userId, status, isBlocked, role } = action.payload;
      const user = state.users?.find((u) => (u._id || u.id) === userId);
      if (user) {
        if (status !== undefined) user.status = status;
        if (isBlocked !== undefined) user.isBlocked = isBlocked;
        if (role !== undefined) user.role = role;
      }
    },
    moderateReviewLocal: (state, action) => {
      const { reviewId, status } = action.payload;
      const rev = state.reviews.find((r) => (r._id || r.id) === reviewId);
      if (rev) rev.status = status;
    },
    updateCouponLocal: (state, action) => {
      const idx = state.coupons.findIndex((c) => (c._id || c.id) === (action.payload._id || action.payload.id));
      if (idx !== -1) state.coupons[idx] = { ...state.coupons[idx], ...action.payload };
    },
    addPromotionLocal: (state, action) => {
      if (!state.promotions) state.promotions = [];
      state.promotions.unshift(action.payload);
    },
    updatePromotionLocal: (state, action) => {
      if (!state.promotions) state.promotions = [];
      const idx = state.promotions.findIndex((p) => (p._id || p.id) === (action.payload._id || action.payload.id));
      if (idx !== -1) state.promotions[idx] = { ...state.promotions[idx], ...action.payload };
    },
    updateRefundStatusLocal: (state, action) => {
      const { refundId, status } = action.payload;
      const ref = state.refunds.find((r) => (r._id || r.id) === refundId);
      if (ref) ref.status = status;
    },
    updateSettingsLocal: (state, action) => {
      state.settings = { ...state.settings, ...action.payload };
    },
    markNotificationReadLocal: (state, action) => {
      // Local notification helper
    },
    markAllNotificationsReadLocal: (state) => {
      // Local notification helper
    },
    clearAdminError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Dashboard
      .addCase(fetchAdminDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.metrics = action.payload;
      })
      .addCase(fetchAdminDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Sellers
      .addCase(fetchAdminSellers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminSellers.fulfilled, (state, action) => {
        state.loading = false;
        state.sellers = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchAdminSellers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Products
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Taxonomy
      .addCase(fetchAdminCategories.fulfilled, (state, action) => {
        state.categories = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchAdminSubcategories.fulfilled, (state, action) => {
        state.subcategories = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchAdminBrands.fulfilled, (state, action) => {
        state.brands = Array.isArray(action.payload) ? action.payload : [];
      })

      // Orders
      .addCase(fetchAdminOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchAdminOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Financials
      .addCase(fetchAdminPayments.fulfilled, (state, action) => {
        state.payments = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchAdminRefunds.fulfilled, (state, action) => {
        state.refunds = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchAdminCommissions.fulfilled, (state, action) => {
        state.commissions = Array.isArray(action.payload) ? action.payload : [];
      })

      // Reviews & Coupons & Settings
      .addCase(fetchAdminReviews.fulfilled, (state, action) => {
        state.reviews = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchAdminCoupons.fulfilled, (state, action) => {
        state.coupons = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchAdminSettings.fulfilled, (state, action) => {
        state.settings = action.payload;
      });
  },
});

export const {
  setTimeframe,
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
  deleteReviewLocal,
  moderateReviewLocal,
  addCouponLocal,
  updateCouponLocal,
  toggleCouponStatusLocal,
  deleteCouponLocal,
  addPromotionLocal,
  updatePromotionLocal,
  deletePromotionLocal,
  updateCommissionRateLocal,
  updateUserStatusLocal,
  updateRefundStatusLocal,
  updateSettingsLocal,
  markNotificationReadLocal,
  markAllNotificationsReadLocal,
  clearAdminError,
} = adminSlice.actions;

export default adminSlice.reducer;
