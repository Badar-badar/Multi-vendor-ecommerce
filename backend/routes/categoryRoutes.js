import { Router } from 'express';
import {
  getCategories,
  getCategory,
} from '../controllers/categoryController.js';

const router = Router();

// Public Category Endpoints
router.get('/', getCategories);
router.get('/:slug', getCategory);

export default router;
