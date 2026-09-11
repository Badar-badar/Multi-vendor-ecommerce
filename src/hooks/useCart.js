import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCartItems,
  selectCartTotalQuantity,
  selectCartSubtotal,
  selectCartOriginalSubtotal,
  selectCartProductSavings,
  selectCartCouponDiscount,
  selectCartTotalDiscount,
  selectCartCoupon,
  selectCartCouponError,
  selectCartShippingFee,
  selectCartFreeShippingThreshold,
  selectCartTax,
  selectCartTotal,
  selectCartLoading,
  selectCartError,
  selectCartGroupedBySeller,
  selectCartStockIssues,
} from '../features/cart/cartSelectors';
import {
  addToCart,
  updateQuantity,
  removeFromCart,
  applyCoupon,
  removeCoupon,
  clearCouponError,
  clearCart,
} from '../features/cart/cartSlice';
import { addToWishlist } from '../features/wishlist/wishlistSlice';
import toast from 'react-hot-toast';

export const useCart = () => {
  const dispatch = useDispatch();

  const items = useSelector(selectCartItems);
  const totalQuantity = useSelector(selectCartTotalQuantity);
  const subtotal = useSelector(selectCartSubtotal);
  const originalSubtotal = useSelector(selectCartOriginalSubtotal);
  const productSavings = useSelector(selectCartProductSavings);
  const couponDiscount = useSelector(selectCartCouponDiscount);
  const totalDiscount = useSelector(selectCartTotalDiscount);
  const coupon = useSelector(selectCartCoupon);
  const couponError = useSelector(selectCartCouponError);
  const shippingFee = useSelector(selectCartShippingFee);
  const freeShippingThreshold = useSelector(selectCartFreeShippingThreshold);
  const tax = useSelector(selectCartTax);
  const total = useSelector(selectCartTotal);
  const loading = useSelector(selectCartLoading);
  const error = useSelector(selectCartError);
  const groupedBySeller = useSelector(selectCartGroupedBySeller);
  const stockIssues = useSelector(selectCartStockIssues);

  const freeShippingRemaining = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const addItem = useCallback(
    (product, quantity = 1, selectedVariant = null) => {
      dispatch(addToCart({ product, quantity, selectedVariant }));
      toast.success(`${product.name} added to your shopping bag.`);
    },
    [dispatch]
  );

  const setItemQuantity = useCallback(
    (itemId, quantity) => {
      dispatch(updateQuantity({ itemId, quantity }));
    },
    [dispatch]
  );

  const removeItem = useCallback(
    (itemId) => {
      dispatch(removeFromCart(itemId));
      toast.success('Item removed from shopping bag.');
    },
    [dispatch]
  );

  const saveToWishlist = useCallback(
    (item) => {
      if (item?.product) {
        dispatch(addToWishlist(item.product));
        dispatch(removeFromCart(item.id));
        toast.success(`Moved ${item.product.name} to your wishlist.`);
      }
    },
    [dispatch]
  );

  const applyPromoCode = useCallback(
    (code) => {
      dispatch(applyCoupon(code));
    },
    [dispatch]
  );

  const removePromoCode = useCallback(() => {
    dispatch(removeCoupon());
    toast.success('Coupon removed.');
  }, [dispatch]);

  const clearPromoError = useCallback(() => {
    dispatch(clearCouponError());
  }, [dispatch]);

  const emptyCart = useCallback(() => {
    dispatch(clearCart());
    toast.success('Shopping bag cleared.');
  }, [dispatch]);

  return {
    items,
    groupedBySeller,
    totalQuantity,
    subtotal,
    originalSubtotal,
    productSavings,
    couponDiscount,
    totalDiscount,
    coupon,
    couponError,
    shippingFee,
    freeShippingThreshold,
    freeShippingRemaining,
    freeShippingProgress,
    tax,
    total,
    loading,
    error,
    hasStockIssues: stockIssues.hasIssues,
    stockIssues: stockIssues.issues,
    addItem,
    setItemQuantity,
    removeItem,
    saveToWishlist,
    applyPromoCode,
    removePromoCode,
    clearPromoError,
    emptyCart,
  };
};

export default useCart;
