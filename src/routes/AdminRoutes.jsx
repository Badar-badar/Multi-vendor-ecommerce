import { Route } from 'react-router-dom';
import RoleRoute from './RoleRoute';
import AdminLayout from '../components/layout/AdminLayout';
import { ROLES } from '../utils/constants';

// Admin Portal Pages
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import AdminReportsPage from '../pages/admin/AdminReportsPage';
import AdminProductsPage from '../pages/admin/AdminProductsPage';
import AdminCategoriesPage from '../pages/admin/AdminCategoriesPage';
import AdminSubcategoriesPage from '../pages/admin/AdminSubcategoriesPage';
import AdminBrandsPage from '../pages/admin/AdminBrandsPage';
import AdminSellersPage from '../pages/admin/AdminSellersPage';
import AdminSellerDetailPage from '../pages/admin/AdminSellerDetailPage';
import AdminUsersPage from '../pages/admin/AdminUsersPage';
import AdminUserDetailPage from '../pages/admin/AdminUserDetailPage';
import AdminOrdersPage from '../pages/admin/AdminOrdersPage';
import AdminOrderDetailPage from '../pages/admin/AdminOrderDetailPage';
import AdminPaymentsPage from '../pages/admin/AdminPaymentsPage';
import AdminRefundsPage from '../pages/admin/AdminRefundsPage';
import AdminCommissionsPage from '../pages/admin/AdminCommissionsPage';
import AdminReviewsPage from '../pages/admin/AdminReviewsPage';
import AdminCouponsPage from '../pages/admin/AdminCouponsPage';
import AdminPromotionsPage from '../pages/admin/AdminPromotionsPage';
import AdminNotificationsPage from '../pages/admin/AdminNotificationsPage';
import AdminAuditLogsPage from '../pages/admin/AdminAuditLogsPage';
import AdminSettingsPage from '../pages/admin/AdminSettingsPage';

export const AdminRoutes = () => (
  <Route element={<RoleRoute allowedRoles={[ROLES.ADMIN]} />}>
    <Route element={<AdminLayout />}>
    {/* Overview */}
    <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
    <Route path="/admin/reports" element={<AdminReportsPage />} />

    {/* Catalog */}
    <Route path="/admin/products" element={<AdminProductsPage />} />
    <Route path="/admin/categories" element={<AdminCategoriesPage />} />
    <Route path="/admin/subcategories" element={<AdminSubcategoriesPage />} />
    <Route path="/admin/brands" element={<AdminBrandsPage />} />

    {/* Marketplace */}
    <Route path="/admin/sellers" element={<AdminSellersPage />} />
    <Route path="/admin/sellers/:id" element={<AdminSellerDetailPage />} />
    <Route path="/admin/users" element={<AdminUsersPage />} />
    <Route path="/admin/users/:id" element={<AdminUserDetailPage />} />
    <Route path="/admin/orders" element={<AdminOrdersPage />} />
    <Route path="/admin/orders/:id" element={<AdminOrderDetailPage />} />

    {/* Finance */}
    <Route path="/admin/payments" element={<AdminPaymentsPage />} />
    <Route path="/admin/refunds" element={<AdminRefundsPage />} />
    <Route path="/admin/commissions" element={<AdminCommissionsPage />} />

    {/* Marketing */}
    <Route path="/admin/coupons" element={<AdminCouponsPage />} />
    <Route path="/admin/promotions" element={<AdminPromotionsPage />} />

    {/* Moderation */}
    <Route path="/admin/reviews" element={<AdminReviewsPage />} />

    {/* System */}
    <Route path="/admin/notifications" element={<AdminNotificationsPage />} />
    <Route path="/admin/audit-logs" element={<AdminAuditLogsPage />} />
    <Route path="/admin/settings" element={<AdminSettingsPage />} />
    </Route>
  </Route>
);

export default AdminRoutes;
