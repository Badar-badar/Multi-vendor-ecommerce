import { createSlice } from '@reduxjs/toolkit';
import {
  createOrder,
  fetchMyOrders,
  fetchOrderDetails,
  cancelOrderThunk,
  requestReturnThunk,
} from './orderThunk';

const initialState = {
  orders: [],
  currentOrder: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  },
  loading: false,
  error: null,
};

export const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
    },
    cancelOrderAction: (state, action) => {
      const { orderId, reason } = action.payload;
      const order = state.orders.find((o) => (o._id || o.id) === orderId || o.orderNumber === orderId);
      if (order) {
        order.orderStatus = 'cancelled';
        order.status = 'Cancelled';
        order.cancelReason = reason;
        if (state.currentOrder && ((state.currentOrder._id || state.currentOrder.id) === orderId || state.currentOrder.orderNumber === orderId)) {
          state.currentOrder.orderStatus = 'cancelled';
          state.currentOrder.status = 'Cancelled';
          state.currentOrder.cancelReason = reason;
        }
      }
    },
    requestReturnAction: (state, action) => {
      const { orderId, reason, refundMethod } = action.payload;
      const order = state.orders.find((o) => (o._id || o.id) === orderId || o.orderNumber === orderId);
      if (order) {
        order.orderStatus = 'returned';
        order.status = 'Return Requested';
        order.returnReason = reason;
        order.refundMethod = refundMethod;
        if (state.currentOrder && ((state.currentOrder._id || state.currentOrder.id) === orderId || state.currentOrder.orderNumber === orderId)) {
          state.currentOrder.orderStatus = 'returned';
          state.currentOrder.status = 'Return Requested';
          state.currentOrder.returnReason = reason;
        }
      }
    },
    clearOrderError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.orders = action.payload.orders || (Array.isArray(action.payload) ? action.payload : []);
          if (action.payload.pagination) {
            state.pagination = action.payload.pagination;
          }
        }
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchOrderDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.orders.unshift(action.payload);
          state.currentOrder = action.payload;
        }
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(cancelOrderThunk.fulfilled, (state, action) => {
        if (action.payload) {
          const updated = action.payload;
          const idx = state.orders.findIndex((o) => (o._id || o.id) === (updated._id || updated.id));
          if (idx > -1) state.orders[idx] = updated;
          if (state.currentOrder && (state.currentOrder._id || state.currentOrder.id) === (updated._id || updated.id)) {
            state.currentOrder = updated;
          }
        }
      })
      .addCase(requestReturnThunk.fulfilled, (state, action) => {
        if (action.payload) {
          const updated = action.payload;
          const idx = state.orders.findIndex((o) => (o._id || o.id) === (updated._id || updated.id));
          if (idx > -1) state.orders[idx] = updated;
          if (state.currentOrder && (state.currentOrder._id || state.currentOrder.id) === (updated._id || updated.id)) {
            state.currentOrder = updated;
          }
        }
      });
  },
});

export const {
  setCurrentOrder,
  cancelOrderAction,
  requestReturnAction,
  clearOrderError,
} = orderSlice.actions;

export default orderSlice.reducer;
