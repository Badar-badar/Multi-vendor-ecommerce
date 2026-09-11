export const selectAddresses = (state) => state.addresses?.addresses || [];
export const selectDefaultShippingAddress = (state) =>
  state.addresses?.addresses?.find((a) => a.isDefaultShipping) ||
  state.addresses?.addresses?.[0] ||
  null;
export const selectDefaultBillingAddress = (state) =>
  state.addresses?.addresses?.find((a) => a.isDefaultBilling) ||
  state.addresses?.addresses?.[0] ||
  null;
export const selectAddressesLoading = (state) => state.addresses?.loading || false;
export const selectAddressesError = (state) => state.addresses?.error || null;
