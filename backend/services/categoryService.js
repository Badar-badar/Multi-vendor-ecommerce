import { Category } from '../models/Category.js';
import { Subcategory } from '../models/Subcategory.js';
import { Product } from '../models/Product.js';
import { AppError } from '../utils/appError.js';
import { createSlug } from '../utils/slugify.js';

/**
 * Category Service
 */

export const getPublicCategories = async () => {
  return Category.find({ status: 'active' })
    .sort({ sortOrder: 1, name: 1 })
    .populate({
      path: 'subcategories',
      match: { status: 'active' },
      select: 'name slug image sortOrder',
    })
    .lean();
};

export const getCategoryBySlug = async (slug) => {
  const category = await Category.findOne({ slug, status: 'active' })
    .populate({
      path: 'subcategories',
      match: { status: 'active' },
      select: 'name slug description image sortOrder',
    })
    .lean();

  if (!category) {
    throw AppError.notFound(`Category '${slug}' not found.`);
  }

  return category;
};

export const getAllCategoriesAdmin = async () => {
  return Category.find()
    .sort({ sortOrder: 1, createdAt: -1 })
    .populate('subcategories')
    .lean();
};

export const createCategory = async (data) => {
  const slug = createSlug(data.name);
  const existing = await Category.findOne({ slug });
  if (existing) {
    throw AppError.conflict(`A category with name '${data.name}' already exists.`);
  }

  const category = new Category({
    name: data.name.trim(),
    slug,
    description: data.description?.trim() || '',
    image: data.image || '',
    status: data.status || 'active',
    sortOrder: data.sortOrder !== undefined ? Number(data.sortOrder) : 0,
  });

  return category.save();
};

export const updateCategory = async (id, data) => {
  const category = await Category.findById(id);
  if (!category) {
    throw AppError.notFound('Category not found.');
  }

  if (data.name && data.name.trim() !== category.name) {
    const newSlug = createSlug(data.name);
    const existing = await Category.findOne({ slug: newSlug, _id: { $ne: id } });
    if (existing) {
      throw AppError.conflict(`A category with name '${data.name}' already exists.`);
    }
    category.name = data.name.trim();
    category.slug = newSlug;
  }

  if (data.description !== undefined) category.description = data.description.trim();
  if (data.image !== undefined) category.image = data.image;
  if (data.status !== undefined) category.status = data.status;
  if (data.sortOrder !== undefined) category.sortOrder = Number(data.sortOrder);

  return category.save();
};

export const deleteCategory = async (id) => {
  const category = await Category.findById(id);
  if (!category) {
    throw AppError.notFound('Category not found.');
  }

  // Check if products reference this category
  const productCount = await Product.countDocuments({ category: id });
  if (productCount > 0) {
    // Prevent deletion to preserve data integrity; suggest deactivation
    throw AppError.badRequest(
      `Cannot delete category. ${productCount} products are linked to it. Consider deactivating it instead.`
    );
  }

  // Also check subcategories
  const subcategoryCount = await Subcategory.countDocuments({ category: id });
  if (subcategoryCount > 0) {
    throw AppError.badRequest(
      `Cannot delete category. ${subcategoryCount} subcategories belong to it. Remove or reassign subcategories first.`
    );
  }

  await Category.findByIdAndDelete(id);
  return { deleted: true, id };
};

export default {
  getPublicCategories,
  getCategoryBySlug,
  getAllCategoriesAdmin,
  createCategory,
  updateCategory,
  deleteCategory,
};
