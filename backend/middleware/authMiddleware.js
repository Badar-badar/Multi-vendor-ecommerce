import { AppError } from '../utils/appError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { verifyToken, COOKIE_NAME } from '../utils/token.js';
import { User } from '../models/User.js';
import { USER_STATUS } from '../config/permissions.js';

/**
 * Authentication Middleware
 * Enforces valid HTTP-only cookie JWT session and attaches verified user to req.user.
 */
export const authenticate = asyncHandler(async (req, res, next) => {
  let token = null;

  // 1. Primary: Extract from secure HTTP-only cookie
  if (req.cookies && req.cookies[COOKIE_NAME]) {
    token = req.cookies[COOKIE_NAME];
  }
  // 2. Secondary: Optional Bearer token header for programmatic clients
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      AppError.unauthorized('Authentication required. Please sign in to access this resource.')
    );
  }

  // 3. Verify token signature and expiration
  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(
        AppError.unauthorized('Your session has expired. Please sign in again.')
      );
    }
    return next(
      AppError.unauthorized('Invalid authentication credentials. Please sign in again.')
    );
  }

  // 4. Check if user still exists in database
  const currentUser = await User.findById(decoded.id).select('+passwordChangedAt');
  if (!currentUser) {
    return next(
      AppError.unauthorized('The patron belonging to this session no longer exists.')
    );
  }

  // 5. Check account status (e.g. suspended / inactive)
  if (currentUser.status === USER_STATUS.SUSPENDED) {
    return next(
      AppError.forbidden('Your account has been suspended. Please contact concierge support.')
    );
  }
  if (currentUser.status === USER_STATUS.INACTIVE) {
    return next(
      AppError.forbidden('Your account is inactive. Please verify your email or contact support.')
    );
  }

  // 6. Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      AppError.unauthorized('Your password was recently changed. Please sign in again with your new credentials.')
    );
  }

  // 7. Grant access and attach user object
  req.user = currentUser;
  next();
});

export default authenticate;
