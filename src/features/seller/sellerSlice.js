import { createSlice } from '@reduxjs/toolkit';
import {
  fetchSellerProfile,
  updateSellerProfile,
  fetchSellerProducts,
  createSellerProductThunk,
  updateSellerProductThunk,
  deleteSellerProductThunk,
  fetchSellerInventory,
  updateSellerStockThunk,
  fetchSellerOrders,
  updateSellerOrderStatusThunk,
  fetchSellerReturns,
  fetchSellerCoupons,
  fetchSellerEarnings,
  fetchSellerAnalytics,
} from './sellerThunk';

const initialState = {
  profile: null,
  products: [],
  inventory: [],
  orders: [],
  returns: [],
  coupons: [],
  earnings: null,
  analytics: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    pages: 1,
  },
  loading: false,
  error: null,
};

export const sellerSlice = createSlice({
  name: 'seller',
  initialState,
  reducers: {
    setSellerProfile: (state, action) => {
      state.profile = action.payload;
    },
    updateStoreProfile: (state, action) => {
      state.profile = { ...state.profile, ...action.payload };
    },
    addProduct: (state, action) => {
      state.products.unshift(action.payload);
    },
    updateProduct: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.products.findIndex((p) => (p._id || p.id) === id);
      if (index > -1) {
        state.products[index] = { ...state.products[index], ...updates };
      }
    },
    deleteProduct: (state, action) => {
      const id = action.payload;
      state.products = state.products.filter((p) => (p._id || p.id) !== id);
    },
    updateInventoryStock: (state, action) => {
      const { id, stock, lowStockThreshold } = action.payload;
      const product = state.products.find((p) => (p._id || p.id) === id);
      if (product) {
        if (stock !== undefined) product.stock = Number(stock);
        if (lowStockThreshold !== undefined) product.lowStockThreshold = Number(lowStockThreshold);
      }
    },
    updateOrderStatus: (state, action) => {
      const { orderId, status, trackingNumber } = action.payload;
      const order = state.orders.find((o) => (o._id || o.id) === orderId || o.orderNumber === orderId);
      if (order) {
        order.status = status;
        if (trackingNumber) order.trackingNumber = trackingNumber;
      }
    },
    updateReturnStatus: (state, action) => {
      const { returnId, status } = action.payload;
      const ret = state.returns.find((r) => (r._id || r.id) === returnId);
      if (ret) {
        ret.status = status;
      }
    },
    markSellerNotificationRead: (state, action) => {
      // Local notification helper
    },
    markAllSellerNotificationsRead: (state) => {
      // Local notification helper
    },
    deleteSellerNotification: (state, action) => {
      // Local notification helper
    },
    addCoupon: (state, action) => {
      state.coupons.unshift(action.payload);
    },
    deleteCoupon: (state, action) => {
      state.coupons = state.coupons.filter((c) => (c._id || c.id) !== action.payload);
    },
    toggleCouponStatus: (state, action) => {
      const c = state.coupons.find((cp) => (cp._id || cp.id) === action.payload);
      if (c) c.isActive = !c.isActive;
    },
    clearSellerError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Profile
      .addCase(fetchSellerProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSellerProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchSellerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateSellerProfile.fulfilled, (state, action) => {
        if (action.payload) state.profile = action.payload;
      })

      // Products
      .addCase(fetchSellerProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSellerProducts.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.products = action.payload.products || (Array.isArray(action.payload) ? action.payload : []);
          if (action.payload.pagination) state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchSellerProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createSellerProductThunk.fulfilled, (state, action) => {
        if (action.payload) state.products.unshift(action.payload);
      })
      .addCase(updateSellerProductThunk.fulfilled, (state, action) => {
        if (action.payload) {
          const idx = state.products.findIndex((p) => (p._id || p.id) === (action.payload._id || action.payload.id));
          if (idx > -1) state.products[idx] = action.payload;
        }
      })
      .addCase(deleteSellerProductThunk.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => (p._id || p.id) !== action.payload);
      })

      // Inventory
      .addCase(fetchSellerInventory.fulfilled, (state, action) => {
        state.inventory = action.payload || [];
      })
      .addCase(updateSellerStockThunk.fulfilled, (state, action) => {
        if (action.payload) {
          const updated = action.payload;
          const idx = state.products.findIndex((p) => (p._id || p.id) === (updated._id || updated.id));
          if (idx > -1) state.products[idx] = updated;
          const invIdx = state.inventory.findIndex((i) => (i._id || i.id) === (updated._id || updated.id));
          if (invIdx > -1) state.inventory[invIdx] = updated;
        }
      })

      // Orders & Returns
      .addCase(fetchSellerOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSellerOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchSellerOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateSellerOrderStatusThunk.fulfilled, (state, action) => {
        if (action.payload) {
          const updated = action.payload;
          const idx = state.orders.findIndex((o) => (o._id || o.id) === (updated._id || updated.id));
          if (idx > -1) state.orders[idx] = updated;
        }
      })
      .addCase(fetchSellerReturns.fulfilled, (state, action) => {
        state.returns = Array.isArray(action.payload) ? action.payload : [];
      })

      // Coupons & Earnings & Analytics
      .addCase(fetchSellerCoupons.fulfilled, (state, action) => {
        state.coupons = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchSellerEarnings.fulfilled, (state, action) => {
        state.earnings = action.payload;
      })
      .addCase(fetchSellerAnalytics.fulfilled, (state, action) => {
        state.analytics = action.payload;
      });
  },
});

export const {
  setSellerProfile,
  updateStoreProfile,
  addProduct,
  updateProduct,
  deleteProduct,
  updateInventoryStock,
  updateOrderStatus,
  updateReturnStatus,
  markSellerNotificationRead,
  markAllSellerNotificationsRead,
  deleteSellerNotification,
  addCoupon,
  deleteCoupon,
  toggleCouponStatus,
  clearSellerError,
} = sellerSlice.actions;

export default sellerSlice.reducer;
