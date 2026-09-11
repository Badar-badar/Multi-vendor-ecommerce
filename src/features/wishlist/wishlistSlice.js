import { createSlice } from '@reduxjs/toolkit';
import { STORAGE_KEYS } from '../../utils/constants';
import { getStorageItem, setStorageItem } from '../../utils/storage';
import { syncWishlist } from './wishlistThunk';

const initialItems = getStorageItem(STORAGE_KEYS.WISHLIST, []);

const initialState = {
  items: Array.isArray(initialItems) ? initialItems : [],
  loading: false,
  error: null,
};

export const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlist: (state, action) => {
      const product = action.payload;
      if (!product || !product.id) return;

      const exists = state.items.some((item) => item.id === product.id);
      if (exists) {
        state.items = state.items.filter((item) => item.id !== product.id);
      } else {
        state.items.unshift({
          id: product.id,
          name: product.name,
          slug: product.slug || product.id,
          images: product.images || [],
          brand: product.brand,
          category: product.category,
          price: product.price,
          originalPrice: product.originalPrice || product.price,
          rating: product.rating,
          reviewCount: product.reviewCount,
          stock: product.stock ?? 10,
          seller: product.seller,
          addedAt: Date.now(),
        });
      }
      setStorageItem(STORAGE_KEYS.WISHLIST, state.items);
    },

    addToWishlist: (state, action) => {
      const product = action.payload;
      if (!product || !product.id) return;

      const exists = state.items.some((item) => item.id === product.id);
      if (!exists) {
        state.items.unshift({
          id: product.id,
          name: product.name,
          slug: product.slug || product.id,
          images: product.images || [],
          brand: product.brand,
          category: product.category,
          price: product.price,
          originalPrice: product.originalPrice || product.price,
          rating: product.rating,
          reviewCount: product.reviewCount,
          stock: product.stock ?? 10,
          seller: product.seller,
          addedAt: Date.now(),
        });
        setStorageItem(STORAGE_KEYS.WISHLIST, state.items);
      }
    },

    removeFromWishlist: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter((item) => item.id !== productId);
      setStorageItem(STORAGE_KEYS.WISHLIST, state.items);
    },

    clearWishlist: (state) => {
      state.items = [];
      setStorageItem(STORAGE_KEYS.WISHLIST, []);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(syncWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(syncWishlist.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.items) {
          state.items = action.payload.items;
          setStorageItem(STORAGE_KEYS.WISHLIST, state.items);
        }
      })
      .addCase(syncWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  toggleWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
