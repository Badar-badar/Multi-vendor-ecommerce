export const selectClientSecret = (state) => state.payment.clientSecret;
export const selectPaymentIntentId = (state) => state.payment.paymentIntentId;
export const selectPaymentStatus = (state) => state.payment.paymentStatus;
export const selectPaymentError = (state) => state.payment.paymentError;
export const selectIsProcessingPayment = (state) => state.payment.isProcessingPayment;
export const selectSelectedPaymentMethod = (state) => state.payment.selectedPaymentMethod;

export const selectCustomerPayments = (state) => state.payment.customerPayments;
export const selectCustomerPaymentsLoading = (state) => state.payment.customerPaymentsLoading;
export const selectCustomerPaymentsPagination = (state) => state.payment.customerPaymentsPagination;

export const selectAdminPayments = (state) => state.payment.adminPayments;
export const selectAdminPaymentsLoading = (state) => state.payment.adminPaymentsLoading;
export const selectAdminPaymentsPagination = (state) => state.payment.adminPaymentsPagination;
export const selectAdminPaymentStats = (state) => state.payment.adminPaymentStats;
