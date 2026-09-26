import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

export const COOKIE_NAME = 'token';

/**
 * Generates a signed JWT for an authenticated user.
 */
export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id.toString(),
      role: user.role,
    },
    config.jwt.secret,
    {
      expiresIn: config.jwt.expiresIn,
    }
  );
};

/**
 * Sets the secure HTTP-only authentication cookie on the response.
 */
export const setAuthCookie = (res, token) => {
  const isProd = config.isProduction;

  const cookieOptions = {
    httpOnly: true, // Inaccessible to client-side JS / XSS prevention
    secure: isProd, // Transmit only over HTTPS in production
    sameSite: isProd ? 'strict' : 'lax', // CSRF protection
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    path: '/',
  };

  res.cookie(COOKIE_NAME, token, cookieOptions);
};

/**
 * Clears the authentication cookie on logout.
 */
export const clearAuthCookie = (res) => {
  const isProd = config.isProduction;

  res.cookie(COOKIE_NAME, '', {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'strict' : 'lax',
    expires: new Date(0), // Expire immediately in past
    path: '/',
  });
};

/**
 * Verifies a JWT token.
 */
export const verifyToken = (token) => {
  return jwt.verify(token, config.jwt.secret);
};

export default {
  generateToken,
  setAuthCookie,
  clearAuthCookie,
  verifyToken,
  COOKIE_NAME,
};
