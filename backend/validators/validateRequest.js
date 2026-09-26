import { AppError } from '../utils/appError.js';

/**
 * Validation Middleware Helper.
 * Formats validation errors into a clean, predictable field-keyed object.
 *
 * @param {Function} validatorFn - Function that validates req and returns { isValid, errors }
 */
export const validate = (validatorFn) => {
  return (req, res, next) => {
    const result = validatorFn(req);
    if (!result.isValid) {
      return next(new AppError('Validation failed. Please verify your input data.', 422, result.errors));
    }
    next();
  };
};

export default validate;
