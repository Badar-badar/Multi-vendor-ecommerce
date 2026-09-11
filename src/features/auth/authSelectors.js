export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthInitialized = (state) => state.auth.initialized;
export const selectSessionExpired = (state) => state.auth.sessionExpired;
export const selectAuthError = (state) => state.auth.error;
export const selectUserRole = (state) => state.auth.role || state.auth.user?.role || null;
export const selectIsSeller = (state) =>
  state.auth.role === 'seller' || state.auth.user?.role === 'seller';
export const selectIsAdmin = (state) =>
  state.auth.role === 'admin' || state.auth.user?.role === 'admin';
export const selectVerificationPending = (state) => state.auth.verificationPending;
export const selectEmailToVerify = (state) => state.auth.emailToVerify;
export const selectPasswordResetDispatched = (state) => state.auth.passwordResetDispatched;
export const selectPasswordResetSuccess = (state) => state.auth.passwordResetSuccess;

