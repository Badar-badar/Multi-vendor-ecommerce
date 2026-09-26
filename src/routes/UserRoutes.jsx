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
import OrderTrackingPage from '../pages/orders/OrderTrackingPage';
import SellerRegisterPage from '../pages/seller/SellerRegisterPage';
import SellerApplicationStatusPage from '../pages/seller/SellerApplicationStatusPage';
import CustomerOnboardingPage from '../pages/account/CustomerOnboardingPage';
import UnauthorizedPage from '../pages/UnauthorizedPage';
import ForbiddenPage from '../pages/ForbiddenPage';

// Dedicated Informational & Policy Pages
import AboutPage from '../pages/about/AboutPage';
import PressPage from '../pages/press/PressPage';
import AuthenticityPage from '../pages/about/AuthenticityPage';
import SustainabilityPage from '../pages/about/SustainabilityPage';
import ContactPage from '../pages/contact/ContactPage';
import SupportPage from '../pages/support/SupportPage';
import FaqPage from '../pages/support/FaqPage';
import ShippingPolicyPage from '../pages/support/ShippingPolicyPage';
import ReturnsPage from '../pages/support/ReturnsPage';
import TermsPage from '../pages/legal/TermsPage';
import PrivacyPolicyPage from '../pages/legal/PrivacyPolicyPage';
import CookiesPolicyPage from '../pages/legal/CookiesPolicyPage';
import SecurityPolicyPage from '../pages/legal/SecurityPolicyPage';

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
    <Route path="/cart" element={<CartPage />} />
    <Route path="/wishlist" element={<WishlistPage />} />
    <Route path="/orders/track" element={<OrderTrackingPage />} />

    {/* Dedicated Informational, Brand & Policy Pages */}
    <Route path="/about" element={<AboutPage />} />
    <Route path="/story" element={<AboutPage />} />
    <Route path="/press" element={<PressPage />} />
    <Route path="/authenticity" element={<AuthenticityPage />} />
    <Route path="/sustainability" element={<SustainabilityPage />} />
    <Route path="/careers" element={<Navigate to="/about" replace />} />
    <Route path="/contact" element={<ContactPage />} />
    <Route path="/support" element={<SupportPage />} />
    <Route path="/faq" element={<FaqPage />} />
    <Route path="/faqs" element={<FaqPage />} />
    <Route path="/shipping-policy" element={<ShippingPolicyPage />} />
    <Route path="/shipping" element={<ShippingPolicyPage />} />
    <Route path="/returns" element={<ReturnsPage />} />
    <Route path="/terms" element={<TermsPage />} />
    <Route path="/terms-and-conditions" element={<TermsPage />} />
    <Route path="/privacy" element={<PrivacyPolicyPage />} />
    <Route path="/cookies" element={<CookiesPolicyPage />} />
    <Route path="/security" element={<SecurityPolicyPage />} />
    <Route path="/affiliates" element={<SellerRegisterPage />} />
    <Route path="/seller/guidelines" element={<SellerRegisterPage />} />
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
