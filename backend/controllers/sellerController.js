import {
  applySeller,
  getMySellerApplication,
  updateMySellerApplication,
  getAdminSellerApplications,
  getAdminSellerById,
  approveSellerApplication,
  rejectSellerApplication,
  suspendSeller,
} from '../services/sellerService.js';
import { sendSuccess } from '../utils/apiResponse.js';

/**
 * Seller Application Controller
 */

export const submitApplication = async (req, res, next) => {
  try {
    const seller = await applySeller(req.user._id, req.body);
    return sendSuccess(res, {
      statusCode: 201,
      message: 'Seller application submitted successfully. Concierge review is in progress.',
      data: { seller },
    });
  } catch (error) {
    next(error);
  }
};

export const getApplication = async (req, res, next) => {
  try {
    const seller = await getMySellerApplication(req.user._id);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Seller application retrieved successfully.',
      data: { seller },
    });
  } catch (error) {
    next(error);
  }
};

export const updateApplication = async (req, res, next) => {
  try {
    const seller = await updateMySellerApplication(req.user._id, req.body);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Seller application updated successfully.',
      data: { seller },
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminApplications = async (req, res, next) => {
  try {
    const result = await getAdminSellerApplications(req.query);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Seller applications retrieved successfully.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminApplicationById = async (req, res, next) => {
  try {
    const seller = await getAdminSellerById(req.params.id);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Seller application details retrieved successfully.',
      data: { seller },
    });
  } catch (error) {
    next(error);
  }
};

export const approveApplication = async (req, res, next) => {
  try {
    const result = await approveSellerApplication(req.user._id, req.params.id);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Seller application approved. Seller role and Atelier store activated.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const rejectApplication = async (req, res, next) => {
  try {
    const seller = await rejectSellerApplication(req.user._id, req.params.id, req.body.rejectionReason);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Seller application rejected.',
      data: { seller },
    });
  } catch (error) {
    next(error);
  }
};

export const suspendSellerAccount = async (req, res, next) => {
  try {
    const seller = await suspendSeller(req.user._id, req.params.id);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Seller account suspended successfully.',
      data: { seller },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  submitApplication,
  getApplication,
  updateApplication,
  getAdminApplications,
  getAdminApplicationById,
  approveApplication,
  rejectApplication,
  suspendSellerAccount,
};
