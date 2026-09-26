/**
 * Custom Application Error Class for Zareen E-Commerce Backend.
 * Represents operational, known errors that should be sent to the client cleanly.
 */
export class AppError extends Error {
  /**
   * @param {string} message - Error description
   * @param {number} [statusCode=500] - HTTP status code
   * @param {any} [errors=null] - Optional detailed validation or field errors
   * @param {boolean} [isOperational=true] - Indicates trusted operational error
   */
  constructor(message, statusCode = 500, errors = null, isOperational = true) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = isOperational;
    this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }

  // Convenient static factory methods for common HTTP error cases
  static badRequest(message = 'Bad Request', errors = null) {
    return new AppError(message, 400, errors);
  }

  static unauthorized(message = 'Unauthorized access. Please authenticate.') {
    return new AppError(message, 401);
  }

  static forbidden(message = 'Forbidden. You do not have permission to access this resource.') {
    return new AppError(message, 403);
  }

  static notFound(message = 'Resource not found') {
    return new AppError(message, 404);
  }

  static conflict(message = 'Resource conflict') {
    return new AppError(message, 409);
  }

  static unprocessableEntity(message = 'Validation failed', errors = null) {
    return new AppError(message, 422, errors);
  }

  static internal(message = 'Internal Server Error') {
    return new AppError(message, 500, null, false);
  }
}

export default AppError;
