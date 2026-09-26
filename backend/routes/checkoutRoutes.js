import { Router } from 'express';
import { validateAndCalculateCheckout } from '../controllers/checkoutController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validate } from '../validators/validateRequest.js';
import { validateCheckoutPayload } from '../validators/checkoutValidator.js';

const router = Router();

// Checkout calculation requires authentication
router.use(authenticate);

router.post('/validate', validate(validateCheckoutPayload), validateAndCalculateCheckout);

export default router;
