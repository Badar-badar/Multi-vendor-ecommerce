import { Router } from 'express';
import {
  getStores,
  getStore,
} from '../controllers/storeController.js';

const router = Router();

// Public Store Discovery Endpoints
router.get('/', getStores);
router.get('/:slug', getStore);

export default router;
