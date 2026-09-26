import { Router } from 'express';
import {
  getSubcategories,
  getSubcategory,
  getByParentCategory,
} from '../controllers/subcategoryController.js';

const router = Router();

// Public Subcategory Endpoints
router.get('/', getSubcategories);
router.get('/:slug', getSubcategory);
router.get('/category/:categoryId', getByParentCategory);

export default router;
