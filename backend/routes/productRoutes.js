import { Router } from 'express';
import {
  getProducts,
  getProduct,
} from '../controllers/productController.js';

const router = Router();

// Public Catalog Discovery Endpoints
router.get('/', getProducts);
router.get('/:slug', getProduct);

export default router;
