import { Seller, SELLER_APPROVAL_STATUS, SELLER_STATUS } from '../models/Seller.js';
import { Store } from '../models/Store.js';
import { User } from '../models/User.js';
import { ROLES, getDefaultPermissions } from '../config/permissions.js';
import { AppError } from '../utils/appError.js';
import { createSlug } from '../utils/slugify.js';

/**
 * Seller Service
 */

/**
 * Submits a new Seller application for an authenticated customer.
 */
export const applySeller = async (userId, data) => {
  const existingSeller = await Seller.findOne({ user: userId });

  if (existingSeller) {
    if (existingSeller.approvalStatus === SELLER_APPROVAL_STATUS.APPROVED) {
      throw AppError.conflict('You are already an approved seller on Zareen.');
    }
    if (
      existingSeller.approvalStatus === SELLER_APPROVAL_STATUS.PENDING ||
      existingSeller.approvalStatus === SELLER_APPROVAL_STATUS.UNDER_REVIEW
    ) {
      throw AppError.conflict('You already have a seller application pending review.');
    }
  }

  const seller = new Seller({
    user: userId,
    businessName: data.businessName.trim(),
    businessDescription: data.businessDescription?.trim() || '',
    businessEmail: data.businessEmail.trim().toLowerCase(),
    businessPhone: data.businessPhone.trim(),
    businessAddress: {
      street: data.businessAddress?.street || '',
      city: data.businessAddress?.city || '',
      state: data.businessAddress?.state || '',
      country: data.businessAddress?.country || 'Pakistan',
      postalCode: data.businessAddress?.postalCode || '',
    },
    approvalStatus: SELLER_APPROVAL_STATUS.PENDING,
    status: SELLER_STATUS.ACTIVE,
  });

  await seller.save();
  return seller;
};

/**
 * Retrieves the seller application for the current user.
 */
export const getMySellerApplication = async (userId) => {
  const seller = await Seller.findOne({ user: userId }).populate('store');
  if (!seller) {
    throw AppError.notFound('No seller application found for your account.');
  }
  return seller;
};

/**
 * Updates application details while still pending review.
 */
export const updateMySellerApplication = async (userId, data) => {
  const seller = await Seller.findOne({ user: userId });
  if (!seller) {
    throw AppError.notFound('No seller application found to update.');
  }

  if (seller.approvalStatus === SELLER_APPROVAL_STATUS.APPROVED) {
    throw AppError.badRequest('Your seller account is already approved. Use Store settings to manage details.');
  }

  if (data.businessName) seller.businessName = data.businessName.trim();
  if (data.businessDescription !== undefined) seller.businessDescription = data.businessDescription.trim();
  if (data.businessEmail) seller.businessEmail = data.businessEmail.trim().toLowerCase();
  if (data.businessPhone) seller.businessPhone = data.businessPhone.trim();
  if (data.businessAddress) {
    seller.businessAddress = {
      ...seller.businessAddress.toObject(),
      ...data.businessAddress,
    };
  }

  // If was previously rejected, re-submitting resets status to pending
  if (seller.approvalStatus === SELLER_APPROVAL_STATUS.REJECTED) {
    seller.approvalStatus = SELLER_APPROVAL_STATUS.PENDING;
    seller.rejectionReason = null;
  }

  await seller.save();
  return seller;
};

/**
 * Admin: List seller applications with filters & pagination.
 */
export const getAdminSellerApplications = async (query = {}) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 20));
  const skip = (page - 1) * limit;

  const filter = {};
  if (query.status) filter.status = query.status;
  if (query.approvalStatus) filter.approvalStatus = query.approvalStatus;

  const [items, total] = await Promise.all([
    Seller.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name email phone avatar')
      .populate('store', 'name slug status')
      .lean(),
    Seller.countDocuments(filter),
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Admin: View single seller application.
 */
export const getAdminSellerById = async (sellerId) => {
  const seller = await Seller.findById(sellerId)
    .populate('user', 'name email phone avatar role status')
    .populate('store')
    .populate('approvedBy', 'name email')
    .populate('rejectedBy', 'name email');

  if (!seller) {
    throw AppError.notFound('Seller record not found.');
  }
  return seller;
};

/**
 * Admin: Approve seller application.
 * Upgrades user role to 'seller', assigns seller permissions, and creates primary Store.
 */
export const approveSellerApplication = async (adminId, sellerId) => {
  const seller = await Seller.findById(sellerId);
  if (!seller) {
    throw AppError.notFound('Seller record not found.');
  }

  // 1. Update seller state
  seller.approvalStatus = SELLER_APPROVAL_STATUS.APPROVED;
  seller.status = SELLER_STATUS.ACTIVE;
  seller.approvedAt = new Date();
  seller.approvedBy = adminId;
  seller.rejectedAt = null;
  seller.rejectedBy = null;
  seller.rejectionReason = null;

  // 2. Upgrade user account to seller
  const user = await User.findById(seller.user);
  if (user) {
    user.role = ROLES.SELLER;
    user.permissions = getDefaultPermissions(ROLES.SELLER);
    await user.save();
  }

  // 3. Create or activate Store
  let store = await Store.findOne({ seller: seller._id });
  if (!store) {
    const baseSlug = createSlug(seller.businessName);
    let uniqueSlug = baseSlug;
    let count = 1;
    while (await Store.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${baseSlug}-${count++}`;
    }

    store = new Store({
      seller: seller._id,
      name: seller.businessName,
      slug: uniqueSlug,
      description: seller.businessDescription,
      contactEmail: seller.businessEmail,
      contactPhone: seller.businessPhone,
      address: seller.businessAddress,
      status: 'active',
    });
    await store.save();
  } else {
    store.status = 'active';
    await store.save();
  }

  seller.store = store._id;
  await seller.save();

  return { seller, store };
};

/**
 * Admin: Reject seller application with reason.
 */
export const rejectSellerApplication = async (adminId, sellerId, rejectionReason) => {
  const seller = await Seller.findById(sellerId);
  if (!seller) {
    throw AppError.notFound('Seller record not found.');
  }

  seller.approvalStatus = SELLER_APPROVAL_STATUS.REJECTED;
  seller.rejectedAt = new Date();
  seller.rejectedBy = adminId;
  seller.rejectionReason = rejectionReason || 'Application does not meet platform requirements.';

  await seller.save();
  return seller;
};

/**
 * Admin: Suspend seller account and active store.
 */
export const suspendSeller = async (adminId, sellerId) => {
  const seller = await Seller.findById(sellerId);
  if (!seller) {
    throw AppError.notFound('Seller record not found.');
  }

  seller.status = SELLER_STATUS.SUSPENDED;
  seller.approvalStatus = SELLER_APPROVAL_STATUS.SUSPENDED;
  await seller.save();

  // Deactivate store
  if (seller.store) {
    await Store.findByIdAndUpdate(seller.store, { status: 'inactive' });
  }

  return seller;
};

export default {
  applySeller,
  getMySellerApplication,
  updateMySellerApplication,
  getAdminSellerApplications,
  getAdminSellerById,
  approveSellerApplication,
  rejectSellerApplication,
  suspendSeller,
};
