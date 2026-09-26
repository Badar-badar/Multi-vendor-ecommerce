import { Router } from 'express';
import { checkHealth } from '../controllers/healthController.js';

const router = Router();

/**
 * @route   GET /api/v1/health
 * @desc    API and database status check
 * @access  Public
 */
router.get('/', checkHealth);

export default router;
