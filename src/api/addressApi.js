import api from './api';

export const addressApi = {
  getAddresses: () =>
    api.get('/addresses'),
  createAddress: (addressData) =>
    api.post('/addresses', addressData),
  updateAddress: (id, addressData) =>
    api.put(`/addresses/${id}`, addressData),
  deleteAddress: (id) =>
    api.delete(`/addresses/${id}`),
  setDefaultShipping: (id) =>
    api.put(`/addresses/${id}/default-shipping`),
  setDefaultBilling: (id) =>
    api.put(`/addresses/${id}/default-billing`),
};

export default addressApi;
