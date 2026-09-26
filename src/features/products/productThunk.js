import { createAsyncThunk } from '@reduxjs/toolkit';
import productApi from '../../api/productApi';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await productApi.getProducts(params);
      const data = response.data || response;
      return {
        products: data.products || (Array.isArray(data) ? data : []),
        pagination: data.pagination || { page: 1, limit: 12, total: (data.products || []).length, pages: 1 },
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch catalog');
    }
  }
);

export const fetchProductDetails = createAsyncThunk(
  'products/fetchProductDetails',
  async (productIdOrSlug, { rejectWithValue }) => {
    try {
      const response = await productApi.getProductByIdOrSlug(productIdOrSlug);
      const data = response.data || response;
      return data.product || data;
    } catch (error) {
      return rejectWithValue(error.message || 'Product not found');
    }
  }
);

export const searchProductsThunk = createAsyncThunk(
  'products/searchProducts',
  async ({ query, params = {} }, { rejectWithValue }) => {
    try {
      const response = await productApi.searchProducts(query, params);
      const data = response.data || response;
      return {
        products: data.products || (Array.isArray(data) ? data : []),
        pagination: data.pagination || { page: 1, limit: 12, total: (data.products || []).length, pages: 1 },
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Search failed');
    }
  }
);
