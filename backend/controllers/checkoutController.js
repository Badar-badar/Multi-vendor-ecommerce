import { validateCheckout } from '../services/checkoutService.js';
import { sendSuccess } from '../utils/apiResponse.js';

/**
 * Checkout Controller
 */

export const validateAndCalculateCheckout = async (req, res, next) => {
  try {
    const summary = await validateCheckout(req.user._id, req.body);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Checkout calculation completed successfully.',
      data: summary,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  validateAndCalculateCheckout,
};
