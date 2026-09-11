import { createSlice } from '@reduxjs/toolkit';
import {
  fetchMyReturns,
  createReturn,
  cancelReturn,
  fetchSellerReturns,
} from './returnThunk';

const INITIAL_RETURNS = [
  {
    id: 'RET-2026-0081',
    orderId: 'ZR-84920',
    orderNumber: 'ZRN-84920-7712',
    requestDate: '2026-08-30',
    status: 'Under Review',
    items: [
      {
        id: 'item-1',
        productId: 'prod-101',
        name: 'Hand-Woven Silk Trench Coat',
        brand: 'Atelier Maison',
        sellerName: 'Atelier Maison',
        sellerId: 'sel-1',
        price: 840.0,
        quantity: 1,
        selectedVariant: { Size: 'M', Color: 'Obsidian Black' },
        image: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=600&auto=format&fit=crop',
      },
    ],
    reason: 'Sizing discrepancy / Bespoke fit modification required',
    description: 'Sleeve length measures 2cm longer than bespoke tailored specification.',
    images: [
      'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=400&auto=format&fit=crop',
    ],
    refundMethod: 'Original Payment Method (Stripe)',
    refundAmount: 840.0,
    sellerResponse: null,
    timeline: [
      {
        step: 'Requested',
        title: 'Return Request Registered',
        description: 'Patron submitted return request with evidence.',
        timestamp: 'Aug 30, 2026 • 11:30 AM',
        completed: true,
      },
      {
        step: 'Under Review',
        title: 'Atelier Evaluation',
        description: 'Atelier Maison master tailor reviewing bespoke fit evidence.',
        timestamp: 'Aug 30, 2026 • 02:45 PM',
        completed: true,
      },
      {
        step: 'Approved',
        title: 'Complimentary Courier Dispatch',
        description: 'White-glove pickup courier assignment.',
        timestamp: 'Pending Decision',
        completed: false,
      },
      {
        step: 'Item Received',
        title: 'Atelier Intake & Gemological Verification',
        description: 'Physical condition authentication.',
        timestamp: 'Pending Handover',
        completed: false,
      },
      {
        step: 'Refunded',
        title: 'Sovereign Escrow Credit Released',
        description: 'Funds returned to patron account.',
        timestamp: 'Pending Inspection',
        completed: false,
      },
    ],
  },
  {
    id: 'RET-2026-0042',
    orderId: 'ZR-73194',
    orderNumber: 'ZRN-73194-5501',
    requestDate: '2026-08-20',
    status: 'Refunded',
    items: [
      {
        id: 'item-3',
        productId: 'prod-103',
        name: 'Kyoto Wabi Ceramic Tea & Matcha Set',
        brand: 'Kanso Studio',
        sellerName: 'Kanso Studio',
        sellerId: 'sel-3',
        price: 240.0,
        quantity: 1,
        selectedVariant: { Glaze: 'Smoked Obsidian' },
        image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=600&auto=format&fit=crop',
      },
    ],
    reason: 'Duplicate Acquisition / Private Gift Exchange',
    description: 'Received identical ceremonial tea service as an anniversary gift.',
    images: [],
    refundMethod: 'Original Payment Method (Apple Pay)',
    refundAmount: 240.0,
    sellerResponse: 'Atelier Kanso Studio approved return handover without deduction.',
    timeline: [
      {
        step: 'Requested',
        title: 'Return Request Registered',
        description: 'Request submitted.',
        timestamp: 'Aug 20, 2026 • 09:15 AM',
        completed: true,
      },
      {
        step: 'Approved',
        title: 'Atelier Approved',
        description: 'Return label generated.',
        timestamp: 'Aug 20, 2026 • 11:40 AM',
        completed: true,
      },
      {
        step: 'Item Received',
        title: 'Kyoto Atelier Received',
        description: 'Ceramics inspected; pristine state confirmed.',
        timestamp: 'Aug 24, 2026 • 04:10 PM',
        completed: true,
      },
      {
        step: 'Refunded',
        title: 'Refund Executed',
        description: 'Full credit of $240.00 deposited via Apple Pay escrow.',
        timestamp: 'Aug 25, 2026 • 10:00 AM',
        completed: true,
      },
    ],
  },
];

const initialState = {
  returns: INITIAL_RETURNS,
  sellerReturns: INITIAL_RETURNS,
  activeReturn: null,
  loading: false,
  error: null,
};

export const returnSlice = createSlice({
  name: 'returns',
  initialState,
  reducers: {
    setActiveReturn: (state, action) => {
      state.activeReturn = action.payload;
    },
    addLocalReturn: (state, action) => {
      const newReturn = {
        id: `RET-${Date.now().toString().slice(-4)}`,
        requestDate: new Date().toISOString().slice(0, 10),
        status: 'Requested',
        timeline: [
          {
            step: 'Requested',
            title: 'Return Request Registered',
            description: 'Submitted and awaiting atelier review.',
            timestamp: new Date().toLocaleString(),
            completed: true,
          },
          {
            step: 'Under Review',
            title: 'Atelier Evaluation',
            description: 'Curators reviewing provided reason and evidence.',
            timestamp: 'Pending',
            completed: false,
          },
          {
            step: 'Approved',
            title: 'Complimentary Courier Pickup',
            description: 'Insured collection scheduled.',
            timestamp: 'Pending',
            completed: false,
          },
          {
            step: 'Refunded',
            title: 'Sovereign Escrow Refund',
            description: 'Credit disbursed.',
            timestamp: 'Pending',
            completed: false,
          },
        ],
        ...action.payload,
      };
      state.returns.unshift(newReturn);
      state.sellerReturns.unshift(newReturn);
    },
    updateReturnStatusLocal: (state, action) => {
      const { returnId, status, sellerResponse } = action.payload;
      const target = state.returns.find((r) => r.id === returnId);
      if (target) {
        target.status = status;
        if (sellerResponse) target.sellerResponse = sellerResponse;
      }
      const sellerTarget = state.sellerReturns.find((r) => r.id === returnId);
      if (sellerTarget) {
        sellerTarget.status = status;
        if (sellerResponse) sellerTarget.sellerResponse = sellerResponse;
      }
    },
    cancelLocalReturn: (state, action) => {
      const returnId = action.payload;
      const target = state.returns.find((r) => r.id === returnId);
      if (target) target.status = 'Cancelled';
      const sellerTarget = state.sellerReturns.find((r) => r.id === returnId);
      if (sellerTarget) sellerTarget.status = 'Cancelled';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyReturns.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyReturns.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(action.payload) && action.payload.length > 0) {
          state.returns = action.payload;
        }
      })
      .addCase(fetchMyReturns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createReturn.fulfilled, (state, action) => {
        if (action.payload) {
          state.returns.unshift(action.payload);
        }
      })
      .addCase(fetchSellerReturns.fulfilled, (state, action) => {
        if (Array.isArray(action.payload) && action.payload.length > 0) {
          state.sellerReturns = action.payload;
        }
      });
  },
});

export const {
  setActiveReturn,
  addLocalReturn,
  updateReturnStatusLocal,
  cancelLocalReturn,
} = returnSlice.actions;

export default returnSlice.reducer;
