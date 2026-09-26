import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { AppError } from '../utils/appError.js';

/**
 * Normalizes specific known database and operational errors into structured AppErrors
 */
const handleCastErrorDB = (err) => {
  const message = `Invalid resource identifier format for '${err.path}': '${err.value}'`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const field = Object.keys(err.keyValue || {})[0] || 'field';
  const value = err.keyValue ? err.keyValue[field] : '';
  const message = `Duplicate value '${value}' for field '${field}'. Please use another value.`;
  return new AppError(message, 409, { [field]: `${field} already exists` });
};

const handleValidationErrorDB = (err) => {
  const errors = {};
  for (const [field, errorObj] of Object.entries(err.errors || {})) {
    errors[field] = errorObj.message;
  }
  return new AppError('Validation failed. Please verify your input data.', 422, errors);
};

const handleJsonSyntaxError = (err) => {
  return new AppError('Malformed JSON payload in request body.', 400);
};

/**
 * Global Error Handling Middleware for Express
 */
export const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  let error = { ...err, message: err.message, name: err.name, stack: err.stack };

  // Convert specific known exceptions into AppError
  if (err.name === 'CastError') error = handleCastErrorDB(err);
  if (err.code === 11000) error = handleDuplicateFieldsDB(err);
  if (err.name === 'ValidationError') error = handleValidationErrorDB(err);
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    error = handleJsonSyntaxError(err);
  }

  // Always log error server-side
  logger.error(`[HTTP Error] ${req.method} ${req.originalUrl} - ${error.statusCode} ${error.message}`, {
    statusCode: error.statusCode,
    path: req.originalUrl,
    method: req.method,
    ...(config.isDevelopment && { stack: error.stack }),
  });

  // DEVELOPMENT response: Full diagnostic details
  if (config.isDevelopment) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      errors: error.errors || null,
      stack: error.stack,
    });
  }

  // PRODUCTION response: Safe error messages
  if (error.isOperational) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      ...(error.errors && { errors: error.errors }),
    });
  }

  // Unhandled programming/internal errors in production: Never leak internals
  return res.status(500).json({
    success: false,
    message: 'An unexpected internal server error occurred. Please try again later.',
  });
};

export default errorMiddleware;
