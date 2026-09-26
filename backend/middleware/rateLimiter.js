import rateLimit from 'express-rate-limit';
import { config } from '../config/env.js';

/**
 * General rate limiter for all API endpoints.
 * Prevents excessive traffic and basic DoS.
 */
export const generalRateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: config.rateLimit.standardHeaders,
  legacyHeaders: config.rateLimit.legacyHeaders,
  message: {
    success: false,
    message: 'Too many requests from this IP address. Please try again later.',
  },
  handler: (req, res, next, options) => {
    res.status(429).json(options.message);
  },
});

/**
 * Stricter rate limiter placeholder prepared for future authentication endpoints (Phase 2).
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Max 20 attempts per 15 minutes per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again in 15 minutes.',
  },
  handler: (req, res, next, options) => {
    res.status(429).json(options.message);
  },
});

export default {
  generalRateLimiter,
  authRateLimiter,
};
