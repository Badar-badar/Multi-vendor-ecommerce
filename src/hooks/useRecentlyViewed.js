import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectRecentlyViewed,
  selectRecentlyViewedCount,
} from '../features/recentlyViewed/recentlyViewedSelectors';
import {
  addRecentlyViewed,
  clearRecentlyViewed,
} from '../features/recentlyViewed/recentlyViewedSlice';
import toast from 'react-hot-toast';

export const useRecentlyViewed = () => {
  const dispatch = useDispatch();
  const items = useSelector(selectRecentlyViewed);
  const count = useSelector(selectRecentlyViewedCount);

  const trackProduct = useCallback(
    (product) => {
      if (product && product.id) {
        dispatch(addRecentlyViewed(product));
      }
    },
    [dispatch]
  );

  const clearHistory = useCallback(() => {
    dispatch(clearRecentlyViewed());
    toast.success('Browsing history cleared.');
  }, [dispatch]);

  return {
    items,
    count,
    trackProduct,
    clearHistory,
  };
};

export default useRecentlyViewed;
