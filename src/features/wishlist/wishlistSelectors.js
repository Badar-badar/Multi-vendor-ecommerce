export const selectWishlistItems = (state) => state.wishlist?.items || [];
export const selectWishlistCount = (state) => state.wishlist?.items?.length || 0;
export const selectIsInWishlist = (productId) => (state) =>
  state.wishlist?.items?.some((item) => item.id === productId);
export const selectWishlistLoading = (state) => state.wishlist?.loading || false;
export const selectWishlistError = (state) => state.wishlist?.error || null;
