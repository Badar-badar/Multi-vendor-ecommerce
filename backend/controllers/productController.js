import {
  getPublicProducts,
  getPublicProductBySlug,
  createSellerProduct,
  getSellerProducts,
  getSellerProductById,
  updateSellerProduct,
  deleteSellerProduct,
  getAdminProducts,
  approveProduct,
  rejectProduct,
  archiveProduct,
} from '../services/productService.js';
import { sendSuccess } from '../utils/apiResponse.js';

/**
 * Product Controller
 */

// --- Public Endpoints ---

export const getProducts = async (req, res, next) => {
  try {
    const result = await getPublicProducts(req.query);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Marketplace products retrieved successfully.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const product = await getPublicProductBySlug(req.params.slug);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Product details retrieved successfully.',
      data: { product },
    });
  } catch (error) {
    next(error);
  }
};

// --- Seller Endpoints ---

export const createProduct = async (req, res, next) => {
  try {
    const product = await createSellerProduct(req.user._id, req.body);
    return sendSuccess(res, {
      statusCode: 201,
      message: 'Product created and submitted for catalog review.',
      data: { product },
    });
  } catch (error) {
    next(error);
  }
};

export const getMyProducts = async (req, res, next) => {
  try {
    const result = await getSellerProducts(req.user._id, req.query);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Seller products retrieved successfully.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyProduct = async (req, res, next) => {
  try {
    const product = await getSellerProductById(req.user._id, req.params.id);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Seller product retrieved successfully.',
      data: { product },
    });
  } catch (error) {
    next(error);
  }
};

export const updateMyProduct = async (req, res, next) => {
  try {
    const product = await updateSellerProduct(req.user._id, req.params.id, req.body);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Product updated successfully.',
      data: { product },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMyProduct = async (req, res, next) => {
  try {
    const result = await deleteSellerProduct(req.user._id, req.params.id);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Product and variants removed successfully.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// --- Admin Endpoints ---

export const getAdminProductList = async (req, res, next) => {
  try {
    const result = await getAdminProducts(req.query);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Admin products list retrieved successfully.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const approveProductById = async (req, res, next) => {
  try {
    const product = await approveProduct(req.user._id, req.params.id);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Product approved and published to marketplace.',
      data: { product },
    });
  } catch (error) {
    next(error);
  }
};

export const rejectProductById = async (req, res, next) => {
  try {
    const product = await rejectProduct(req.user._id, req.params.id, req.body.rejectionReason);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Product rejected.',
      data: { product },
    });
  } catch (error) {
    next(error);
  }
};

export const archiveProductById = async (req, res, next) => {
  try {
    const product = await archiveProduct(req.user._id, req.params.id);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Product archived.',
      data: { product },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getProducts,
  getProduct,
  createProduct,
  getMyProducts,
  getMyProduct,
  updateMyProduct,
  deleteMyProduct,
  getAdminProductList,
  approveProductById,
  rejectProductById,
  archiveProductById,
};
