import api from './api';

export const auditLogApi = {
  // Retrieve paginated security and governance audit logs
  getAuditLogs: (params = {}) => api.get('/admin/audit-logs', { params }),

  // Fetch detailed record for specific audit log event
  getAuditLogDetails: (id) => api.get(`/admin/audit-logs/${id}`),

  // Export audit trail (CSV stream)
  exportAuditLogs: (params = {}) =>
    api.get('/admin/audit-logs/export', {
      params,
      responseType: 'blob',
    }),
};

export default auditLogApi;
