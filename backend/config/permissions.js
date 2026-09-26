/**
 * ZAREEN ROLE-BASED ACCESS CONTROL (RBAC) & PERMISSIONS SPECIFICATION
 * Centralized, granular permissions architecture for Customers, Sellers, and Admins.
 */

export const ROLES = Object.freeze({
  CUSTOMER: 'customer',
  SELLER: 'seller',
  ADMIN: 'admin',
});

export const USER_STATUS = Object.freeze({
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
});

export const PERMISSIONS = Object.freeze({
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
  SELLER_REPORTS_VIEW: 'seller.reports.view',
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
});

/**
 * Default permission allocations per role.
 */
export const ROLE_PERMISSIONS = Object.freeze({
  [ROLES.CUSTOMER]: Object.freeze([
    PERMISSIONS.PRODUCTS_VIEW,
    PERMISSIONS.CART_MANAGE,
    PERMISSIONS.WISHLIST_MANAGE,
    PERMISSIONS.ORDERS_VIEW,
    PERMISSIONS.ORDERS_CREATE,
    PERMISSIONS.REVIEWS_CREATE,
    PERMISSIONS.PROFILE_MANAGE,
  ]),

  [ROLES.SELLER]: Object.freeze([
    // Inherited baseline customer privileges
    PERMISSIONS.PRODUCTS_VIEW,
    PERMISSIONS.CART_MANAGE,
    PERMISSIONS.WISHLIST_MANAGE,
    PERMISSIONS.ORDERS_VIEW,
    PERMISSIONS.ORDERS_CREATE,
    PERMISSIONS.REVIEWS_CREATE,
    PERMISSIONS.PROFILE_MANAGE,

    // Seller Atelier privileges
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
    PERMISSIONS.SELLER_REPORTS_VIEW,
    PERMISSIONS.SELLER_COUPONS_MANAGE,
  ]),

  [ROLES.ADMIN]: Object.freeze(Object.values(PERMISSIONS)),
});

/**
 * Returns default permissions array for a given role.
 */
export const getDefaultPermissions = (role) => {
  return ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS[ROLES.CUSTOMER];
};

/**
 * Utility: Checks if a user has a specific permission.
 */
export const hasPermission = (user, permission) => {
  if (!user || !user.permissions || !Array.isArray(user.permissions)) return false;
  if (user.role === ROLES.ADMIN) return true; // Admins have master access
  return user.permissions.includes(permission);
};

/**
 * Utility: Checks if a user has at least one of the specified permissions.
 */
export const hasAnyPermission = (user, permissions = []) => {
  if (!user || !user.permissions || !Array.isArray(user.permissions)) return false;
  if (user.role === ROLES.ADMIN) return true;
  return permissions.some((perm) => user.permissions.includes(perm));
};

/**
 * Utility: Checks if a user has all of the specified permissions.
 */
export const hasAllPermissions = (user, permissions = []) => {
  if (!user || !user.permissions || !Array.isArray(user.permissions)) return false;
  if (user.role === ROLES.ADMIN) return true;
  return permissions.every((perm) => user.permissions.includes(perm));
};

export default {
  ROLES,
  USER_STATUS,
  PERMISSIONS,
  ROLE_PERMISSIONS,
  getDefaultPermissions,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
};
