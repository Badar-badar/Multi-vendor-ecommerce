import { createSlice } from '@reduxjs/toolkit';
import {
  validateCheckoutSessionThunk,
  calculateCheckoutTotalsThunk,
  checkStockAvailabilityThunk,
  createCheckoutOrderThunk,
} from './checkoutThunk';

const generateIdempotencyKey = () => {
  return 'idem_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
};

const initialState = {
  currentStep: 1, // 1: Address, 2: Shipping, 3: Review, 4: Payment, 5: Confirmation
  selectedShippingAddress: null,
  selectedBillingAddress: null,
  useSameAddressForBilling: true,
  shippingMethod: 'standard', // 'standard' | 'express' | 'same_day'
  shippingCost: 0,
  sellerDeliveryNotes: {}, // { [sellerId]: string }
  orderNotes: '',
  idempotencyKey: generateIdempotencyKey(),
  
  // Totals & validation
  validatedTotals: null,
  stockIssues: [],
  isCheckingStock: false,
  isCalculatingTotals: false,
  
  // Placed Order record after successful checkout
  placedOrder: null,
  isSubmittingOrder: false,
  checkoutError: null,
};

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    setCurrentStep: (state, action) => {
      state.currentStep = action.payload;
    },
    nextStep: (state) => {
      if (state.currentStep < 5) {
        state.currentStep += 1;
      }
    },
    prevStep: (state) => {
      if (state.currentStep > 1) {
        state.currentStep -= 1;
      }
    },
    setSelectedShippingAddress: (state, action) => {
      state.selectedShippingAddress = action.payload;
      if (state.useSameAddressForBilling) {
        state.selectedBillingAddress = action.payload;
      }
    },
    setSelectedBillingAddress: (state, action) => {
      state.selectedBillingAddress = action.payload;
    },
    setUseSameAddressForBilling: (state, action) => {
      state.useSameAddressForBilling = action.payload;
      if (action.payload) {
        state.selectedBillingAddress = state.selectedShippingAddress;
      }
    },
    setShippingMethod: (state, action) => {
      state.shippingMethod = action.payload;
      if (action.payload === 'express') {
        state.shippingCost = 25;
      } else if (action.payload === 'same_day') {
        state.shippingCost = 45;
      } else {
        state.shippingCost = 0;
      }
    },
    setSellerDeliveryNote: (state, action) => {
      const { sellerId, note } = action.payload;
      state.sellerDeliveryNotes[sellerId] = note;
    },
    setOrderNotes: (state, action) => {
      state.orderNotes = action.payload;
    },
    refreshIdempotencyKey: (state) => {
      state.idempotencyKey = generateIdempotencyKey();
    },
    clearCheckoutError: (state) => {
      state.checkoutError = null;
    },
    resetCheckoutState: (state) => {
      state.currentStep = 1;
      state.selectedShippingAddress = null;
      state.selectedBillingAddress = null;
      state.useSameAddressForBilling = true;
      state.shippingMethod = 'standard';
      state.shippingCost = 0;
      state.sellerDeliveryNotes = {};
      state.orderNotes = '';
      state.idempotencyKey = generateIdempotencyKey();
      state.validatedTotals = null;
      state.stockIssues = [];
      state.placedOrder = null;
      state.isSubmittingOrder = false;
      state.checkoutError = null;
    },
  },
  extraReducers: (builder) => {
    // validateCheckoutSession
    builder
      .addCase(validateCheckoutSessionThunk.fulfilled, (state, action) => {
        if (action.payload?.totals) {
          state.validatedTotals = action.payload.totals;
        }
      });

    // calculateCheckoutTotals
    builder
      .addCase(calculateCheckoutTotalsThunk.pending, (state) => {
        state.isCalculatingTotals = true;
      })
      .addCase(calculateCheckoutTotalsThunk.fulfilled, (state, action) => {
        state.isCalculatingTotals = false;
        state.validatedTotals = action.payload;
      })
      .addCase(calculateCheckoutTotalsThunk.rejected, (state) => {
        state.isCalculatingTotals = false;
      });

    // checkStockAvailability
    builder
      .addCase(checkStockAvailabilityThunk.pending, (state) => {
        state.isCheckingStock = true;
        state.stockIssues = [];
      })
      .addCase(checkStockAvailabilityThunk.fulfilled, (state, action) => {
        state.isCheckingStock = false;
        state.stockIssues = action.payload?.unavailableItems || [];
      })
      .addCase(checkStockAvailabilityThunk.rejected, (state) => {
        state.isCheckingStock = false;
      });

    // createCheckoutOrder
    builder
      .addCase(createCheckoutOrderThunk.pending, (state) => {
        state.isSubmittingOrder = true;
        state.checkoutError = null;
      })
      .addCase(createCheckoutOrderThunk.fulfilled, (state, action) => {
        state.isSubmittingOrder = false;
        state.placedOrder = action.payload?.order || action.payload;
        state.currentStep = 5;
      })
      .addCase(createCheckoutOrderThunk.rejected, (state, action) => {
        state.isSubmittingOrder = false;
        state.checkoutError = action.payload || 'Failed to place order. Please try again.';
      });
  },
});

export const {
  setCurrentStep,
  nextStep,
  prevStep,
  setSelectedShippingAddress,
  setSelectedBillingAddress,
  setUseSameAddressForBilling,
  setShippingMethod,
  setSellerDeliveryNote,
  setOrderNotes,
  refreshIdempotencyKey,
  clearCheckoutError,
  resetCheckoutState,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
