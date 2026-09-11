import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import DevRoleSwitcher from '../common/DevRoleSwitcher';

export const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-text-main">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      {/* Dev role switcher for quick previewing Customer/Seller/Admin flows */}
      <DevRoleSwitcher />
    </div>
  );
};

export default MainLayout;
