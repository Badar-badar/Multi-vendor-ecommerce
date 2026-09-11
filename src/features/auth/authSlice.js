import { createSlice } from '@reduxjs/toolkit';
import {
  loginUser,
  registerUser,
  fetchCurrentUser,
  logoutUser,
  googleAuthUser,
  verifyEmailUser,
  forgotPasswordUser,
  resetPasswordUser,
} from './authThunk';

const initialState = {
  user: null,
  role: null,
  isAuthenticated: false,
  loading: false,
  initialized: false, // Tracks whether initial startup session verification is complete
  sessionExpired: false,
  error: null,
  verificationPending: false,
  emailToVerify: null,
  passwordResetDispatched: false,
  passwordResetSuccess: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
    setInitialized: (state, action) => {
      state.initialized = action.payload !== undefined ? action.payload : true;
    },
    setSessionExpired: (state, action) => {
      state.sessionExpired = action.payload !== undefined ? action.payload : true;
      state.isAuthenticated = false;
      state.user = null;
      state.role = null;
    },
    setEmailToVerify: (state, action) => {
      state.emailToVerify = action.payload;
      state.verificationPending = true;
    },
    clearVerificationState: (state) => {
      state.verificationPending = false;
      state.emailToVerify = null;
    },
    resetPasswordFlags: (state) => {
      state.passwordResetDispatched = false;
      state.passwordResetSuccess = false;
      state.error = null;
    },
    setMockUser: (state, action) => {
      // For instant frontend role testing (customer, seller, admin, guest)
      if (action.payload) {
        state.user = action.payload;
        state.role = action.payload.role || 'customer';
        state.isAuthenticated = true;
        state.sessionExpired = false;
      } else {
        state.user = null;
        state.role = null;
        state.isAuthenticated = false;
      }
      state.initialized = true;
      state.error = null;
    },
    updateUserProfile: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    resetAuth: (state) => {
      state.user = null;
      state.role = null;
      state.isAuthenticated = false;
      state.error = null;
      state.sessionExpired = false;
      state.verificationPending = false;
      state.emailToVerify = null;
      state.initialized = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Current User Check (Session restore via HTTP-only cookie on app startup)
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.sessionExpired = false;
        if (action.payload) {
          state.user = action.payload;
          state.role = action.payload?.role || 'customer';
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.role = null;
          state.isAuthenticated = false;
        }
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.loading = false;
        state.initialized = true;
        state.user = null;
        state.role = null;
        state.isAuthenticated = false;
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.role = action.payload.user?.role || 'customer';
        state.isAuthenticated = true;
        state.sessionExpired = false;
        state.initialized = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.role = action.payload.user?.role || 'customer';
        state.isAuthenticated = true;
        state.sessionExpired = false;
        state.initialized = true;
        state.verificationPending = true;
        state.emailToVerify = action.payload.user?.email || null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Google OAuth
      .addCase(googleAuthUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleAuthUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.role = action.payload.user?.role || 'customer';
        state.isAuthenticated = true;
        state.sessionExpired = false;
        state.initialized = true;
      })
      .addCase(googleAuthUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Verify Email
      .addCase(verifyEmailUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyEmailUser.fulfilled, (state) => {
        state.loading = false;
        if (state.user) {
          state.user.isEmailVerified = true;
        }
        state.verificationPending = false;
        state.emailToVerify = null;
      })
      .addCase(verifyEmailUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Forgot Password
      .addCase(forgotPasswordUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPasswordUser.fulfilled, (state) => {
        state.loading = false;
        state.passwordResetDispatched = true;
      })
      .addCase(forgotPasswordUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Reset Password
      .addCase(resetPasswordUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPasswordUser.fulfilled, (state) => {
        state.loading = false;
        state.passwordResetSuccess = true;
      })
      .addCase(resetPasswordUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.role = null;
        state.isAuthenticated = false;
        state.error = null;
        state.sessionExpired = false;
        state.verificationPending = false;
        state.emailToVerify = null;
        state.initialized = true;
      });
  },
});

export const {
  clearAuthError,
  setInitialized,
  setSessionExpired,
  setEmailToVerify,
  clearVerificationState,
  resetPasswordFlags,
  setMockUser,
  updateUserProfile,
  resetAuth,
} = authSlice.actions;

export default authSlice.reducer;

