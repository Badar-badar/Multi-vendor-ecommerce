import { createSlice } from '@reduxjs/toolkit';
import { STORAGE_KEYS } from '../../utils/constants';
import { getStorageItem, setStorageItem } from '../../utils/storage';

const initialItems = getStorageItem(STORAGE_KEYS.RECENTLY_VIEWED, []);

const initialState = {
  items: Array.isArray(initialItems) ? initialItems : [],
};

export const recentlyViewedSlice = createSlice({
  name: 'recentlyViewed',
  initialState,
  reducers: {
    addRecentlyViewed: (state, action) => {
      const product = action.payload;
      if (!product || !product.id) return;

      // Filter out if already in list to move to top
      const filtered = state.items.filter((item) => item.id !== product.id);

      // Add to front and limit to 15 items
      const updated = [
        {
          id: product.id,
          name: product.name,
          slug: product.slug || product.id,
          brand: product.brand,
          price: product.price,
          originalPrice: product.originalPrice,
          images: product.images,
          rating: product.rating,
          reviewCount: product.reviewCount,
          stock: product.stock,
          seller: product.seller,
          category: product.category,
          viewedAt: Date.now(),
        },
        ...filtered,
      ].slice(0, 15);

      state.items = updated;
      setStorageItem(STORAGE_KEYS.RECENTLY_VIEWED, updated);
    },
    clearRecentlyViewed: (state) => {
      state.items = [];
      setStorageItem(STORAGE_KEYS.RECENTLY_VIEWED, []);
    },
  },
});

export const { addRecentlyViewed, clearRecentlyViewed } = recentlyViewedSlice.actions;
export default recentlyViewedSlice.reducer;
