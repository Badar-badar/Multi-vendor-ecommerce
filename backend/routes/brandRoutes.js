import { Router } from 'express';
import {
  getBrands,
  getBrand,
} from '../controllers/brandController.js';

const router = Router();

// Public Brand Endpoints
router.get('/', getBrands);
router.get('/:slug', getBrand);

export default router;
