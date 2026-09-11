import { ROLES } from './constants';

/**
 * Granular Permission Matrix for Zareen Luxury Marketplace
 */
export const PERMISSIONS = {
  // Customer Permissions
  PRODUCTS_VIEW: 'products.view',
  CART_MANAGE: 'cart.manage',
  WISHLIST_MANAGE: 'wishlist.manage',
  ORDERS_VIEW: 'orders.view',
  ORDERS_CREATE: 'orders.create',
  REVIEWS_CREATE: 'reviews.create',
  PROFILE_MANAGE: 'profile.manage',

  // Seller Permissions
  SELLER_DASHBOARD_VIEW: 'seller.dashboard.view',
  SELLER_PRODUCTS_VIEW: 'seller.products.view',
  SELLER_PRODUCTS_CREATE: 'seller.products.create',
  SELLER_PRODUCTS_UPDATE: 'seller.products.update',
  SELLER_PRODUCTS_DELETE: 'seller.products.delete',
  SELLER_INVENTORY_MANAGE: 'seller.inventory.manage',
  SELLER_ORDERS_VIEW: 'seller.orders.view',
  SELLER_ORDERS_MANAGE: 'seller.orders.manage',
  SELLER_STORE_MANAGE: 'seller.store.manage',
  SELLER_ANALYTICS_VIEW: 'seller.analytics.view',
  SELLER_COUPONS_MANAGE: 'seller.coupons.manage',

  // Admin Permissions
  ADMIN_DASHBOARD_VIEW: 'admin.dashboard.view',
  ADMIN_PRODUCTS_MANAGE: 'admin.products.manage',
  ADMIN_CATEGORIES_MANAGE: 'admin.categories.manage',
  ADMIN_BRANDS_MANAGE: 'admin.brands.manage',
  ADMIN_SELLERS_MANAGE: 'admin.sellers.manage',
  ADMIN_CUSTOMERS_MANAGE: 'admin.customers.manage',
  ADMIN_ORDERS_MANAGE: 'admin.orders.manage',
  ADMIN_PAYMENTS_VIEW: 'admin.payments.view',
  ADMIN_REFUNDS_MANAGE: 'admin.refunds.manage',
  ADMIN_COMMISSIONS_VIEW: 'admin.commissions.view',
  ADMIN_REVIEWS_MODERATE: 'admin.reviews.moderate',
  ADMIN_COUPONS_MANAGE: 'admin.coupons.manage',
  ADMIN_REPORTS_VIEW: 'admin.reports.view',
  ADMIN_NOTIFICATIONS_MANAGE: 'admin.notifications.manage',
  ADMIN_AUDIT_LOGS_VIEW: 'admin.audit_logs.view',
  ADMIN_SETTINGS_MANAGE: 'admin.settings.manage',
};

/**
 * Default fallback permissions per role if backend user object does not include explicit permissions array
 */
export const DEFAULT_ROLE_PERMISSIONS = {
  [ROLES.CUSTOMER]: [
    PERMISSIONS.PRODUCTS_VIEW,
    PERMISSIONS.CART_MANAGE,
    PERMISSIONS.WISHLIST_MANAGE,
    PERMISSIONS.ORDERS_VIEW,
    PERMISSIONS.ORDERS_CREATE,
    PERMISSIONS.REVIEWS_CREATE,
    PERMISSIONS.PROFILE_MANAGE,
  ],
  [ROLES.SELLER]: [
    PERMISSIONS.PRODUCTS_VIEW,
    PERMISSIONS.CART_MANAGE,
    PERMISSIONS.WISHLIST_MANAGE,
    PERMISSIONS.ORDERS_VIEW,
    PERMISSIONS.ORDERS_CREATE,
    PERMISSIONS.REVIEWS_CREATE,
    PERMISSIONS.PROFILE_MANAGE,
    PERMISSIONS.SELLER_DASHBOARD_VIEW,
    PERMISSIONS.SELLER_PRODUCTS_VIEW,
    PERMISSIONS.SELLER_PRODUCTS_CREATE,
    PERMISSIONS.SELLER_PRODUCTS_UPDATE,
    PERMISSIONS.SELLER_PRODUCTS_DELETE,
    PERMISSIONS.SELLER_INVENTORY_MANAGE,
    PERMISSIONS.SELLER_ORDERS_VIEW,
    PERMISSIONS.SELLER_ORDERS_MANAGE,
    PERMISSIONS.SELLER_STORE_MANAGE,
    PERMISSIONS.SELLER_ANALYTICS_VIEW,
    PERMISSIONS.SELLER_COUPONS_MANAGE,
  ],
  [ROLES.ADMIN]: Object.values(PERMISSIONS),
};

/**
 * Returns the effective permission list for a user.
 * Prioritizes backend-supplied `user.permissions` if present, otherwise uses role defaults.
 */
export const getUserPermissions = (user) => {
  if (!user) return [];
  if (Array.isArray(user.permissions) && user.permissions.length > 0) {
    return user.permissions;
  }
  const role = user.role || ROLES.CUSTOMER;
  return DEFAULT_ROLE_PERMISSIONS[role] || [];
};

/**
 * Checks if user possesses a single specific permission.
 */
export const hasPermission = (user, permission) => {
  if (!user || !permission) return false;
  // Superadmin bypass
  if (user.role === ROLES.ADMIN) return true;
  const userPerms = getUserPermissions(user);
  return userPerms.includes(permission);
};

/**
 * Checks if user possesses ANY of the specified permissions.
 */
export const hasAnyPermission = (user, permissions = []) => {
  if (!user || !permissions.length) return false;
  if (user.role === ROLES.ADMIN) return true;
  const userPerms = getUserPermissions(user);
  return permissions.some((p) => userPerms.includes(p));
};

/**
 * Checks if user possesses ALL of the specified permissions.
 */
export const hasAllPermissions = (user, permissions = []) => {
  if (!user || !permissions.length) return false;
  if (user.role === ROLES.ADMIN) return true;
  const userPerms = getUserPermissions(user);
  return permissions.every((p) => userPerms.includes(p));
};

export default {
  PERMISSIONS,
  DEFAULT_ROLE_PERMISSIONS,
  getUserPermissions,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
};
