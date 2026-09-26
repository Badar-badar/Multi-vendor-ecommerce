import { Router } from 'express';
import {
  submitReview,
  getReviews,
  updateReview,
  deleteReview,
} from '../controllers/reviewController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validate } from '../validators/validateRequest.js';
import { validateCreateReview } from '../validators/reviewValidator.js';

const router = Router();

// Public: Get reviews for a product
router.get('/product/:productId', getReviews);

// Customer: Submit verified purchase review for product
router.post('/product/:productId', authenticate, validate(validateCreateReview), submitReview);

// Customer: Update or Delete own review
router.patch('/:id', authenticate, updateReview);
router.delete('/:id', authenticate, deleteReview);

export default router;
