import api from './api';

export const invoiceApi = {
  getInvoice: (orderId) =>
    api.get(`/orders/${orderId}/invoice`),
  downloadInvoice: (orderId) =>
    api.get(`/orders/${orderId}/invoice/download`, {
      responseType: 'blob',
    }),
};

export default invoiceApi;
