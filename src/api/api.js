
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

/**
 * Standard Main API Client
 * Configured with baseURL, HTTP-only cookie support, and interceptors.
 */
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
  timeout: 15000,
});

/**
 * Normalizes backend error responses into a consistent UI-friendly shape
 */
export const formatApiError = (error) => {
  if (!error) {
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
      status: 500,
      errors: null,
      isNetworkError: false,
    };
  }

  if (error.__isNormalized) {
    return error;
  }

  const status = error.response?.status || error.status || 500;
  const data = error.response?.data || error.data;
  const isNetwork = !error.response && Boolean(error.message && !error.status);

  let message = 'Something went wrong. Please check your connection and try again.';
  let fieldErrors = null;

  if (isNetwork) {
    message = 'Unable to connect to the server. Please verify your internet connection.';
  } else if (data?.message) {
    message = data.message;
  } else if (status === 400) {
    message = 'Invalid request. Please check your input.';
  } else if (status === 401) {
    message = 'Your session has expired or you are not signed in. Please sign in again.';
  } else if (status === 403) {
    message = 'You do not have permission to perform this action.';
  } else if (status === 404) {
    message = 'The requested resource was not found.';
  } else if (status === 409) {
    message = 'A conflict occurred with the current state of the resource.';
  } else if (status === 422) {
    message = data?.message || 'Please correct the highlighted errors in the form.';
  } else if (status === 429) {
    message = 'Too many requests. Please slow down and try again shortly.';
  } else if (status >= 500) {
    message = 'The server encountered an error. Please try again later.';
  }

  if (data?.errors && typeof data.errors === 'object') {
    fieldErrors = {};
    Object.entries(data.errors).forEach(([field, val]) => {
      if (Array.isArray(val)) {
        fieldErrors[field] = val[0];
      } else if (typeof val === 'string') {
        fieldErrors[field] = val;
      } else if (val?.message) {
        fieldErrors[field] = val.message;
      }
    });
  }

  return {
    __isNormalized: true,
    success: false,
    message,
    status,
    errors: fieldErrors,
    isNetworkError: isNetwork,
    raw: data,
  };
};

// Response Interceptor: Automatically unpack data and normalize errors
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const normalized = formatApiError(error);
    return Promise.reject(normalized);
  }
);

export default api;
