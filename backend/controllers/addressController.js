import {
  getMyAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from '../services/addressService.js';
import { sendSuccess } from '../utils/apiResponse.js';

/**
 * Address Controller
 */

export const getAddresses = async (req, res, next) => {
  try {
    const addresses = await getMyAddresses(req.user._id);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Delivery addresses retrieved successfully.',
      data: { addresses },
    });
  } catch (error) {
    next(error);
  }
};

export const createNewAddress = async (req, res, next) => {
  try {
    const address = await createAddress(req.user._id, req.body);
    return sendSuccess(res, {
      statusCode: 201,
      message: 'Address saved successfully.',
      data: { address },
    });
  } catch (error) {
    next(error);
  }
};

export const updateAddressById = async (req, res, next) => {
  try {
    const address = await updateAddress(req.user._id, req.params.id, req.body);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Address updated successfully.',
      data: { address },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAddressById = async (req, res, next) => {
  try {
    const result = await deleteAddress(req.user._id, req.params.id);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Address removed successfully.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const makeAddressDefault = async (req, res, next) => {
  try {
    const address = await setDefaultAddress(req.user._id, req.params.id);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Default delivery address updated.',
      data: { address },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getAddresses,
  createNewAddress,
  updateAddressById,
  deleteAddressById,
  makeAddressDefault,
};
