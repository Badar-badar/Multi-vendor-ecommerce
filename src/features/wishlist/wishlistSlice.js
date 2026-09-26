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
        if (action.payload) {
          const rawItems = action.payload.items || (Array.isArray(action.payload) ? action.payload : []);
          state.items = rawItems.map((it) => ({
            id: it._id || it.id || it.product?._id || it.product?.id,
            name: it.name || it.product?.name,
            slug: it.slug || it.product?.slug,
            images: it.images || it.product?.images || [],
            brand: it.brand || it.product?.brand,
            category: it.category || it.product?.category,
            price: it.price || it.product?.price || 0,
            originalPrice: it.originalPrice || it.product?.compareAtPrice || it.price || 0,
            rating: it.rating || it.product?.rating || 0,
            reviewCount: it.reviewCount || it.product?.reviewCount || 0,
            stock: it.stock ?? it.product?.stock ?? 10,
            seller: it.seller || it.product?.seller,
            addedAt: it.addedAt || Date.now(),
          }));
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
