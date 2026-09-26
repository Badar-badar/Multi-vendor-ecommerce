import {
  getPublicSubcategories,
  getSubcategoryBySlug,
  getSubcategoriesByCategory,
  getAllSubcategoriesAdmin,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
} from '../services/subcategoryService.js';
import { sendSuccess } from '../utils/apiResponse.js';

/**
 * Subcategory Controller
 */

export const getSubcategories = async (req, res, next) => {
  try {
    const subcategories = await getPublicSubcategories(req.query);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Subcategories retrieved successfully.',
      data: { subcategories },
    });
  } catch (error) {
    next(error);
  }
};

export const getSubcategory = async (req, res, next) => {
  try {
    const subcategory = await getSubcategoryBySlug(req.params.slug);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Subcategory retrieved successfully.',
      data: { subcategory },
    });
  } catch (error) {
    next(error);
  }
};

export const getByParentCategory = async (req, res, next) => {
  try {
    const subcategories = await getSubcategoriesByCategory(req.params.categoryId);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Subcategories for category retrieved successfully.',
      data: { subcategories },
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminSubcategories = async (req, res, next) => {
  try {
    const subcategories = await getAllSubcategoriesAdmin();
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Admin subcategories retrieved successfully.',
      data: { subcategories },
    });
  } catch (error) {
    next(error);
  }
};

export const createNewSubcategory = async (req, res, next) => {
  try {
    const subcategory = await createSubcategory(req.body);
    return sendSuccess(res, {
      statusCode: 201,
      message: 'Subcategory created successfully.',
      data: { subcategory },
    });
  } catch (error) {
    next(error);
  }
};

export const updateSubcategoryById = async (req, res, next) => {
  try {
    const subcategory = await updateSubcategory(req.params.id, req.body);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Subcategory updated successfully.',
      data: { subcategory },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSubcategoryById = async (req, res, next) => {
  try {
    const result = await deleteSubcategory(req.params.id);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Subcategory removed successfully.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getSubcategories,
  getSubcategory,
  getByParentCategory,
  getAdminSubcategories,
  createNewSubcategory,
  updateSubcategoryById,
  deleteSubcategoryById,
};
