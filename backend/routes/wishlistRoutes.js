import { Router } from 'express';
import {
  getWishlist,
  addItemToWishlist,
  removeItemFromWishlist,
  moveItemToCart,
} from '../controllers/wishlistController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

// All wishlist routes require authentication
router.use(authenticate);

router.get('/', getWishlist);
router.post('/:productId', addItemToWishlist);
router.delete('/:productId', removeItemFromWishlist);
router.post('/:productId/move-to-cart', moveItemToCart);

export default router;
