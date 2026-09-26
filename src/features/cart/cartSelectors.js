import { createSelector } from '@reduxjs/toolkit';

export const selectCartItems = (state) => state.cart.items || [];
export const selectCartTotalQuantity = (state) => state.cart.totalQuantity || 0;
export const selectCartSubtotal = (state) => state.cart.subtotal || 0;
export const selectCartOriginalSubtotal = (state) => state.cart.originalSubtotal || 0;
export const selectCartProductSavings = (state) => state.cart.productSavings || 0;
export const selectCartCouponDiscount = (state) => state.cart.couponDiscount || 0;
export const selectCartTotalDiscount = (state) => state.cart.totalDiscount || 0;
export const selectCartCoupon = (state) => state.cart.coupon;
export const selectCartCouponError = (state) => state.cart.couponError;
export const selectCartShippingFee = (state) => state.cart.shippingFee || 0;
export const selectCartFreeShippingThreshold = (state) => state.cart.freeShippingThreshold || 300;
export const selectCartTax = (state) => state.cart.tax || 0;
export const selectCartTotal = (state) => state.cart.total || 0;
export const selectCartLoading = (state) => state.cart.loading;
export const selectCartError = (state) => state.cart.error;

// Group cart items by seller / atelier
export const selectCartGroupedBySeller = createSelector(
  [selectCartItems],
  (items) => {
    const groups = {};

    (items || []).forEach((item) => {
      if (!item) return;
      const product = item.product || {};
      
      let seller = {
        id: 'zareen-direct',
        storeName: 'Zareen Master Atelier',
        verified: true,
        country: 'France',
      };

      if (product.seller) {
        if (typeof product.seller === 'object') {
          seller = {
            id: product.seller._id || product.seller.id || 'zareen-direct',
            storeName: product.seller.storeName || product.seller.name || 'Zareen Master Atelier',
            verified: product.seller.verified ?? true,
            country: product.seller.country || 'France',
          };
        } else if (typeof product.seller === 'string') {
          seller = {
            id: product.seller,
            storeName: 'Zareen Master Atelier',
            verified: true,
            country: 'France',
          };
        }
      }

      const sellerKey = seller.id || seller.storeName || 'zareen-direct';

      if (!groups[sellerKey]) {
        groups[sellerKey] = {
          seller,
          items: [],
          sellerSubtotal: 0,
        };
      }

      groups[sellerKey].items.push(item);
      const itemUnitPrice = Number(item.price) || Number(product.price) || 0;
      const itemQty = Number(item.quantity) || 1;
      groups[sellerKey].sellerSubtotal += itemUnitPrice * itemQty;
    });

    return Object.values(groups);
  }
);

// Check if any items in the cart are out of stock or exceed inventory
export const selectCartStockIssues = createSelector(
  [selectCartItems],
  (items) => {
    const issues = [];

    (items || []).forEach((item) => {
      if (!item) return;
      const product = item.product || {};
      const stock = product.stock ?? 10;
      const itemId = item.id || item._id;
      const productName = product.name || 'Selected Creation';

      if (stock <= 0) {
        issues.push({
          itemId,
          productName,
          issue: 'out_of_stock',
          message: `${productName} is currently out of stock.`,
        });
      } else if (item.quantity > stock) {
        issues.push({
          itemId,
          productName,
          issue: 'quantity_exceeded',
          message: `Only ${stock} available for ${productName}.`,
          availableStock: stock,
        });
      }
    });

    return {
      hasIssues: issues.length > 0,
      issues,
    };
  }
);
