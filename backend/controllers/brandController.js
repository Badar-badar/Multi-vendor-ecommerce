import {
  getPublicBrands,
  getBrandBySlug,
  getAllBrandsAdmin,
  createBrand,
  updateBrand,
  deleteBrand,
} from '../services/brandService.js';
import { sendSuccess } from '../utils/apiResponse.js';

/**
 * Brand Controller
 */

export const getBrands = async (req, res, next) => {
  try {
    const brands = await getPublicBrands();
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Brands retrieved successfully.',
      data: { brands },
    });
  } catch (error) {
    next(error);
  }
};

export const getBrand = async (req, res, next) => {
  try {
    const brand = await getBrandBySlug(req.params.slug);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Brand retrieved successfully.',
      data: { brand },
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminBrands = async (req, res, next) => {
  try {
    const brands = await getAllBrandsAdmin();
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Admin brands retrieved successfully.',
      data: { brands },
    });
  } catch (error) {
    next(error);
  }
};

export const createNewBrand = async (req, res, next) => {
  try {
    const brand = await createBrand(req.body);
    return sendSuccess(res, {
      statusCode: 201,
      message: 'Brand created successfully.',
      data: { brand },
    });
  } catch (error) {
    next(error);
  }
};

export const updateBrandById = async (req, res, next) => {
  try {
    const brand = await updateBrand(req.params.id, req.body);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Brand updated successfully.',
      data: { brand },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBrandById = async (req, res, next) => {
  try {
    const result = await deleteBrand(req.params.id);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Brand removed successfully.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getBrands,
  getBrand,
  getAdminBrands,
  createNewBrand,
  updateBrandById,
  deleteBrandById,
};
