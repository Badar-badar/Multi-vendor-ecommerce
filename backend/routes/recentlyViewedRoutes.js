import { Router } from 'express';
import { getHistory, recordView } from '../controllers/recentlyViewedController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticate);

router.get('/', getHistory);
router.post('/:productId', recordView);

export default router;
