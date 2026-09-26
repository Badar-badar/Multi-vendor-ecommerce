import {
  createProductReview,
  getProductReviews,
  updateCustomerReview,
  deleteCustomerReview,
  moderateReview,
  getAdminReviews,
} from '../services/reviewService.js';
import { sendSuccess } from '../utils/apiResponse.js';

/**
 * Review Controller
 */

export const submitReview = async (req, res, next) => {
  try {
    const review = await createProductReview(req.user._id, req.params.productId, req.body);
    return sendSuccess(res, {
      statusCode: 201,
      message: 'Verified purchase review submitted successfully.',
      data: { review },
    });
  } catch (error) {
    next(error);
  }
};

export const getReviews = async (req, res, next) => {
  try {
    const result = await getProductReviews(req.params.productId, req.query);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Product reviews retrieved successfully.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const updateReview = async (req, res, next) => {
  try {
    const review = await updateCustomerReview(req.user._id, req.params.id, req.body);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Review updated successfully.',
      data: { review },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const result = await deleteCustomerReview(req.user._id, req.params.id);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Review removed.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminReviewList = async (req, res, next) => {
  try {
    const result = await getAdminReviews(req.query);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Admin reviews retrieved.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const moderateReviewStatus = async (req, res, next) => {
  try {
    const review = await moderateReview(req.user._id, req.params.id, req.body.status);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Review moderation updated.',
      data: { review },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  submitReview,
  getReviews,
  updateReview,
  deleteReview,
  getAdminReviewList,
  moderateReviewStatus,
};
