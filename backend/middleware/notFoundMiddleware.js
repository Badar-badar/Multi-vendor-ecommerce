import { AppError } from '../utils/appError.js';

/**
 * 404 Handler for undefined API routes.
 * Returns standard JSON error instead of default Express HTML page.
 */
export const notFoundMiddleware = (req, res, next) => {
  next(AppError.notFound(`Cannot find endpoint: ${req.method} ${req.originalUrl}`));
};

export default notFoundMiddleware;
