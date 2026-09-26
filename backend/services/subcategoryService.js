import { Subcategory } from '../models/Subcategory.js';
import { Category } from '../models/Category.js';
import { Product } from '../models/Product.js';
import { AppError } from '../utils/appError.js';
import { createSlug } from '../utils/slugify.js';

/**
 * Subcategory Service
 */

export const getPublicSubcategories = async (query = {}) => {
  const filter = { status: 'active' };
  if (query.category) {
    filter.category = query.category;
  }

  return Subcategory.find(filter)
    .sort({ sortOrder: 1, name: 1 })
    .populate('category', 'name slug')
    .lean();
};

export const getSubcategoryBySlug = async (slug) => {
  const subcategory = await Subcategory.findOne({ slug, status: 'active' })
    .populate('category', 'name slug')
    .lean();

  if (!subcategory) {
    throw AppError.notFound(`Subcategory '${slug}' not found.`);
  }

  return subcategory;
};

export const getSubcategoriesByCategory = async (categoryId) => {
  return Subcategory.find({ category: categoryId, status: 'active' })
    .sort({ sortOrder: 1, name: 1 })
    .lean();
};

export const getAllSubcategoriesAdmin = async () => {
  return Subcategory.find()
    .sort({ createdAt: -1 })
    .populate('category', 'name slug status')
    .lean();
};

export const createSubcategory = async (data) => {
  // Validate parent category existence
  const parentCategory = await Category.findById(data.category);
  if (!parentCategory) {
    throw AppError.badRequest('Parent category not found.');
  }

  const slug = createSlug(data.name);
  const existing = await Subcategory.findOne({ category: data.category, slug });
  if (existing) {
    throw AppError.conflict(
      `A subcategory with name '${data.name}' already exists in category '${parentCategory.name}'.`
    );
  }

  const subcategory = new Subcategory({
    category: data.category,
    name: data.name.trim(),
    slug,
    description: data.description?.trim() || '',
    image: data.image || '',
    status: data.status || 'active',
    sortOrder: data.sortOrder !== undefined ? Number(data.sortOrder) : 0,
  });

  return subcategory.save();
};

export const updateSubcategory = async (id, data) => {
  const subcategory = await Subcategory.findById(id);
  if (!subcategory) {
    throw AppError.notFound('Subcategory not found.');
  }

  if (data.category && data.category !== subcategory.category.toString()) {
    const parentCategory = await Category.findById(data.category);
    if (!parentCategory) {
      throw AppError.badRequest('New parent category not found.');
    }
    subcategory.category = data.category;
  }

  if (data.name && data.name.trim() !== subcategory.name) {
    const newSlug = createSlug(data.name);
    const existing = await Subcategory.findOne({
      category: subcategory.category,
      slug: newSlug,
      _id: { $ne: id },
    });
    if (existing) {
      throw AppError.conflict(`A subcategory with name '${data.name}' already exists in this category.`);
    }
    subcategory.name = data.name.trim();
    subcategory.slug = newSlug;
  }

  if (data.description !== undefined) subcategory.description = data.description.trim();
  if (data.image !== undefined) subcategory.image = data.image;
  if (data.status !== undefined) subcategory.status = data.status;
  if (data.sortOrder !== undefined) subcategory.sortOrder = Number(data.sortOrder);

  return subcategory.save();
};

export const deleteSubcategory = async (id) => {
  const subcategory = await Subcategory.findById(id);
  if (!subcategory) {
    throw AppError.notFound('Subcategory not found.');
  }

  const productCount = await Product.countDocuments({ subcategory: id });
  if (productCount > 0) {
    throw AppError.badRequest(
      `Cannot delete subcategory. ${productCount} products are linked to it. Consider deactivating it.`
    );
  }

  await Subcategory.findByIdAndDelete(id);
  return { deleted: true, id };
};

export default {
  getPublicSubcategories,
  getSubcategoryBySlug,
  getSubcategoriesByCategory,
  getAllSubcategoriesAdmin,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
};
