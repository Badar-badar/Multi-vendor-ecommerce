/**
 * Standardized API Response Utilities for Zareen E-Commerce API.
 * Guarantees a consistent JSON structure across all endpoints for frontend consumption.
 */

/**
 * Sends a standardized success response.
 * @param {import('express').Response} res - Express response object
 * @param {Object} options - Response options
 * @param {number} [options.statusCode=200] - HTTP status code
 * @param {string} [options.message='Success'] - Human-readable success message
 * @param {any} [options.data=null] - Response payload
 * @param {Object} [options.meta=undefined] - Optional pagination / metadata
 */
export const sendSuccess = (
  res,
  { statusCode = 200, message = 'Request completed successfully', data = null, meta = undefined } = {}
) => {
  const payload = {
    success: true,
    message,
    ...(data !== null && data !== undefined && { data }),
    ...(meta && { meta }),
  };
  return res.status(statusCode).json(payload);
};

/**
 * Sends a standardized error response.
 * @param {import('express').Response} res - Express response object
 * @param {Object} options - Error options
 * @param {number} [options.statusCode=500] - HTTP status code
 * @param {string} [options.message='An error occurred'] - Human-readable error message
 * @param {any} [options.errors=null] - Optional detailed validation or error array
 */
export const sendError = (
  res,
  { statusCode = 500, message = 'Internal Server Error', errors = null } = {}
) => {
  const payload = {
    success: false,
    message,
    ...(errors && { errors }),
  };
  return res.status(statusCode).json(payload);
};

export default {
  sendSuccess,
  sendError,
};
