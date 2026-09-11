import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectWishlistItems,
  selectWishlistCount,
  selectWishlistLoading,
  selectWishlistError,
} from '../features/wishlist/wishlistSelectors';
import {
  toggleWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} from '../features/wishlist/wishlistSlice';
import { addToCart } from '../features/cart/cartSlice';
import toast from 'react-hot-toast';

export const useWishlist = () => {
  const dispatch = useDispatch();

  const items = useSelector(selectWishlistItems);
  const count = useSelector(selectWishlistCount);
  const loading = useSelector(selectWishlistLoading);
  const error = useSelector(selectWishlistError);

  const toggleItem = useCallback(
    (product) => {
      const exists = items.some((i) => i.id === product.id);
      dispatch(toggleWishlist(product));
      if (exists) {
        toast.success(`Removed ${product.name} from wishlist.`);
      } else {
        toast.success(`Added ${product.name} to your wishlist.`);
      }
    },
    [dispatch, items]
  );

  const addItem = useCallback(
    (product) => {
      dispatch(addToWishlist(product));
      toast.success(`Saved to your wishlist.`);
    },
    [dispatch]
  );

  const removeItem = useCallback(
    (productId) => {
      dispatch(removeFromWishlist(productId));
      toast.success('Removed from wishlist.');
    },
    [dispatch]
  );

  const moveToCart = useCallback(
    (product) => {
      dispatch(addToCart({ product, quantity: 1 }));
      dispatch(removeFromWishlist(product.id));
      toast.success(`Moved ${product.name} to shopping bag.`);
    },
    [dispatch]
  );

  const moveAllToCart = useCallback(() => {
    if (items.length === 0) return;
    items.forEach((item) => {
      dispatch(addToCart({ product: item, quantity: 1 }));
    });
    dispatch(clearWishlist());
    toast.success(`Moved all ${items.length} creations to your shopping bag.`);
  }, [dispatch, items]);

  const emptyWishlist = useCallback(() => {
    dispatch(clearWishlist());
    toast.success('Wishlist cleared.');
  }, [dispatch]);

  const isInWishlist = useCallback(
    (productId) => items.some((item) => item.id === productId),
    [items]
  );

  return {
    items,
    count,
    loading,
    error,
    isInWishlist,
    toggleItem,
    addItem,
    removeItem,
    moveToCart,
    moveAllToCart,
    emptyWishlist,
  };
};

export default useWishlist;
