import { Router } from 'express';
import {
  getCart,
  addItemToCart,
  updateItemQuantity,
  removeItem,
  emptyCart,
} from '../controllers/cartController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validate } from '../validators/validateRequest.js';
import {
  validateAddToCart,
  validateUpdateCartQuantity,
} from '../validators/cartValidator.js';

const router = Router();

// All cart routes require authenticated customer
router.use(authenticate);

router.get('/', getCart);
router.post('/items', validate(validateAddToCart), addItemToCart);
router.patch('/items/:id', validate(validateUpdateCartQuantity), updateItemQuantity);
router.delete('/items/:id', removeItem);
router.delete('/', emptyCart);

export default router;
