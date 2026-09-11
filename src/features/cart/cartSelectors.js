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

    items.forEach((item) => {
      const seller = item.product?.seller || {
        id: 'zareen-direct',
        storeName: 'Zareen Master Atelier',
        verified: true,
        country: 'France',
      };

      const sellerKey = seller.id || seller.storeName || 'zareen-direct';

      if (!groups[sellerKey]) {
        groups[sellerKey] = {
          seller,
          items: [],
          sellerSubtotal: 0,
        };
      }

      groups[sellerKey].items.push(item);
      groups[sellerKey].sellerSubtotal += (Number(item.price) || 0) * (Number(item.quantity) || 1);
    });

    return Object.values(groups);
  }
);

// Check if any items in the cart are out of stock or exceed inventory
export const selectCartStockIssues = createSelector(
  [selectCartItems],
  (items) => {
    const issues = [];

    items.forEach((item) => {
      const stock = item.product?.stock ?? 10;
      if (stock <= 0) {
        issues.push({
          itemId: item.id,
          productName: item.product?.name,
          issue: 'out_of_stock',
          message: `${item.product?.name} is currently out of stock.`,
        });
      } else if (item.quantity > stock) {
        issues.push({
          itemId: item.id,
          productName: item.product?.name,
          issue: 'quantity_exceeded',
          message: `Only ${stock} available for ${item.product?.name}.`,
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
