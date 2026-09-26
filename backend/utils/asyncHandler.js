/**
 * Wraps async route handlers and controllers to automatically catch and forward
 * rejected promises to the global Express error middleware.
 *
 * @param {Function} fn - Async Express route handler/controller function
 * @returns {import('express').RequestHandler} Express request handler
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
