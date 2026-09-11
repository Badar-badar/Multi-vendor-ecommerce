export const selectCurrentStep = (state) => state.checkout.currentStep;
export const selectSelectedShippingAddress = (state) => state.checkout.selectedShippingAddress;
export const selectSelectedBillingAddress = (state) => state.checkout.selectedBillingAddress;
export const selectUseSameAddressForBilling = (state) => state.checkout.useSameAddressForBilling;
export const selectShippingMethod = (state) => state.checkout.shippingMethod;
export const selectShippingCost = (state) => state.checkout.shippingCost;
export const selectSellerDeliveryNotes = (state) => state.checkout.sellerDeliveryNotes;
export const selectOrderNotes = (state) => state.checkout.orderNotes;
export const selectIdempotencyKey = (state) => state.checkout.idempotencyKey;

export const selectValidatedTotals = (state) => state.checkout.validatedTotals;
export const selectStockIssues = (state) => state.checkout.stockIssues;
export const selectIsCheckingStock = (state) => state.checkout.isCheckingStock;
export const selectIsCalculatingTotals = (state) => state.checkout.isCalculatingTotals;

export const selectPlacedOrder = (state) => state.checkout.placedOrder;
export const selectIsSubmittingOrder = (state) => state.checkout.isSubmittingOrder;
export const selectCheckoutError = (state) => state.checkout.checkoutError;
