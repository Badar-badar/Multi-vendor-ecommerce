import { createAsyncThunk } from '@reduxjs/toolkit';
import sellerApi from '../../api/sellerApi';

export const fetchSellerProfile = createAsyncThunk(
  'seller/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await sellerApi.getStore();
      const data = response.data || response;
      return data.store || data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch seller store profile');
    }
  }
);

export const updateSellerProfile = createAsyncThunk(
  'seller/updateProfile',
  async (storeData, { rejectWithValue }) => {
    try {
      const response = await sellerApi.updateStore(storeData);
      const data = response.data || response;
      return data.store || data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update store profile');
    }
  }
);

export const fetchSellerProducts = createAsyncThunk(
  'seller/fetchProducts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await sellerApi.getProducts(params);
      const data = response.data || response;
      return {
        products: data.products || (Array.isArray(data) ? data : []),
        pagination: data.pagination || { page: 1, limit: 20, total: (data.products || []).length, pages: 1 },
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch seller products');
    }
  }
);

export const createSellerProductThunk = createAsyncThunk(
  'seller/createProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const response = await sellerApi.createProduct(productData);
      const data = response.data || response;
      return data.product || data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create product');
    }
  }
);

export const updateSellerProductThunk = createAsyncThunk(
  'seller/updateProduct',
  async ({ id, data: productData }, { rejectWithValue }) => {
    try {
      const response = await sellerApi.updateProduct(id, productData);
      const data = response.data || response;
      return data.product || data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update product');
    }
  }
);

export const deleteSellerProductThunk = createAsyncThunk(
  'seller/deleteProduct',
  async (productId, { rejectWithValue }) => {
    try {
      await sellerApi.deleteProduct(productId);
      return productId;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete product');
    }
  }
);

export const fetchSellerInventory = createAsyncThunk(
  'seller/fetchInventory',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await sellerApi.getInventory(params);
      const data = response.data || response;
      return data.inventory || data.products || (Array.isArray(data) ? data : []);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch inventory');
    }
  }
);

export const updateSellerStockThunk = createAsyncThunk(
  'seller/updateStock',
  async ({ productId, stockData }, { rejectWithValue }) => {
    try {
      const response = await sellerApi.updateStock(productId, stockData);
      const data = response.data || response;
      return data.product || data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update stock');
    }
  }
);

export const fetchSellerOrders = createAsyncThunk(
  'seller/fetchOrders',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await sellerApi.getOrders(params);
      const data = response.data || response;
      return data.orders || (Array.isArray(data) ? data : []);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch seller orders');
    }
  }
);

export const updateSellerOrderStatusThunk = createAsyncThunk(
  'seller/updateOrderStatus',
  async ({ orderId, statusData }, { rejectWithValue }) => {
    try {
      const response = await sellerApi.updateOrderStatus(orderId, statusData);
      const data = response.data || response;
      return data.order || data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update order status');
    }
  }
);

export const fetchSellerReturns = createAsyncThunk(
  'seller/fetchReturns',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await sellerApi.getReturns(params);
      const data = response.data || response;
      return data.returns || (Array.isArray(data) ? data : []);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch returns');
    }
  }
);

export const fetchSellerCoupons = createAsyncThunk(
  'seller/fetchCoupons',
  async (_, { rejectWithValue }) => {
    try {
      const response = await sellerApi.getCoupons();
      const data = response.data || response;
      return data.coupons || (Array.isArray(data) ? data : []);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch coupons');
    }
  }
);

export const fetchSellerEarnings = createAsyncThunk(
  'seller/fetchEarnings',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await sellerApi.getEarnings(params);
      const data = response.data || response;
      return data.earnings || data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch earnings');
    }
  }
);

export const fetchSellerAnalytics = createAsyncThunk(
  'seller/fetchAnalytics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await sellerApi.getAnalyticsOverview();
      const data = response.data || response;
      return data.overview || data.analytics || data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch seller analytics');
    }
  }
);
