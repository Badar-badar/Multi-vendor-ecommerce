import { createSlice } from '@reduxjs/toolkit';
import {
  createPaymentIntentThunk,
  confirmPaymentThunk,
  fetchPaymentStatusThunk,
  fetchCustomerPaymentsThunk,
  fetchAdminPaymentsThunk,
} from './paymentThunk';

const initialState = {
  // Current active payment intent for checkout
  clientSecret: null,
  paymentIntentId: null,
  paymentStatus: 'idle', // 'idle' | 'awaiting_payment' | 'processing' | 'paid' | 'failed' | 'cancelled'
  paymentError: null,
  isProcessingPayment: false,
  selectedPaymentMethod: 'card', // 'card' | 'cod' | 'bank_transfer' | 'wallet'

  // Customer payment history (/account/payments)
  customerPayments: [],
  customerPaymentsLoading: false,
  customerPaymentsPagination: {
    page: 1,
    limit: 10,
    totalPages: 1,
    totalCount: 0,
  },

  // Admin payment transactions (/admin/payments)
  adminPayments: [],
  adminPaymentsLoading: false,
  adminPaymentsPagination: {
    page: 1,
    limit: 15,
    totalPages: 1,
    totalCount: 0,
  },
  adminPaymentStats: {
    totalVolume: 0,
    netRevenue: 0,
    processingFees: 0,
    refundedVolume: 0,
    successfulTransactionsCount: 0,
  },
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    setSelectedPaymentMethod: (state, action) => {
      state.selectedPaymentMethod = action.payload;
    },
    resetPaymentState: (state) => {
      state.clientSecret = null;
      state.paymentIntentId = null;
      state.paymentStatus = 'idle';
      state.paymentError = null;
      state.isProcessingPayment = false;
    },
    setPaymentStatus: (state, action) => {
      state.paymentStatus = action.payload;
    },
    clearPaymentError: (state) => {
      state.paymentError = null;
    },
  },
  extraReducers: (builder) => {
    // createPaymentIntent
    builder
      .addCase(createPaymentIntentThunk.pending, (state) => {
        state.isProcessingPayment = true;
        state.paymentError = null;
        state.paymentStatus = 'processing';
      })
      .addCase(createPaymentIntentThunk.fulfilled, (state, action) => {
        state.isProcessingPayment = false;
        state.clientSecret = action.payload?.clientSecret || null;
        state.paymentIntentId = action.payload?.paymentIntentId || action.payload?.id || null;
        state.paymentStatus = action.payload?.status || 'awaiting_payment';
      })
      .addCase(createPaymentIntentThunk.rejected, (state, action) => {
        state.isProcessingPayment = false;
        state.paymentError = action.payload || 'Failed to initialize payment intent.';
        state.paymentStatus = 'failed';
      });

    // confirmPayment
    builder
      .addCase(confirmPaymentThunk.pending, (state) => {
        state.isProcessingPayment = true;
        state.paymentError = null;
        state.paymentStatus = 'processing';
      })
      .addCase(confirmPaymentThunk.fulfilled, (state, action) => {
        state.isProcessingPayment = false;
        state.paymentStatus = action.payload?.status || 'paid';
      })
      .addCase(confirmPaymentThunk.rejected, (state, action) => {
        state.isProcessingPayment = false;
        state.paymentError = action.payload || 'Payment verification failed.';
        state.paymentStatus = 'failed';
      });

    // fetchPaymentStatus
    builder
      .addCase(fetchPaymentStatusThunk.fulfilled, (state, action) => {
        if (action.payload?.status) {
          state.paymentStatus = action.payload.status;
        }
      });

    // fetchCustomerPayments
    builder
      .addCase(fetchCustomerPaymentsThunk.pending, (state) => {
        state.customerPaymentsLoading = true;
      })
      .addCase(fetchCustomerPaymentsThunk.fulfilled, (state, action) => {
        state.customerPaymentsLoading = false;
        state.customerPayments = action.payload?.payments || action.payload?.data || [];
        if (action.payload?.pagination) {
          state.customerPaymentsPagination = action.payload.pagination;
        }
      })
      .addCase(fetchCustomerPaymentsThunk.rejected, (state) => {
        state.customerPaymentsLoading = false;
      });

    // fetchAdminPayments
    builder
      .addCase(fetchAdminPaymentsThunk.pending, (state) => {
        state.adminPaymentsLoading = true;
      })
      .addCase(fetchAdminPaymentsThunk.fulfilled, (state, action) => {
        state.adminPaymentsLoading = false;
        state.adminPayments = action.payload?.payments || action.payload?.data || [];
        if (action.payload?.pagination) {
          state.adminPaymentsPagination = action.payload.pagination;
        }
        if (action.payload?.stats) {
          state.adminPaymentStats = action.payload.stats;
        }
      })
      .addCase(fetchAdminPaymentsThunk.rejected, (state) => {
        state.adminPaymentsLoading = false;
      });
  },
});

export const {
  setSelectedPaymentMethod,
  resetPaymentState,
  setPaymentStatus,
  clearPaymentError,
} = paymentSlice.actions;

export default paymentSlice.reducer;
