import { createAsyncThunk } from '@reduxjs/toolkit';
import productApi from '../../api/productApi';
import { products as fallbackProducts } from '../../data/products';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await productApi.getProducts(params);
      return response.data?.products || response.data?.data || response.data || fallbackProducts;
    } catch (error) {
      console.info('API unavailable, loading local curated catalog:', error?.message);
      return fallbackProducts;
    }
  }
);

export const fetchProductDetails = createAsyncThunk(
  'products/fetchProductDetails',
  async (productIdOrSlug, { rejectWithValue }) => {
    try {
      const response = await productApi.getProductByIdOrSlug(productIdOrSlug);
      return response.data?.product || response.data?.data || response.data;
    } catch (error) {
      const found = fallbackProducts.find(
        (p) => p.id === productIdOrSlug || p.slug === productIdOrSlug
      );
      if (found) return found;
      return rejectWithValue(error.response?.data?.message || 'Product not found');
    }
  }
);

export const searchProductsThunk = createAsyncThunk(
  'products/searchProducts',
  async ({ query, params = {} }, { rejectWithValue }) => {
    try {
      const response = await productApi.searchProducts(query, params);
      return response.data?.products || response.data?.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Search failed');
    }
  }
);
