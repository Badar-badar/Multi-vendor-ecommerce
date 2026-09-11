import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectAuthError,
  selectAuthLoading,
  selectAuthInitialized,
  selectSessionExpired,
  selectCurrentUser,
  selectIsAdmin,
  selectIsAuthenticated,
  selectIsSeller,
  selectUserRole,
  selectVerificationPending,
  selectEmailToVerify,
  selectPasswordResetDispatched,
  selectPasswordResetSuccess,
} from '../features/auth/authSelectors';
import {
  clearAuthError,
  resetAuth,
  setMockUser,
  setInitialized,
  setSessionExpired,
  setEmailToVerify,
  clearVerificationState,
  resetPasswordFlags,
  updateUserProfile,
} from '../features/auth/authSlice';
import {
  fetchCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  verifyEmailUser,
  forgotPasswordUser,
  resetPasswordUser,
  googleAuthUser,
} from '../features/auth/authThunk';
import { clearCart } from '../features/cart/cartSlice';
import { clearWishlist } from '../features/wishlist/wishlistSlice';
import { clearAllNotifications } from '../features/notifications/notificationSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);
  const initialized = useSelector(selectAuthInitialized);
  const sessionExpired = useSelector(selectSessionExpired);
  const error = useSelector(selectAuthError);
  const role = useSelector(selectUserRole);
  const isSeller = useSelector(selectIsSeller);
  const isAdmin = useSelector(selectIsAdmin);
  const verificationPending = useSelector(selectVerificationPending);
  const emailToVerify = useSelector(selectEmailToVerify);
  const passwordResetDispatched = useSelector(selectPasswordResetDispatched);
  const passwordResetSuccess = useSelector(selectPasswordResetSuccess);

  const login = useCallback(
    (credentials) => dispatch(loginUser(credentials)).unwrap(),
    [dispatch]
  );

  const register = useCallback(
    (userData) => dispatch(registerUser(userData)).unwrap(),
    [dispatch]
  );

  const googleAuth = useCallback(
    (credentialData) => dispatch(googleAuthUser(credentialData)).unwrap(),
    [dispatch]
  );

  const verifyEmail = useCallback(
    (data) => dispatch(verifyEmailUser(data)).unwrap(),
    [dispatch]
  );

  const forgotPassword = useCallback(
    (data) => dispatch(forgotPasswordUser(data)).unwrap(),
    [dispatch]
  );

  const resetPassword = useCallback(
    (data) => dispatch(resetPasswordUser(data)).unwrap(),
    [dispatch]
  );

  const logout = useCallback(async () => {
    try {
      await dispatch(logoutUser()).unwrap();
    } catch {
      // Even if network fails, reset client auth state
      dispatch(resetAuth());
    } finally {
      // Clear user-specific store data to avoid data leaking between sessions
      dispatch(clearCart());
      dispatch(clearWishlist());
      dispatch(clearAllNotifications());
    }
  }, [dispatch]);

  const loadUser = useCallback(() => dispatch(fetchCurrentUser()), [dispatch]);

  const updateProfile = useCallback(
    (profileData) => dispatch(updateUserProfile(profileData)),
    [dispatch]
  );

  const clearError = useCallback(() => dispatch(clearAuthError()), [dispatch]);

  const clearVerification = useCallback(
    () => dispatch(clearVerificationState()),
    [dispatch]
  );

  const resetResetFlags = useCallback(
    () => dispatch(resetPasswordFlags()),
    [dispatch]
  );

  const markInitialized = useCallback(
    (val = true) => dispatch(setInitialized(val)),
    [dispatch]
  );

  const markSessionExpired = useCallback(
    (val = true) => dispatch(setSessionExpired(val)),
    [dispatch]
  );

  const switchRoleForDev = useCallback(
    (newRole) => {
      const mockProfiles = {
        customer: {
          id: 'cust-1',
          name: 'Sarah Jenkins',
          email: 'sarah.jenkins@example.com',
          role: 'customer',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
          isEmailVerified: true,
          phone: '+1 (555) 234-5678',
          city: 'New York',
          country: 'United States',
        },
        seller: {
          id: 'sel-1',
          name: 'Jean-Luc Moreau',
          email: 'jeanluc@ateliermaison.fr',
          role: 'seller',
          storeName: 'Atelier Maison',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
          isEmailVerified: true,
          phone: '+33 1 42 68 55 00',
          city: 'Paris',
          country: 'France',
        },
        admin: {
          id: 'adm-1',
          name: 'Victoria Vance',
          email: 'admin@zareen.luxury',
          role: 'admin',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
          isEmailVerified: true,
        },
      };

      if (newRole === 'guest') {
        dispatch(resetAuth());
      } else if (mockProfiles[newRole]) {
        dispatch(setMockUser(mockProfiles[newRole]));
      }
    },
    [dispatch]
  );

  return {
    user,
    isAuthenticated,
    loading,
    initialized,
    sessionExpired,
    error,
    role,
    isSeller,
    isAdmin,
    verificationPending,
    emailToVerify,
    passwordResetDispatched,
    passwordResetSuccess,
    login,
    register,
    googleAuth,
    verifyEmail,
    forgotPassword,
    resetPassword,
    logout,
    loadUser,
    updateProfile,
    clearError,
    clearVerification,
    resetResetFlags,
    markInitialized,
    markSessionExpired,
    switchRoleForDev,
  };
};

export default useAuth;

