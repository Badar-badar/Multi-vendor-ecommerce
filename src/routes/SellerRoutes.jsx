import { Route } from 'react-router-dom';
import RoleRoute from './RoleRoute';
import SellerLayout from '../components/layout/SellerLayout';
import { ROLES } from '../utils/constants';

// Seller Studio Pages
import SellerDashboardPage from '../pages/seller/SellerDashboardPage';
import SellerProductsPage from '../pages/seller/SellerProductsPage';
import SellerProductCreatePage from '../pages/seller/SellerProductCreatePage';
import SellerInventoryPage from '../pages/seller/SellerInventoryPage';
import SellerOrdersPage from '../pages/seller/SellerOrdersPage';
import SellerOrderDetailPage from '../pages/seller/SellerOrderDetailPage';
import SellerReturnsPage from '../pages/seller/SellerReturnsPage';
import SellerAnalyticsPage from '../pages/seller/SellerAnalyticsPage';
import SellerEarningsPage from '../pages/seller/SellerEarningsPage';
import SellerReportsPage from '../pages/seller/SellerReportsPage';
import SellerStorePage from '../pages/seller/SellerStorePage';
import SellerNotificationsPage from '../pages/seller/SellerNotificationsPage';
import SellerSettingsPage from '../pages/seller/SellerSettingsPage';
import SellerCouponsPage from '../pages/seller/SellerCouponsPage';
import SellerReviewsPage from '../pages/seller/SellerReviewsPage';

export const SellerRoutes = () => (
  <Route element={<RoleRoute allowedRoles={[ROLES.SELLER, ROLES.ADMIN]} />}>
    <Route element={<SellerLayout />}>
    <Route path="/seller/dashboard" element={<SellerDashboardPage />} />
    <Route path="/seller/products" element={<SellerProductsPage />} />
    <Route path="/seller/products/create" element={<SellerProductCreatePage />} />
    <Route path="/seller/products/new" element={<SellerProductCreatePage />} />
    <Route path="/seller/products/:id/edit" element={<SellerProductCreatePage />} />
    <Route path="/seller/inventory" element={<SellerInventoryPage />} />
    <Route path="/seller/orders" element={<SellerOrdersPage />} />
    <Route path="/seller/orders/:id" element={<SellerOrderDetailPage />} />
    <Route path="/seller/returns" element={<SellerReturnsPage />} />
    <Route path="/seller/store" element={<SellerStorePage />} />
    <Route path="/seller/coupons" element={<SellerCouponsPage />} />
    <Route path="/seller/reviews" element={<SellerReviewsPage />} />
    <Route path="/seller/analytics" element={<SellerAnalyticsPage />} />
    <Route path="/seller/earnings" element={<SellerEarningsPage />} />
    <Route path="/seller/reports" element={<SellerReportsPage />} />
    <Route path="/seller/notifications" element={<SellerNotificationsPage />} />
    <Route path="/seller/settings" element={<SellerSettingsPage />} />
  </Route>
  </Route>
);

export default SellerRoutes;
