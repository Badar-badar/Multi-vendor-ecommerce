export const selectMyReturns = (state) => state.returns?.returns || [];
export const selectSellerReturns = (state) => state.returns?.sellerReturns || [];
export const selectActiveReturn = (state) => state.returns?.activeReturn || null;
export const selectReturnsLoading = (state) => state.returns?.loading || false;
export const selectReturnsError = (state) => state.returns?.error || null;
