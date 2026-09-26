/**
 * Auth Request Validators
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateRegister = (req) => {
  const { name, email, password, confirmPassword, passwordConfirm } = req.body || {};
  const errors = {};

  const effectiveConfirm = confirmPassword || passwordConfirm;

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.name = 'Full name must be at least 2 characters long.';
  }

  if (!email || !EMAIL_REGEX.test(email.trim())) {
    errors.email = 'A valid email address is required.';
  }

  if (!password || typeof password !== 'string' || password.length < 8) {
    errors.password = 'Password must be at least 8 characters long.';
  }

  if (effectiveConfirm && password !== effectiveConfirm) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateLogin = (req) => {
  const { email, password } = req.body || {};
  const errors = {};

  if (!email || !EMAIL_REGEX.test(email.trim())) {
    errors.email = 'Please provide a valid email address.';
  }

  if (!password || typeof password !== 'string') {
    errors.password = 'Password is required.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateForgotPassword = (req) => {
  const { email } = req.body || {};
  const errors = {};

  if (!email || !EMAIL_REGEX.test(email.trim())) {
    errors.email = 'Please provide a valid email address.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateResetPassword = (req) => {
  const { token, password, confirmPassword, passwordConfirm } = req.body || {};
  const errors = {};

  const effectiveToken = token || req.query?.token;
  const effectiveConfirm = confirmPassword || passwordConfirm;

  if (!effectiveToken || typeof effectiveToken !== 'string') {
    errors.token = 'A valid password reset token is required.';
  }

  if (!password || typeof password !== 'string' || password.length < 8) {
    errors.password = 'New password must be at least 8 characters long.';
  }

  if (effectiveConfirm && password !== effectiveConfirm) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateVerifyEmail = (req) => {
  const { token } = req.body || {};
  const effectiveToken = token || req.query?.token;
  const errors = {};

  if (!effectiveToken || typeof effectiveToken !== 'string') {
    errors.token = 'A valid email verification token is required.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export default {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  validateVerifyEmail,
};
