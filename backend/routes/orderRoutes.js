import { Router } from 'express';
import {
  placeOrder,
  getMyOrders,
  getMyOrder,
  cancelOrder,
  requestOrderReturn,
  reorderOrderItems,
} from '../controllers/orderController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validate } from '../validators/validateRequest.js';
import {
  validateCancelOrder,
  validateReturnOrder,
} from '../validators/checkoutValidator.js';

const router = Router();

import { requestRefund } from '../controllers/paymentController.js';
import { validateProcessRefund } from '../validators/paymentValidator.js';

// All customer order endpoints require authentication
router.use(authenticate);

router.post('/', placeOrder);
router.get('/', getMyOrders);
router.get('/:id', getMyOrder);
router.post('/:id/cancel', validate(validateCancelOrder), cancelOrder);
router.post('/:id/return', validate(validateReturnOrder), requestOrderReturn);
router.post('/:id/refund', validate(validateProcessRefund), requestRefund);
router.post('/:id/reorder', reorderOrderItems);

export default router;
