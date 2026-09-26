import { createSlice } from '@reduxjs/toolkit';
import { fetchProductDetails, fetchProducts, searchProductsThunk } from './productThunk';

const initialFilters = {
  category: 'all',
  subcategory: 'all',
  brand: 'all',
  seller: 'all',
  minPrice: 0,
  maxPrice: 50000,
  rating: 0,
  inStockOnly: false,
  discountOnly: false,
  onlyFeatured: false,
  onlyNew: false,
  onlyBestSeller: false,
  sortBy: 'featured', // 'featured', 'newest', 'popular', 'price_asc', 'price_desc', 'rating', 'discount'
  searchQuery: '',
};

const initialState = {
  items: [],
  selectedProduct: null,
  filters: initialFilters,
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    pages: 1,
  },
  loading: false,
  error: null,
  recentSearches: ['Silk Robe', 'Diamond Ring', 'Cashmere Scarf', 'Leather Briefcase'],
  popularSearches: ['Sapphire', 'Emerald', 'Velvet Gown', 'Chronograph', 'Tuxedo', 'Kimono'],
};

export const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1; // Reset to page 1 whenever filters change
    },
    resetFilters: (state) => {
      state.filters = initialFilters;
      state.pagination.page = 1;
    },
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    setLimit: (state, action) => {
      state.pagination.limit = action.payload;
      state.pagination.page = 1;
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
    addRecentSearch: (state, action) => {
      const term = action.payload?.trim();
      if (term && !state.recentSearches.includes(term)) {
        state.recentSearches = [term, ...state.recentSearches.slice(0, 7)];
      }
    },
    clearRecentSearches: (state) => {
      state.recentSearches = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.items = action.payload.products || (Array.isArray(action.payload) ? action.payload : []);
          if (action.payload.pagination) {
            state.pagination = action.payload.pagination;
          }
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(searchProductsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchProductsThunk.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.items = action.payload.products || (Array.isArray(action.payload) ? action.payload : []);
          if (action.payload.pagination) {
            state.pagination = action.payload.pagination;
          }
        }
      })
      .addCase(searchProductsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setFilter,
  resetFilters,
  setPage,
  setLimit,
  clearSelectedProduct,
  addRecentSearch,
  clearRecentSearches,
} = productSlice.actions;

export default productSlice.reducer;
