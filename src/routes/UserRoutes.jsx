import { Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Public Catalog Pages
import HomePage from '../pages/home/HomePage';
import ProductsPage from '../pages/products/ProductsPage';
import ProductDetailPage from '../pages/products/ProductDetailPage';
import CategoriesPage from '../pages/categories/CategoriesPage';
import CategoryDetailPage from '../pages/categories/CategoryDetailPage';
import BrandsPage from '../pages/brands/BrandsPage';
import StoresPage from '../pages/stores/StoresPage';
import StoreDetailPage from '../pages/stores/StoreDetailPage';
import CartPage from '../pages/cart/CartPage';
import WishlistPage from '../pages/wishlist/WishlistPage';
import AboutPage from '../pages/about/AboutPage';
import ContactPage from '../pages/contact/ContactPage';
import SupportPage from '../pages/support/SupportPage';
import OrderTrackingPage from '../pages/orders/OrderTrackingPage';
import SellerRegisterPage from '../pages/seller/SellerRegisterPage';
import SellerApplicationStatusPage from '../pages/seller/SellerApplicationStatusPage';
import CustomerOnboardingPage from '../pages/account/CustomerOnboardingPage';
import UnauthorizedPage from '../pages/UnauthorizedPage';
import ForbiddenPage from '../pages/ForbiddenPage';

// Checkout Page
import CheckoutPage from '../pages/checkout/CheckoutPage';
import OrderSuccessPage from '../pages/checkout/OrderSuccessPage';

// Customer / User Account Hub Pages
import AccountDashboardPage from '../pages/account/AccountDashboardPage';
import AccountProfilePage from '../pages/account/AccountProfilePage';
import AccountAddressesPage from '../pages/account/AccountAddressesPage';
import AccountOrdersPage from '../pages/account/AccountOrdersPage';
import OrderDetailPage from '../pages/account/OrderDetailPage';
import AccountNotificationsPage from '../pages/account/AccountNotificationsPage';
import AccountSettingsPage from '../pages/account/AccountSettingsPage';
import AccountReviewsPage from '../pages/account/AccountReviewsPage';
import AccountReturnsPage from '../pages/account/AccountReturnsPage';
import AccountPaymentsPage from '../pages/account/AccountPaymentsPage';

export const UserRoutes = () => (
  <>
    {/* Public Marketplace Catalog */}
    <Route path="/" element={<HomePage />} />
    <Route path="/products" element={<ProductsPage />} />
    <Route path="/products/:id" element={<ProductDetailPage />} />
    <Route path="/categories" element={<CategoriesPage />} />
    <Route path="/categories/:slug" element={<CategoryDetailPage />} />
    <Route path="/brands" element={<BrandsPage />} />
    <Route path="/stores" element={<StoresPage />} />
    <Route path="/stores/:slug" element={<StoreDetailPage />} />
    <Route path="/sellers" element={<StoresPage />} />
    <Route path="/about" element={<AboutPage />} />
    <Route path="/contact" element={<ContactPage />} />
    <Route path="/support" element={<SupportPage />} />
    <Route path="/orders/track" element={<OrderTrackingPage />} />
    <Route path="/cart" element={<CartPage />} />
    <Route path="/wishlist" element={<WishlistPage />} />
    <Route path="/faq" element={<SupportPage />} />
    <Route path="/terms" element={<SupportPage />} />
    <Route path="/privacy" element={<SupportPage />} />
    <Route path="/shipping-policy" element={<SupportPage />} />
    <Route path="/authenticity" element={<AboutPage />} />
    <Route path="/sustainability" element={<AboutPage />} />
    <Route path="/careers" element={<AboutPage />} />
    <Route path="/press" element={<AboutPage />} />
    <Route path="/affiliates" element={<SellerRegisterPage />} />
    <Route path="/returns" element={<SupportPage />} />
    <Route path="/unauthorized" element={<UnauthorizedPage />} />
    <Route path="/forbidden" element={<ForbiddenPage />} />
    <Route path="/403" element={<ForbiddenPage />} />

    {/* Seller Registration & Status Tracking */}
    <Route path="/seller/register" element={<SellerRegisterPage />} />
    <Route path="/seller/application" element={<SellerApplicationStatusPage />} />

    {/* Protected Customer Routes */}
    <Route element={<ProtectedRoute />}>
      {/* Onboarding & Checkout */}
      <Route path="/onboarding/profile" element={<CustomerOnboardingPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/order-success" element={<OrderSuccessPage />} />
      <Route path="/order-success/:id" element={<OrderSuccessPage />} />

      {/* Account Hub */}
      <Route path="/account" element={<AccountDashboardPage />} />
      <Route path="/profile" element={<AccountDashboardPage />} />
      <Route path="/account/profile" element={<AccountProfilePage />} />
      <Route path="/account/addresses" element={<AccountAddressesPage />} />
      <Route path="/profile/addresses" element={<AccountAddressesPage />} />
      <Route path="/account/orders" element={<AccountOrdersPage />} />
      <Route path="/orders" element={<AccountOrdersPage />} />
      <Route path="/account/orders/:id" element={<OrderDetailPage />} />
      <Route path="/orders/:id" element={<OrderDetailPage />} />
      <Route path="/account/payments" element={<AccountPaymentsPage />} />
      <Route path="/account/reviews" element={<AccountReviewsPage />} />
      <Route path="/account/returns" element={<AccountReturnsPage />} />
      <Route path="/account/notifications" element={<AccountNotificationsPage />} />
      <Route path="/account/settings" element={<AccountSettingsPage />} />
      <Route path="/account/wishlist" element={<Navigate to="/wishlist" replace />} />
    </Route>
  </>
);

export default UserRoutes;
