/**
 * Review Request Validators
 */

export const validateCreateReview = (req) => {
  const { rating, comment } = req.body || {};
  const errors = {};

  const ratingNum = parseInt(rating, 10);
  if (rating === undefined || isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
    errors.rating = 'Rating must be an integer between 1 and 5.';
  }

  if (!comment || typeof comment !== 'string' || comment.trim().length < 5) {
    errors.comment = 'Review comment must be at least 5 characters long.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export default {
  validateCreateReview,
};
