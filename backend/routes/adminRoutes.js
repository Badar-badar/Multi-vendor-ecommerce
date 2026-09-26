import { Router } from 'express';
import {
  getAdminCategories,
  createNewCategory,
  updateCategoryById,
  deleteCategoryById,
} from '../controllers/categoryController.js';
import {
  getAdminSubcategories,
  createNewSubcategory,
  updateSubcategoryById,
  deleteSubcategoryById,
} from '../controllers/subcategoryController.js';
import {
  getAdminBrands,
  createNewBrand,
  updateBrandById,
  deleteBrandById,
} from '../controllers/brandController.js';
import {
  getAdminApplications,
  getAdminApplicationById,
  approveApplication,
  rejectApplication,
  suspendSellerAccount,
} from '../controllers/sellerController.js';
import {
  getAdminProductList,
  approveProductById,
  rejectProductById,
  archiveProductById,
} from '../controllers/productController.js';
import {
  getAllCouponsAdmin,
  createAdminNewCoupon,
  updateAdminCouponById,
  deleteAdminCouponById,
} from '../controllers/couponController.js';
import {
  getAdminOrderList,
  getAdminOrder,
  updateAdminOrder,
} from '../controllers/orderController.js';
import {
  getAdminReviewList,
  moderateReviewStatus,
} from '../controllers/reviewController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';
import { requirePermission } from '../middleware/permissionMiddleware.js';
import { validate } from '../validators/validateRequest.js';
import {
  validateCreateCategory,
  validateUpdateCategory,
} from '../validators/categoryValidator.js';
import {
  validateCreateSubcategory,
  validateUpdateSubcategory,
} from '../validators/subcategoryValidator.js';
import {
  validateCreateBrand,
  validateUpdateBrand,
} from '../validators/brandValidator.js';
import { validateRejectSeller } from '../validators/sellerValidator.js';
import { validateCreateCoupon } from '../validators/couponValidator.js';
import { ROLES, PERMISSIONS } from '../config/permissions.js';

const router = Router();

// Master Admin Security Gate
router.use(authenticate, requireRole(ROLES.ADMIN));

// --- 1. Category Taxonomy Management ---
router.get(
  '/categories',
  requirePermission(PERMISSIONS.ADMIN_CATEGORIES_MANAGE),
  getAdminCategories
);
router.post(
  '/categories',
  requirePermission(PERMISSIONS.ADMIN_CATEGORIES_MANAGE),
  validate(validateCreateCategory),
  createNewCategory
);
router.patch(
  '/categories/:id',
  requirePermission(PERMISSIONS.ADMIN_CATEGORIES_MANAGE),
  validate(validateUpdateCategory),
  updateCategoryById
);
router.delete(
  '/categories/:id',
  requirePermission(PERMISSIONS.ADMIN_CATEGORIES_MANAGE),
  deleteCategoryById
);

// --- 2. Subcategory Taxonomy Management ---
router.get(
  '/subcategories',
  requirePermission(PERMISSIONS.ADMIN_CATEGORIES_MANAGE),
  getAdminSubcategories
);
router.post(
  '/subcategories',
  requirePermission(PERMISSIONS.ADMIN_CATEGORIES_MANAGE),
  validate(validateCreateSubcategory),
  createNewSubcategory
);
router.patch(
  '/subcategories/:id',
  requirePermission(PERMISSIONS.ADMIN_CATEGORIES_MANAGE),
  validate(validateUpdateSubcategory),
  updateSubcategoryById
);
router.delete(
  '/subcategories/:id',
  requirePermission(PERMISSIONS.ADMIN_CATEGORIES_MANAGE),
  deleteSubcategoryById
);

// --- 3. Brand Management ---
router.get(
  '/brands',
  requirePermission(PERMISSIONS.ADMIN_BRANDS_MANAGE),
  getAdminBrands
);
router.post(
  '/brands',
  requirePermission(PERMISSIONS.ADMIN_BRANDS_MANAGE),
  validate(validateCreateBrand),
  createNewBrand
);
router.patch(
  '/brands/:id',
  requirePermission(PERMISSIONS.ADMIN_BRANDS_MANAGE),
  validate(validateUpdateBrand),
  updateBrandById
);
router.delete(
  '/brands/:id',
  requirePermission(PERMISSIONS.ADMIN_BRANDS_MANAGE),
  deleteBrandById
);

// --- 4. Seller Application & Moderation ---
router.get(
  '/sellers/applications',
  requirePermission(PERMISSIONS.ADMIN_SELLERS_MANAGE),
  getAdminApplications
);
router.get(
  '/sellers/:id',
  requirePermission(PERMISSIONS.ADMIN_SELLERS_MANAGE),
  getAdminApplicationById
);
router.patch(
  '/sellers/:id/approve',
  requirePermission(PERMISSIONS.ADMIN_SELLERS_MANAGE),
  approveApplication
);
router.patch(
  '/sellers/:id/reject',
  requirePermission(PERMISSIONS.ADMIN_SELLERS_MANAGE),
  validate(validateRejectSeller),
  rejectApplication
);
router.patch(
  '/sellers/:id/suspend',
  requirePermission(PERMISSIONS.ADMIN_SELLERS_MANAGE),
  suspendSellerAccount
);

// --- 5. Product Catalog Moderation ---
router.get(
  '/products',
  requirePermission(PERMISSIONS.ADMIN_PRODUCTS_MANAGE),
  getAdminProductList
);
router.patch(
  '/products/:id/approve',
  requirePermission(PERMISSIONS.ADMIN_PRODUCTS_MANAGE),
  approveProductById
);
router.patch(
  '/products/:id/reject',
  requirePermission(PERMISSIONS.ADMIN_PRODUCTS_MANAGE),
  rejectProductById
);
router.patch(
  '/products/:id/archive',
  requirePermission(PERMISSIONS.ADMIN_PRODUCTS_MANAGE),
  archiveProductById
);

// --- 6. Admin Coupons & Campaigns ---
router.get(
  '/coupons',
  requirePermission(PERMISSIONS.ADMIN_COUPONS_MANAGE),
  getAllCouponsAdmin
);
router.post(
  '/coupons',
  requirePermission(PERMISSIONS.ADMIN_COUPONS_MANAGE),
  validate(validateCreateCoupon),
  createAdminNewCoupon
);
router.patch(
  '/coupons/:id',
  requirePermission(PERMISSIONS.ADMIN_COUPONS_MANAGE),
  updateAdminCouponById
);
router.delete(
  '/coupons/:id',
  requirePermission(PERMISSIONS.ADMIN_COUPONS_MANAGE),
  deleteAdminCouponById
);

// --- 7. Admin Order Control ---
router.get(
  '/orders',
  requirePermission(PERMISSIONS.ADMIN_ORDERS_MANAGE),
  getAdminOrderList
);
router.get(
  '/orders/:id',
  requirePermission(PERMISSIONS.ADMIN_ORDERS_MANAGE),
  getAdminOrder
);
router.patch(
  '/orders/:id/status',
  requirePermission(PERMISSIONS.ADMIN_ORDERS_MANAGE),
  updateAdminOrder
);

// --- 8. Admin Review Moderation ---
router.get(
  '/reviews',
  requirePermission(PERMISSIONS.ADMIN_REVIEWS_MODERATE),
  getAdminReviewList
);
router.patch(
  '/reviews/:id/status',
  requirePermission(PERMISSIONS.ADMIN_REVIEWS_MODERATE),
  moderateReviewStatus
);

// --- 9. Admin Financial Oversight, Payments & Refunds ---
import {
  getAdminPaymentsList,
  getAdminTransactionsList,
  getAdminRefundsList,
  getAdminCommissionsList,
  processAdminRefund,
} from '../controllers/financialController.js';
import { validateProcessRefund } from '../validators/paymentValidator.js';

router.get(
  '/payments',
  getAdminPaymentsList
);
router.get(
  '/transactions',
  getAdminTransactionsList
);
router.get(
  '/refunds',
  getAdminRefundsList
);
router.post(
  '/orders/:id/refund',
  validate(validateProcessRefund),
  processAdminRefund
);
router.get(
  '/commissions',
  getAdminCommissionsList
);

// --- 10. Admin Analytics & Business Intelligence ---
import {
  getAdminAnalyticsOverviewController,
  getAdminAnalyticsSalesController,
  getAdminAnalyticsSellersController,
  getAdminAnalyticsProductsController,
  getAdminAnalyticsCustomersController,
  getAdminAnalyticsPaymentsController,
} from '../controllers/analyticsController.js';

router.get('/analytics/overview', getAdminAnalyticsOverviewController);
router.get('/analytics/sales', getAdminAnalyticsSalesController);
router.get('/analytics/sellers', getAdminAnalyticsSellersController);
router.get('/analytics/products', getAdminAnalyticsProductsController);
router.get('/analytics/customers', getAdminAnalyticsCustomersController);
router.get('/analytics/payments', getAdminAnalyticsPaymentsController);

// --- 11. Admin Reports & Data Exports ---
import {
  getSalesReport,
  getOrdersReport,
  getSellerReport,
  getPaymentsReport,
  queueBackgroundReport,
} from '../controllers/reportController.js';

router.get('/reports/sales', getSalesReport);
router.get('/reports/orders', getOrdersReport);
router.get('/reports/sellers', getSellerReport);
router.get('/reports/payments', getPaymentsReport);
router.post('/reports/queue', queueBackgroundReport);

// --- 12. Admin Platform Settings Management ---
import {
  getSettings,
  updateSettings,
} from '../controllers/settingController.js';
import { validateUpdateSettings } from '../validators/settingValidator.js';

router.get('/settings', getSettings);
router.patch('/settings', validate(validateUpdateSettings), updateSettings);

export default router;
