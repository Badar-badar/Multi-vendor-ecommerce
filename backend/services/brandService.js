import { Brand } from '../models/Brand.js';
import { Product } from '../models/Product.js';
import { AppError } from '../utils/appError.js';
import { createSlug } from '../utils/slugify.js';

/**
 * Brand Service
 */

export const getPublicBrands = async () => {
  return Brand.find({ status: 'active' }).sort({ name: 1 }).lean();
};

export const getBrandBySlug = async (slug) => {
  const brand = await Brand.findOne({ slug, status: 'active' }).lean();
  if (!brand) {
    throw AppError.notFound(`Brand '${slug}' not found.`);
  }
  return brand;
};

export const getAllBrandsAdmin = async () => {
  return Brand.find().sort({ createdAt: -1 }).lean();
};

export const createBrand = async (data) => {
  const slug = createSlug(data.name);
  const existing = await Brand.findOne({ slug });
  if (existing) {
    throw AppError.conflict(`A brand with name '${data.name}' already exists.`);
  }

  const brand = new Brand({
    name: data.name.trim(),
    slug,
    description: data.description?.trim() || '',
    logo: data.logo || '',
    status: data.status || 'active',
  });

  return brand.save();
};

export const updateBrand = async (id, data) => {
  const brand = await Brand.findById(id);
  if (!brand) {
    throw AppError.notFound('Brand not found.');
  }

  if (data.name && data.name.trim() !== brand.name) {
    const newSlug = createSlug(data.name);
    const existing = await Brand.findOne({ slug: newSlug, _id: { $ne: id } });
    if (existing) {
      throw AppError.conflict(`A brand with name '${data.name}' already exists.`);
    }
    brand.name = data.name.trim();
    brand.slug = newSlug;
  }

  if (data.description !== undefined) brand.description = data.description.trim();
  if (data.logo !== undefined) brand.logo = data.logo;
  if (data.status !== undefined) brand.status = data.status;

  return brand.save();
};

export const deleteBrand = async (id) => {
  const brand = await Brand.findById(id);
  if (!brand) {
    throw AppError.notFound('Brand not found.');
  }

  const productCount = await Product.countDocuments({ brand: id });
  if (productCount > 0) {
    throw AppError.badRequest(
      `Cannot delete brand. ${productCount} products are linked to it. Deactivate it instead.`
    );
  }

  await Brand.findByIdAndDelete(id);
  return { deleted: true, id };
};

export default {
  getPublicBrands,
  getBrandBySlug,
  getAllBrandsAdmin,
  createBrand,
  updateBrand,
  deleteBrand,
};
