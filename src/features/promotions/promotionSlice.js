import { createSlice } from '@reduxjs/toolkit';
import { fetchActivePromotions, fetchAdminPromotions } from './promotionThunk';

const INITIAL_ACTIVE_PROMOTIONS = [
  {
    id: 'promo-1',
    title: 'Geneva Horology Salon Premiere',
    badge: 'Limited Salon',
    description: 'Complimentary bespoke alligator leather travel roll with every horological acquisition over $2,000.',
    discountText: 'Complimentary Heirloom Gift',
    category: 'Haute Horology',
    banner: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&auto=format&fit=crop&q=80',
    validUntil: '2026-10-31',
    status: 'Active',
  },
  {
    id: 'promo-2',
    title: 'Florence Fine Jewelry Showcase',
    badge: 'Artisan Spotlight',
    description: 'Enjoy 15% bespoke appreciation across selected 18k and fairmined gold creations.',
    discountText: '15% Concession',
    category: 'Fine Jewelry',
    banner: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&auto=format&fit=crop&q=80',
    validUntil: '2026-11-15',
    status: 'Active',
  },
];

const initialState = {
  activePromotions: INITIAL_ACTIVE_PROMOTIONS,
  adminPromotions: [],
  loading: false,
  error: null,
};

export const promotionSlice = createSlice({
  name: 'promotions',
  initialState,
  reducers: {
    addLocalPromotion: (state, action) => {
      state.activePromotions.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Active Promotions
      .addCase(fetchActivePromotions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivePromotions.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(action.payload)) {
          state.activePromotions = action.payload;
        }
      })
      .addCase(fetchActivePromotions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Admin Promotions
      .addCase(fetchAdminPromotions.fulfilled, (state, action) => {
        if (Array.isArray(action.payload)) {
          state.adminPromotions = action.payload;
        }
      });
  },
});

export const { addLocalPromotion } = promotionSlice.actions;

export default promotionSlice.reducer;
