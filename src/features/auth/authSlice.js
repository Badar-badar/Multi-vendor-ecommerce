import { createSlice } from '@reduxjs/toolkit';
import {
  loginUser,
  registerUser,
  fetchCurrentUser,
  logoutUser,
  verifyEmailUser,
  forgotPasswordUser,
  resetPasswordUser,
  updateProfileUser,
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
    updateUserProfile: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    setMockUser: (state, action) => {
      state.user = action.payload;
      state.role = action.payload?.role || 'customer';
      state.isAuthenticated = !!action.payload;
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
        const user = action.payload?.data?.user || action.payload?.user || action.payload;
        if (user && user._id) {
          state.user = user;
          state.role = user.role || 'customer';
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
        const user = action.payload?.data?.user || action.payload?.user || action.payload;
        state.user = user;
        state.role = user?.role || 'customer';
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
        const user = action.payload?.data?.user || action.payload?.user || action.payload;
        state.user = user;
        state.role = user?.role || 'customer';
        state.isAuthenticated = true;
        state.sessionExpired = false;
        state.initialized = true;
        state.verificationPending = !user?.isEmailVerified;
        state.emailToVerify = user?.email || null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Profile
      .addCase(updateProfileUser.fulfilled, (state, action) => {
        const user = action.payload?.data?.user || action.payload?.user || action.payload;
        if (user) {
          state.user = { ...state.user, ...user };
        }
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
  updateUserProfile,
  setMockUser,
  resetAuth,
} = authSlice.actions;

export default authSlice.reducer;

