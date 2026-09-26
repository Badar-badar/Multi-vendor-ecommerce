import { AppError } from '../utils/appError.js';

/**
 * Role Authorization Middleware
 * Enforces that the authenticated user possesses at least one of the allowed roles.
 *
 * Usage: router.use(authenticate, requireRole('admin', 'seller'))
 *
 * @param {...string} roles - Permitted roles (e.g. 'customer', 'seller', 'admin')
 */
export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(AppError.unauthorized('Authentication required.'));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        AppError.forbidden(
          `Forbidden. This action requires one of the following roles: [${roles.join(', ')}].`
        )
      );
    }

    next();
  };
};

export default requireRole;
