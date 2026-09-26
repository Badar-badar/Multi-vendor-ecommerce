import { Address } from '../models/Address.js';
import { AppError } from '../utils/appError.js';

/**
 * Address Service
 */

export const getMyAddresses = async (userId) => {
  return Address.find({ user: userId }).sort({ isDefault: -1, createdAt: -1 }).lean();
};

export const createAddress = async (userId, data) => {
  const existingCount = await Address.countDocuments({ user: userId });
  const shouldBeDefault = data.isDefault === true || existingCount === 0;

  if (shouldBeDefault) {
    await Address.updateMany({ user: userId }, { isDefault: false });
  }

  const address = new Address({
    user: userId,
    fullName: data.fullName.trim(),
    phone: data.phone.trim(),
    addressLine1: data.addressLine1.trim(),
    addressLine2: data.addressLine2?.trim() || '',
    city: data.city.trim(),
    state: data.state.trim(),
    postalCode: data.postalCode.trim(),
    country: data.country?.trim() || 'Pakistan',
    isDefault: shouldBeDefault,
  });

  return address.save();
};

export const updateAddress = async (userId, addressId, data) => {
  const address = await Address.findById(addressId);
  if (!address) {
    throw AppError.notFound('Address not found.');
  }

  if (address.user.toString() !== userId.toString()) {
    throw AppError.forbidden('Unauthorized access: You do not own this address.');
  }

  if (data.isDefault === true && !address.isDefault) {
    await Address.updateMany({ user: userId }, { isDefault: false });
    address.isDefault = true;
  }

  if (data.fullName !== undefined) address.fullName = data.fullName.trim();
  if (data.phone !== undefined) address.phone = data.phone.trim();
  if (data.addressLine1 !== undefined) address.addressLine1 = data.addressLine1.trim();
  if (data.addressLine2 !== undefined) address.addressLine2 = data.addressLine2.trim();
  if (data.city !== undefined) address.city = data.city.trim();
  if (data.state !== undefined) address.state = data.state.trim();
  if (data.postalCode !== undefined) address.postalCode = data.postalCode.trim();
  if (data.country !== undefined) address.country = data.country.trim();

  return address.save();
};

export const deleteAddress = async (userId, addressId) => {
  const address = await Address.findById(addressId);
  if (!address) {
    throw AppError.notFound('Address not found.');
  }

  if (address.user.toString() !== userId.toString()) {
    throw AppError.forbidden('Unauthorized access: You do not own this address.');
  }

  const wasDefault = address.isDefault;
  await Address.findByIdAndDelete(addressId);

  // If deleted address was default, promote another address to default
  if (wasDefault) {
    const nextAddress = await Address.findOne({ user: userId }).sort({ createdAt: -1 });
    if (nextAddress) {
      nextAddress.isDefault = true;
      await nextAddress.save();
    }
  }

  return { deleted: true, id: addressId };
};

export const setDefaultAddress = async (userId, addressId) => {
  const address = await Address.findById(addressId);
  if (!address) {
    throw AppError.notFound('Address not found.');
  }

  if (address.user.toString() !== userId.toString()) {
    throw AppError.forbidden('Unauthorized access: You do not own this address.');
  }

  await Address.updateMany({ user: userId }, { isDefault: false });
  address.isDefault = true;
  await address.save();

  return address;
};

export default {
  getMyAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};
