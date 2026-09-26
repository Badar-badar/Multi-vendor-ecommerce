import { Router } from 'express';
import {
  createIntent,
  getPayment,
  getMyPaymentList,
  handleWebhook,
} from '../controllers/paymentController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validate } from '../validators/validateRequest.js';
import { validateCreatePaymentIntent } from '../validators/paymentValidator.js';

const router = Router();

/**
 * 1. Stripe Webhook (Public with raw-body signature verification)
 * POST /api/v1/payments/webhook
 */
router.post('/webhook', handleWebhook);

/**
 * 2. Authenticated Customer Payment Routes
 */
router.use(authenticate);

router.post('/create-intent', validate(validateCreatePaymentIntent), createIntent);
router.get('/', getMyPaymentList);
router.get('/:id', getPayment);

export default router;
