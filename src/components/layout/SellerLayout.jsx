import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import SellerHeader from './SellerHeader';
import SellerSidebar from './SellerSidebar';
import DevRoleSwitcher from '../common/DevRoleSwitcher';

export const SellerLayout = ({ children }) => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-text-main flex flex-col antialiased">
      {/* Dev role test switcher */}
      <DevRoleSwitcher />

      {/* Seller Top Navigation Bar */}
      <SellerHeader
        mobileOpen={mobileDrawerOpen}
        onToggleMobile={() => setMobileDrawerOpen(!mobileDrawerOpen)}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex min-w-0">
        {/* Left Sidebar */}
        <SellerSidebar
          mobileOpen={mobileDrawerOpen}
          onClose={() => setMobileDrawerOpen(false)}
        />

        {/* Dynamic Page Content */}
        <main className="flex-1 min-w-0 bg-background-alt overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default SellerLayout;
