import {
  getPublicCategories,
  getCategoryBySlug,
  getAllCategoriesAdmin,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../services/categoryService.js';
import { sendSuccess } from '../utils/apiResponse.js';

/**
 * Category Controller
 */

export const getCategories = async (req, res, next) => {
  try {
    const categories = await getPublicCategories();
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Categories retrieved successfully.',
      data: { categories },
    });
  } catch (error) {
    next(error);
  }
};

export const getCategory = async (req, res, next) => {
  try {
    const category = await getCategoryBySlug(req.params.slug);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Category retrieved successfully.',
      data: { category },
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminCategories = async (req, res, next) => {
  try {
    const categories = await getAllCategoriesAdmin();
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Admin categories list retrieved successfully.',
      data: { categories },
    });
  } catch (error) {
    next(error);
  }
};

export const createNewCategory = async (req, res, next) => {
  try {
    const category = await createCategory(req.body);
    return sendSuccess(res, {
      statusCode: 201,
      message: 'Category created successfully.',
      data: { category },
    });
  } catch (error) {
    next(error);
  }
};

export const updateCategoryById = async (req, res, next) => {
  try {
    const category = await updateCategory(req.params.id, req.body);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Category updated successfully.',
      data: { category },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCategoryById = async (req, res, next) => {
  try {
    const result = await deleteCategory(req.params.id);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Category removed successfully.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getCategories,
  getCategory,
  getAdminCategories,
  createNewCategory,
  updateCategoryById,
  deleteCategoryById,
};
