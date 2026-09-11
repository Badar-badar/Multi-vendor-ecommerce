import { Routes, Route } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import AuthRoutes from './AuthRoutes';
import UserRoutes from './UserRoutes';
import SellerRoutes from './SellerRoutes';
import AdminRoutes from './AdminRoutes';
import NotFoundPage from '../pages/NotFoundPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* 1. CUSTOMER & PUBLIC ROUTES (Rendered inside MainLayout with Marketplace Navbar & Footer) */}
      <Route element={<MainLayout />}>
        {/* Public Marketplace Catalog & Customer Account Hub Routes */}
        {UserRoutes()}

        {/* Authentication & Password Recovery Routes */}
        {AuthRoutes()}

        {/* 404 Fallback within Marketplace Layout */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* 2. SELLER STUDIO PORTAL ROUTES (Standalone Layout with Compact Header & Seller Sidebar) */}
      {SellerRoutes()}

      {/* 3. ADMIN CONSOLE ROUTES (Standalone Layout with Compact Header & Sentinel Sidebar) */}
      {AdminRoutes()}
    </Routes>
  );
};

export default AppRoutes;
