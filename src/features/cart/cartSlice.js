import { createSlice } from '@reduxjs/toolkit';
import { STORAGE_KEYS } from '../../utils/constants';
import { getStorageItem, setStorageItem } from '../../utils/storage';
import { syncCartWithBackend } from './cartThunk';

const initialItems = getStorageItem(STORAGE_KEYS.CART, []);
const initialCoupon = getStorageItem('zareen_cart_coupon', null);

// Valid coupons for demo and real-world frontend promotion logic
export const AVAILABLE_COUPONS = {
  ZAREEN10: {
    code: 'ZAREEN10',
    type: 'percentage',
    value: 10,
    minSpend: 100,
    description: '10% off on all master acquisitions',
  },
  ROYAL50: {
    code: 'ROYAL50',
    type: 'fixed',
    value: 50,
    minSpend: 300,
    description: '$50 sovereign credit on orders over $300',
  },
  MAISON20: {
    code: 'MAISON20',
    type: 'percentage',
    value: 20,
    minSpend: 600,
    description: '20% VIP Maison Privilege over $600',
  },
};

const calculateCartFinancials = (items, coupon = null) => {
  const totalQuantity = items.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
  
  // Calculate raw subtotal and original gross
  const subtotal = items.reduce((sum, item) => {
    const unitPrice = Number(item.price) || 0;
    return sum + unitPrice * (Number(item.quantity) || 1);
  }, 0);

  const originalSubtotal = items.reduce((sum, item) => {
    const originalUnitPrice = Number(item.originalPrice) || Number(item.price) || 0;
    return sum + originalUnitPrice * (Number(item.quantity) || 1);
  }, 0);

  const productSavings = Math.max(0, originalSubtotal - subtotal);

  // Coupon discount calculation
  let couponDiscount = 0;
  if (coupon && subtotal >= (coupon.minSpend || 0)) {
    if (coupon.type === 'percentage') {
      couponDiscount = Math.round(subtotal * (coupon.value / 100));
    } else if (coupon.type === 'fixed') {
      couponDiscount = Math.min(subtotal, coupon.value);
    }
  }

  const totalDiscount = productSavings + couponDiscount;

  // Complimentary insured shipping for orders over $300, otherwise $35 white-glove flat fee
  const freeShippingThreshold = 300;
  const shippingFee = items.length === 0 || subtotal >= freeShippingThreshold ? 0 : 35;

  // Estimated tax (8%) on discounted subtotal
  const taxableAmount = Math.max(0, subtotal - couponDiscount);
  const tax = Math.round(taxableAmount * 0.08);

  const total = Math.max(0, taxableAmount + shippingFee + tax);

  return {
    totalQuantity,
    subtotal,
    originalSubtotal,
    productSavings,
    couponDiscount,
    totalDiscount,
    freeShippingThreshold,
    shippingFee,
    tax,
    total,
  };
};

const initialFinancials = calculateCartFinancials(initialItems, initialCoupon);

const initialState = {
  items: Array.isArray(initialItems) ? initialItems : [],
  coupon: initialCoupon,
  couponError: null,
  ...initialFinancials,
  loading: false,
  error: null,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1, selectedVariant = null, selectedVariants = null } = action.payload;
      if (!product) return;

      const variantData = selectedVariant || selectedVariants || null;
      const variantKey = variantData && typeof variantData === 'object'
        ? Object.entries(variantData)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([k, v]) => `${k}:${v}`)
            .join('|')
        : typeof variantData === 'string'
        ? variantData
        : 'default';

      const prodId = product.id || product._id;

      const existingIndex = state.items.findIndex(
        (item) => (item.product?.id === prodId || item.product?._id === prodId) && item.variantKey === variantKey
      );

      const maxStock = product.stock ?? 10;

      if (existingIndex > -1) {
        const newQty = (state.items[existingIndex].quantity || 1) + quantity;
        state.items[existingIndex].quantity = Math.min(newQty, maxStock);
      } else {
        const firstImg = Array.isArray(product.images) && product.images.length > 0
          ? (typeof product.images[0] === 'string' ? product.images[0] : product.images[0]?.url)
          : (product.image || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=400&auto=format&fit=crop');

        state.items.push({
          id: `${prodId}-${variantKey}-${Date.now()}`,
          product: {
            id: prodId,
            _id: prodId,
            name: product.name,
            slug: product.slug || prodId,
            images: Array.isArray(product.images) && product.images.length > 0 ? product.images : [firstImg],
            brand: product.brand,
            category: product.category,
            stock: maxStock,
            seller: product.seller || {
              id: 'sel-default',
              storeName: 'Zareen Master Atelier',
              verified: true,
              country: 'France',
            },
          },
          price: Number(product.price) || 0,
          originalPrice: Number(product.originalPrice) || Number(product.compareAtPrice) || Number(product.price) || 0,
          quantity: Math.min(quantity, maxStock),
          selectedVariant: variantData,
          variantKey,
        });
      }

      state.error = null;
      const financials = calculateCartFinancials(state.items, state.coupon);
      Object.assign(state, financials);

      setStorageItem(STORAGE_KEYS.CART, state.items);
    },

    updateQuantity: (state, action) => {
      const { itemId, quantity } = action.payload;
      const itemIndex = state.items.findIndex((i) => i.id === itemId || i._id === itemId);

      if (itemIndex > -1) {
        if (quantity <= 0) {
          state.items.splice(itemIndex, 1);
        } else {
          const maxStock = state.items[itemIndex].product?.stock ?? 10;
          state.items[itemIndex].quantity = Math.min(quantity, maxStock);
        }
      }

      const financials = calculateCartFinancials(state.items, state.coupon);
      Object.assign(state, financials);

      setStorageItem(STORAGE_KEYS.CART, state.items);
    },

    removeFromCart: (state, action) => {
      const itemId = action.payload;
      state.items = state.items.filter((i) => i.id !== itemId && i._id !== itemId);

      const financials = calculateCartFinancials(state.items, state.coupon);
      Object.assign(state, financials);

      setStorageItem(STORAGE_KEYS.CART, state.items);
    },

    applyCoupon: (state, action) => {
      const code = String(action.payload || '').trim().toUpperCase();
      const matchedCoupon = AVAILABLE_COUPONS[code];

      if (!matchedCoupon) {
        state.couponError = 'Invalid sovereign promotional code.';
        return;
      }

      if (state.subtotal < matchedCoupon.minSpend) {
        state.couponError = `Code requires a minimum acquisition of $${matchedCoupon.minSpend}.`;
        return;
      }

      state.coupon = matchedCoupon;
      state.couponError = null;
      setStorageItem('zareen_cart_coupon', matchedCoupon);

      const financials = calculateCartFinancials(state.items, state.coupon);
      Object.assign(state, financials);
    },

    removeCoupon: (state) => {
      state.coupon = null;
      state.couponError = null;
      setStorageItem('zareen_cart_coupon', null);

      const financials = calculateCartFinancials(state.items, null);
      Object.assign(state, financials);
    },

    clearCouponError: (state) => {
      state.couponError = null;
    },

    clearCart: (state) => {
      state.items = [];
      state.coupon = null;
      state.couponError = null;
      setStorageItem(STORAGE_KEYS.CART, []);
      setStorageItem('zareen_cart_coupon', null);

      const financials = calculateCartFinancials([], null);
      Object.assign(state, financials);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(syncCartWithBackend.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(syncCartWithBackend.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (action.payload) {
          const rawItems = action.payload.items || (Array.isArray(action.payload) ? action.payload : []);
          state.items = rawItems.map((it) => {
            const prod = it.product || it;
            const prodId = prod?._id || prod?.id || it._id || it.id;
            const firstImg = Array.isArray(prod?.images) && prod.images.length > 0
              ? (typeof prod.images[0] === 'string' ? prod.images[0] : prod.images[0]?.url)
              : (prod?.image || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=400&auto=format&fit=crop');

            return {
              id: it._id || it.id || `${prodId}-${Date.now()}`,
              product: {
                id: prodId,
                _id: prodId,
                name: prod?.name || 'Artisan Creation',
                slug: prod?.slug || prodId,
                images: Array.isArray(prod?.images) && prod.images.length > 0 ? prod.images : [firstImg],
                brand: prod?.brand,
                category: prod?.category,
                stock: prod?.stock ?? 10,
                seller: prod?.seller || {
                  id: 'sel-default',
                  storeName: 'Zareen Master Atelier',
                  verified: true,
                  country: 'France',
                },
              },
              quantity: Number(it.quantity) || 1,
              selectedVariant: it.selectedVariant || it.selectedVariants || it.variant || null,
              price: Number(it.price) || Number(prod?.price) || 0,
              originalPrice: Number(it.originalPrice) || Number(prod?.compareAtPrice) || Number(it.price) || Number(prod?.price) || 0,
            };
          });
          const financials = calculateCartFinancials(state.items, state.coupon);
          Object.assign(state, financials);
          setStorageItem(STORAGE_KEYS.CART, state.items);
        }
      })
      .addCase(syncCartWithBackend.rejected, (state) => {
        state.loading = false;
        // Keep fallback local state without blocking the cart view
        state.error = null;
      });
  },
});

export const {
  addToCart,
  updateQuantity,
  removeFromCart,
  applyCoupon,
  removeCoupon,
  clearCouponError,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
