export const selectRecentlyViewed = (state) => state.recentlyViewed?.items || [];
export const selectRecentlyViewedCount = (state) => state.recentlyViewed?.items?.length || 0;
