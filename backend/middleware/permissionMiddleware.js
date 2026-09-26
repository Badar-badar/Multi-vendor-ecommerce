import { AppError } from '../utils/appError.js';
import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
} from '../config/permissions.js';

/**
 * Middleware: Requires a specific permission to proceed.
 */
export const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(AppError.unauthorized('Authentication required.'));
    }

    if (!hasPermission(req.user, permission)) {
      return next(
        AppError.forbidden(
          `Access denied. You lack the required permission: '${permission}'.`
        )
      );
    }

    next();
  };
};

/**
 * Middleware: Requires ANY of the listed permissions.
 */
export const requireAnyPermission = (...permissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(AppError.unauthorized('Authentication required.'));
    }

    if (!hasAnyPermission(req.user, permissions)) {
      return next(
        AppError.forbidden(
          `Access denied. You require at least one of: [${permissions.join(', ')}].`
        )
      );
    }

    next();
  };
};

/**
 * Middleware: Requires ALL of the listed permissions.
 */
export const requireAllPermissions = (...permissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(AppError.unauthorized('Authentication required.'));
    }

    if (!hasAllPermissions(req.user, permissions)) {
      return next(
        AppError.forbidden(
          `Access denied. You require all of the following permissions: [${permissions.join(', ')}].`
        )
      );
    }

    next();
  };
};

export default {
  requirePermission,
  requireAnyPermission,
  requireAllPermissions,
};
