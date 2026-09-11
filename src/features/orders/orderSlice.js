import { createSlice } from '@reduxjs/toolkit';
import { createOrder, fetchMyOrders } from './orderThunk';

const INITIAL_MOCK_ORDERS = [
  {
    id: 'ZR-84920',
    orderNumber: 'ZRN-84920-7712',
    createdAt: '2026-08-28',
    status: 'In Transit',
    trackingNumber: 'TRK-ZRN-981240-US',
    deliveryEstimate: 'Sept 11, 2026',
    courier: 'Sovereign White-Glove Express',
    paymentStatus: 'Paid & Authenticated',
    paymentMethodName: 'Stripe 256-Bit Encrypted Card',
    shippingAddress: {
      fullName: 'Sarah Jenkins',
      phone: '+1 (555) 019-2834',
      addressLine1: '740 Park Avenue, Penthouse 14B',
      addressLine2: 'Upper East Side',
      city: 'New York',
      state: 'NY',
      postalCode: '10021',
      country: 'United States',
    },
    items: [
      {
        id: 'item-1',
        name: 'Hand-Woven Silk Trench Coat',
        brand: 'Atelier Maison',
        seller: {
          id: 'sel-1',
          storeName: 'Atelier Maison',
          verified: true,
          country: 'France',
        },
        price: 840.0,
        originalPrice: 950.0,
        quantity: 1,
        selectedVariant: { Size: 'M', Color: 'Obsidian Black' },
        image: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=600&auto=format&fit=crop',
      },
      {
        id: 'item-2',
        name: 'Gilded Brass Chronometer',
        brand: 'Vesper Horology',
        seller: {
          id: 'sel-2',
          storeName: 'Vesper Horology',
          verified: true,
          country: 'Switzerland',
        },
        price: 1250.0,
        originalPrice: 1400.0,
        quantity: 1,
        selectedVariant: { Finish: '18K Brushed Gold' },
        image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=600&auto=format&fit=crop',
      },
    ],
    subtotal: 2090.0,
    discount: 260.0,
    shippingFee: 0.0,
    tax: 167.2,
    total: 2257.2,
    timeline: [
      {
        step: 'Order Placed',
        title: 'Acquisition Registered',
        description: 'Payment authorized & cryptographic order recorded in Zareen registry.',
        timestamp: 'Aug 28, 2026 • 10:42 AM',
        completed: true,
      },
      {
        step: 'Confirmed',
        title: 'Maison Atelier Allocation',
        description: 'Master artisans in Paris and Geneva confirmed and reserved creations.',
        timestamp: 'Aug 28, 2026 • 02:15 PM',
        completed: true,
      },
      {
        step: 'Processing',
        title: 'Bespoke Finishing & Quality Audit',
        description: 'Creations inspected for zero defects; sealed with signature gold wax seal.',
        timestamp: 'Aug 29, 2026 • 04:30 PM',
        completed: true,
      },
      {
        step: 'Shipped',
        title: 'Dispatched via White-Glove Courier',
        description: 'Customs cleared at Charles de Gaulle; air transit in progress.',
        timestamp: 'Aug 30, 2026 • 09:10 AM',
        completed: true,
      },
      {
        step: 'Out for Delivery',
        title: 'Concierge Handover Scheduled',
        description: 'Dedicated courier escort in New York metropolitan area.',
        timestamp: 'Expected Sept 11, 2026',
        completed: false,
      },
      {
        step: 'Delivered',
        title: 'Secured Handover Complete',
        description: 'Patron signature collected upon physical delivery.',
        timestamp: 'Pending Delivery',
        completed: false,
      },
    ],
  },
  {
    id: 'ZR-73194',
    orderNumber: 'ZRN-73194-5501',
    createdAt: '2026-08-15',
    status: 'Delivered',
    trackingNumber: 'TRK-ZRN-662910-US',
    deliveryEstimate: 'Aug 19, 2026',
    courier: 'Standard Insured Courier',
    paymentStatus: 'Paid & Verified',
    paymentMethodName: 'Apple Pay Biometric',
    shippingAddress: {
      fullName: 'Sarah Jenkins',
      phone: '+1 (555) 019-2834',
      addressLine1: '740 Park Avenue, Penthouse 14B',
      city: 'New York',
      state: 'NY',
      postalCode: '10021',
      country: 'United States',
    },
    items: [
      {
        id: 'item-3',
        name: 'Kyoto Wabi Ceramic Tea & Matcha Set',
        brand: 'Kanso Studio',
        seller: {
          id: 'sel-3',
          storeName: 'Kanso Studio',
          verified: true,
          country: 'Japan',
        },
        price: 240.0,
        originalPrice: 280.0,
        quantity: 1,
        selectedVariant: { Glaze: 'Smoked Obsidian' },
        image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=600&auto=format&fit=crop',
      },
    ],
    subtotal: 240.0,
    discount: 40.0,
    shippingFee: 25.0,
    tax: 19.2,
    total: 284.2,
    timeline: [
      {
        step: 'Order Placed',
        title: 'Acquisition Registered',
        description: 'Payment verified.',
        timestamp: 'Aug 15, 2026 • 11:10 AM',
        completed: true,
      },
      {
        step: 'Shipped',
        title: 'Dispatched from Kyoto',
        description: 'Insured international parcel transit.',
        timestamp: 'Aug 16, 2026 • 01:20 PM',
        completed: true,
      },
      {
        step: 'Delivered',
        title: 'Handover Completed',
        description: 'Delivered to doorman at 740 Park Avenue.',
        timestamp: 'Aug 19, 2026 • 03:45 PM',
        completed: true,
      },
    ],
  },
  {
    id: 'ZR-61029',
    orderNumber: 'ZRN-61029-9941',
    createdAt: '2026-07-22',
    status: 'Processing',
    trackingNumber: 'TRK-ZRN-440219-US',
    deliveryEstimate: 'Sept 15, 2026',
    courier: 'Sovereign White-Glove Express',
    paymentStatus: 'Paid & Authenticated',
    paymentMethodName: 'Stripe 256-Bit Encrypted Card',
    shippingAddress: {
      fullName: 'Sarah Jenkins',
      phone: '+1 (555) 019-2834',
      addressLine1: '740 Park Avenue, Penthouse 14B',
      city: 'New York',
      state: 'NY',
      postalCode: '10021',
      country: 'United States',
    },
    items: [
      {
        id: 'item-4',
        name: 'Solitaire Emerald Cut Diamond Brooch',
        brand: 'Maison de L\'Or',
        seller: {
          id: 'sel-4',
          storeName: 'Maison de L\'Or',
          verified: true,
          country: 'France',
        },
        price: 3800.0,
        originalPrice: 4200.0,
        quantity: 1,
        selectedVariant: { Metal: 'Platinum 950' },
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop',
      },
    ],
    subtotal: 3800.0,
    discount: 400.0,
    shippingFee: 0.0,
    tax: 304.0,
    total: 4104.0,
    timeline: [
      {
        step: 'Order Placed',
        title: 'Acquisition Registered',
        description: 'Escrow verification complete.',
        timestamp: 'Jul 22, 2026 • 09:30 AM',
        completed: true,
      },
      {
        step: 'Processing',
        title: 'Master Jeweler Setting & Certification',
        description: 'Gemological Institute audit in progress.',
        timestamp: 'Jul 23, 2026 • 02:00 PM',
        completed: true,
      },
    ],
  },
];

const initialState = {
  orders: INITIAL_MOCK_ORDERS,
  currentOrder: null,
  loading: false,
  error: null,
};

export const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
    },
    cancelOrderAction: (state, action) => {
      const { orderId, reason } = action.payload;
      const order = state.orders.find((o) => o.id === orderId || o.orderNumber === orderId);
      if (order) {
        order.status = 'Cancelled';
        order.cancelReason = reason;
        order.cancelledAt = new Date().toISOString();
        if (state.currentOrder && (state.currentOrder.id === orderId || state.currentOrder.orderNumber === orderId)) {
          state.currentOrder.status = 'Cancelled';
          state.currentOrder.cancelReason = reason;
        }
      }
    },
    requestReturnAction: (state, action) => {
      const { orderId, reason, refundMethod } = action.payload;
      const order = state.orders.find((o) => o.id === orderId || o.orderNumber === orderId);
      if (order) {
        order.status = 'Return Requested';
        order.returnReason = reason;
        order.refundMethod = refundMethod;
        order.returnRequestedAt = new Date().toISOString();
        if (state.currentOrder && (state.currentOrder.id === orderId || state.currentOrder.orderNumber === orderId)) {
          state.currentOrder.status = 'Return Requested';
          state.currentOrder.returnReason = reason;
          state.currentOrder.refundMethod = refundMethod;
        }
      }
    },
    clearOrderError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.length > 0) {
          state.orders = action.payload;
        }
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.unshift(action.payload);
        state.currentOrder = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setCurrentOrder,
  cancelOrderAction,
  requestReturnAction,
  clearOrderError,
} = orderSlice.actions;

export default orderSlice.reducer;
