import api from './api';

export const settingsApi = {
  // Retrieve global marketplace configurations
  getPlatformSettings: () => api.get('/admin/settings'),

  // Update marketplace parameters
  updatePlatformSettings: (data) => api.put('/admin/settings', data),

  // Platform maintenance mode control
  getMaintenanceStatus: () => api.get('/admin/settings/maintenance'),
  updateMaintenanceStatus: (statusData) =>
    api.put('/admin/settings/maintenance', statusData),
};

export default settingsApi;
