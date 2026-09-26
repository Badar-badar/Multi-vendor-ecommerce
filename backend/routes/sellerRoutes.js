import { Router } from 'express';
import {
  submitApplication,
  getApplication,
  updateApplication,
} from '../controllers/sellerController.js';
import {
  getSellerStore,
  updateSellerStore,
} from '../controllers/storeController.js';
import {
  createProduct,
  getMyProducts,
  getMyProduct,
  updateMyProduct,
  deleteMyProduct,
} from '../controllers/productController.js';
import {
  getInventory,
  updateStock,
} from '../controllers/inventoryController.js';
import {
  getMyCoupons,
  createMyCoupon,
  updateMyCoupon,
  deleteMyCoupon,
} from '../controllers/couponController.js';
import {
  getSellerOrderList,
  getSellerOrder,
  updateSellerItem,
  getSellerReturnList,
  reviewSellerReturnRequest,
} from '../controllers/orderController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';
import { requirePermission } from '../middleware/permissionMiddleware.js';
import { validate } from '../validators/validateRequest.js';
import { validateApplySeller } from '../validators/sellerValidator.js';
import { validateUpdateStore } from '../validators/storeValidator.js';
import {
  validateCreateProduct,
  validateUpdateProduct,
  validateStockAdjustment,
} from '../validators/productValidator.js';
import { validateCreateCoupon } from '../validators/couponValidator.js';
import { ROLES, PERMISSIONS } from '../config/permissions.js';

const router = Router();

// All seller routes require authentication
router.use(authenticate);

// --- 1. Customer Seller Application Workflow ---
router.post(
  '/apply',
  validate(validateApplySeller),
  submitApplication
);
router.get('/application', getApplication);
router.patch('/application', updateApplication);

// --- 2. Approved Seller Atelier Management ---
const requireSellerAuth = [authenticate, requireRole(ROLES.SELLER, ROLES.ADMIN)];

// Store Profile
router.get(
  '/store',
  ...requireSellerAuth,
  requirePermission(PERMISSIONS.SELLER_STORE_MANAGE),
  getSellerStore
);
router.patch(
  '/store',
  ...requireSellerAuth,
  requirePermission(PERMISSIONS.SELLER_STORE_MANAGE),
  validate(validateUpdateStore),
  updateSellerStore
);

// Product Catalog Management
router.post(
  '/products',
  ...requireSellerAuth,
  requirePermission(PERMISSIONS.SELLER_PRODUCTS_CREATE),
  validate(validateCreateProduct),
  createProduct
);
router.get(
  '/products',
  ...requireSellerAuth,
  requirePermission(PERMISSIONS.SELLER_PRODUCTS_VIEW),
  getMyProducts
);
router.get(
  '/products/:id',
  ...requireSellerAuth,
  requirePermission(PERMISSIONS.SELLER_PRODUCTS_VIEW),
  getMyProduct
);
router.patch(
  '/products/:id',
  ...requireSellerAuth,
  requirePermission(PERMISSIONS.SELLER_PRODUCTS_UPDATE),
  validate(validateUpdateProduct),
  updateMyProduct
);
router.delete(
  '/products/:id',
  ...requireSellerAuth,
  requirePermission(PERMISSIONS.SELLER_PRODUCTS_DELETE),
  deleteMyProduct
);

// Inventory Management
router.get(
  '/inventory',
  ...requireSellerAuth,
  requirePermission(PERMISSIONS.SELLER_INVENTORY_MANAGE),
  getInventory
);
router.patch(
  '/inventory/:productId/stock',
  ...requireSellerAuth,
  requirePermission(PERMISSIONS.SELLER_INVENTORY_MANAGE),
  validate(validateStockAdjustment),
  updateStock
);

// Seller Coupons & Promotions
router.get(
  '/coupons',
  ...requireSellerAuth,
  requirePermission(PERMISSIONS.SELLER_COUPONS_MANAGE),
  getMyCoupons
);
router.post(
  '/coupons',
  ...requireSellerAuth,
  requirePermission(PERMISSIONS.SELLER_COUPONS_MANAGE),
  validate(validateCreateCoupon),
  createMyCoupon
);
router.patch(
  '/coupons/:id',
  ...requireSellerAuth,
  requirePermission(PERMISSIONS.SELLER_COUPONS_MANAGE),
  updateMyCoupon
);
router.delete(
  '/coupons/:id',
  ...requireSellerAuth,
  requirePermission(PERMISSIONS.SELLER_COUPONS_MANAGE),
  deleteMyCoupon
);

// Seller Orders & Suborders
router.get(
  '/orders',
  ...requireSellerAuth,
  requirePermission(PERMISSIONS.SELLER_ORDERS_VIEW),
  getSellerOrderList
);
router.get(
  '/orders/:id',
  ...requireSellerAuth,
  requirePermission(PERMISSIONS.SELLER_ORDERS_VIEW),
  getSellerOrder
);
router.patch(
  '/orders/:id/status',
  ...requireSellerAuth,
  requirePermission(PERMISSIONS.SELLER_ORDERS_MANAGE),
  updateSellerItem
);

// Seller Returns
router.get(
  '/returns',
  ...requireSellerAuth,
  requirePermission(PERMISSIONS.SELLER_ORDERS_MANAGE),
  getSellerReturnList
);
router.patch(
  '/returns/:id/review',
  ...requireSellerAuth,
  requirePermission(PERMISSIONS.SELLER_ORDERS_MANAGE),
  reviewSellerReturnRequest
);

// Seller Financial Ledger & Earnings
import {
  getSellerEarnings,
  getSellerTransactionsList,
} from '../controllers/financialController.js';

router.get(
  '/earnings',
  ...requireSellerAuth,
  getSellerEarnings
);
router.get(
  '/transactions',
  ...requireSellerAuth,
  getSellerTransactionsList
);

// Seller Analytics & Business Intelligence
import {
  getSellerAnalyticsOverview,
  getSellerAnalyticsSales,
  getSellerAnalyticsProducts,
  getSellerAnalyticsCustomers,
} from '../controllers/analyticsController.js';

router.get(
  '/analytics/overview',
  ...requireSellerAuth,
  getSellerAnalyticsOverview
);
router.get(
  '/analytics/sales',
  ...requireSellerAuth,
  getSellerAnalyticsSales
);
router.get(
  '/analytics/products',
  ...requireSellerAuth,
  getSellerAnalyticsProducts
);
router.get(
  '/analytics/customers',
  ...requireSellerAuth,
  getSellerAnalyticsCustomers
);

export default router;
