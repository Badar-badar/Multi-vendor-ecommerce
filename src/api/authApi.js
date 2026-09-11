import api from './api';

export const authApi = {
  // Authentication & Session
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
  refreshToken: () => api.post('/auth/refresh-token'),

  // Email Verification
  verifyEmail: (data) => api.post('/auth/verify-email', data),
  resendVerification: (data) => api.post('/auth/resend-verification', data),

  // Password Recovery
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  updatePassword: (passwordData) => api.put('/auth/password', passwordData),

  // Google OAuth
  googleAuth: (credentialData) => api.post('/auth/google', credentialData),

  // Customer Profile & Onboarding
  updateProfile: (profileData) => api.put('/auth/profile', profileData),

  // Seller Onboarding & Application
  getSellerApplicationStatus: () => api.get('/seller/application/status'),
  submitSellerApplication: (applicationData) => api.post('/seller/application', applicationData),
};

export default authApi;

