import { createAsyncThunk } from '@reduxjs/toolkit';
import orderApi from '../../api/orderApi';

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async ({ orderData, idempotencyKey }, { rejectWithValue }) => {
    try {
      const response = await orderApi.createOrder(orderData, idempotencyKey);
      const data = response.data || response;
      return data.order || data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to place order');
    }
  }
);

export const fetchMyOrders = createAsyncThunk(
  'orders/fetchMyOrders',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await orderApi.getMyOrders(params);
      const data = response.data || response;
      return {
        orders: data.orders || (Array.isArray(data) ? data : []),
        pagination: data.pagination || { page: 1, limit: 10, total: (data.orders || []).length, pages: 1 },
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch orders');
    }
  }
);

export const fetchOrderDetails = createAsyncThunk(
  'orders/fetchOrderDetails',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await orderApi.getOrderById(orderId);
      const data = response.data || response;
      return data.order || data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch order details');
    }
  }
);

export const cancelOrderThunk = createAsyncThunk(
  'orders/cancelOrder',
  async ({ orderId, reason }, { rejectWithValue }) => {
    try {
      const response = await orderApi.cancelOrder(orderId, reason);
      const data = response.data || response;
      return data.order || data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to cancel order');
    }
  }
);

export const requestReturnThunk = createAsyncThunk(
  'orders/requestReturn',
  async ({ orderId, returnData }, { rejectWithValue }) => {
    try {
      const response = await orderApi.requestReturn(orderId, returnData);
      const data = response.data || response;
      return data.order || data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to request return');
    }
  }
);

export const reorderThunk = createAsyncThunk(
  'orders/reorder',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await orderApi.reorder(orderId);
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to reorder');
    }
  }
);
