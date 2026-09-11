export const selectAvailableOffers = (state) => state.coupons?.availableOffers || [];
export const selectSellerCoupons = (state) => state.coupons?.sellerCoupons || [];
export const selectAdminCoupons = (state) => state.coupons?.adminCoupons || [];
export const selectValidatedCoupon = (state) => state.coupons?.validatedCoupon || null;
export const selectCouponValidationError = (state) => state.coupons?.validationError || null;
export const selectCouponLoading = (state) => state.coupons?.loading || false;
