import { createSlice } from '@reduxjs/toolkit';
import {
  fetchAvailableCoupons,
  validateCouponCode,
  fetchSellerCoupons,
  fetchAdminCoupons,
} from './couponThunk';

const INITIAL_AVAILABLE_OFFERS = [
  {
    id: 'c-offer-1',
    code: 'ZAREEN10',
    type: 'percentage',
    value: 10,
    minSpend: 100,
    maxDiscount: 200,
    description: '10% private privilege on all master acquisitions above $100.',
    expiry: '2026-12-31',
    applicableTo: 'All Departments',
  },
  {
    id: 'c-offer-2',
    code: 'ROYAL50',
    type: 'fixed',
    value: 50,
    minSpend: 300,
    maxDiscount: 50,
    description: '$50 sovereign credit on curated orders exceeding $300.',
    expiry: '2026-11-30',
    applicableTo: 'Horology & Haute Couture',
  },
  {
    id: 'c-offer-3',
    code: 'MAISON20',
    type: 'percentage',
    value: 20,
    minSpend: 600,
    maxDiscount: 400,
    description: '20% VIP Maison Privilege on acquisitions over $600.',
    expiry: '2026-10-31',
    applicableTo: 'Fine Jewelry & Leather',
  },
];

const initialState = {
  availableOffers: INITIAL_AVAILABLE_OFFERS,
  sellerCoupons: [],
  adminCoupons: [],
  validatedCoupon: null,
  validationError: null,
  loading: false,
  error: null,
};

export const couponSlice = createSlice({
  name: 'coupons',
  initialState,
  reducers: {
    clearCouponValidation: (state) => {
      state.validatedCoupon = null;
      state.validationError = null;
    },
    setLocalValidation: (state, action) => {
      state.validatedCoupon = action.payload;
      state.validationError = null;
    },
    setLocalValidationError: (state, action) => {
      state.validationError = action.payload;
      state.validatedCoupon = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Available Coupons
      .addCase(fetchAvailableCoupons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAvailableCoupons.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(action.payload)) {
          state.availableOffers = action.payload;
        }
      })
      .addCase(fetchAvailableCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Validate Coupon
      .addCase(validateCouponCode.pending, (state) => {
        state.loading = true;
        state.validationError = null;
      })
      .addCase(validateCouponCode.fulfilled, (state, action) => {
        state.loading = false;
        state.validatedCoupon = action.payload;
      })
      .addCase(validateCouponCode.rejected, (state, action) => {
        state.loading = false;
        state.validationError = action.payload;
      })

      // Seller Coupons
      .addCase(fetchSellerCoupons.fulfilled, (state, action) => {
        if (Array.isArray(action.payload)) {
          state.sellerCoupons = action.payload;
        }
      })

      // Admin Coupons
      .addCase(fetchAdminCoupons.fulfilled, (state, action) => {
        if (Array.isArray(action.payload)) {
          state.adminCoupons = action.payload;
        }
      });
  },
});

export const {
  clearCouponValidation,
  setLocalValidation,
  setLocalValidationError,
} = couponSlice.actions;

export default couponSlice.reducer;
