import { Router } from 'express';
import {
  getAddresses,
  createNewAddress,
  updateAddressById,
  deleteAddressById,
  makeAddressDefault,
} from '../controllers/addressController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validate } from '../validators/validateRequest.js';
import {
  validateCreateAddress,
  validateUpdateAddress,
} from '../validators/addressValidator.js';

const router = Router();

// All address routes require authentication
router.use(authenticate);

router.get('/', getAddresses);
router.post('/', validate(validateCreateAddress), createNewAddress);
router.patch('/:id', validate(validateUpdateAddress), updateAddressById);
router.delete('/:id', deleteAddressById);
router.patch('/:id/default', makeAddressDefault);

export default router;
