import api from './api';

export const authApi = {
  // Authentication & Session
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),

  // Email Verification
  verifyEmail: (data) => api.post('/auth/verify-email', data),
  resendVerification: (data) => api.post('/auth/resend-verification', data),

  // Password Recovery
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),

  // Customer Profile & Password
  getProfile: () => api.get('/users/me'),
  updateProfile: (profileData) => api.patch('/users/me', profileData),
  changePassword: (passwordData) => api.post('/users/me/change-password', passwordData),

  // Seller Onboarding & Application
  getSellerApplicationStatus: () => api.get('/seller/application'),
  submitSellerApplication: (applicationData) => api.post('/seller/apply', applicationData),
  updateSellerApplication: (applicationData) => api.patch('/seller/application', applicationData),
};

export default authApi;

