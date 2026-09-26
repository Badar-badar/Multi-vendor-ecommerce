import api from './api';

export const addressApi = {
  getAddresses: () =>
    api.get('/users/me/addresses'),
  createAddress: (addressData) =>
    api.post('/users/me/addresses', addressData),
  updateAddress: (id, addressData) =>
    api.patch(`/users/me/addresses/${id}`, addressData),
  deleteAddress: (id) =>
    api.delete(`/users/me/addresses/${id}`),
  setDefaultAddress: (id) =>
    api.patch(`/users/me/addresses/${id}/default`),
};

export default addressApi;
