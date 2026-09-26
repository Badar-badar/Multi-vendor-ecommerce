import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Sparkles, User, Store, X } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

export const DevRoleSwitcher = () => {
  const navigate = useNavigate();
  const { role, switchRoleForDev } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleRoleSelect = (newRole) => {
    switchRoleForDev(newRole);
    if (newRole === 'admin') {
      navigate('/admin/dashboard');
    } else if (newRole === 'seller') {
      navigate('/seller/dashboard');
    } else if (newRole === 'customer') {
      navigate('/profile');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-surface border border-border shadow-modal rounded-2xl p-4 w-72 max-w-[calc(100vw-2rem)] backdrop-blur-md">
          <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                Role Testing Bar
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-text-muted hover:text-text-main text-xs p-1 rounded-lg hover:bg-surface-muted transition-colors cursor-pointer"
              aria-label="Close role testing bar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="text-xs text-text-muted mb-3 flex items-center justify-between">
            <span>Current active:</span>
            <span className="font-bold text-primary capitalize bg-primary-light px-2 py-0.5 rounded-md border border-primary/20">
              {role || 'Guest'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleRoleSelect('customer')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                role === 'customer'
                  ? 'bg-primary text-white border-primary shadow-xs'
                  : 'bg-surface-muted hover:bg-surface-hover hover:border-primary/40 border-border text-text-main'
              }`}
            >
              <User className="w-3.5 h-3.5" /> Customer
            </button>
            <button
              onClick={() => handleRoleSelect('seller')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                role === 'seller'
                  ? 'bg-primary text-white border-primary shadow-xs'
                  : 'bg-surface-muted hover:bg-surface-hover hover:border-primary/40 border-border text-text-main'
              }`}
            >
              <Store className="w-3.5 h-3.5" /> Seller
            </button>
            <button
              onClick={() => handleRoleSelect('admin')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                role === 'admin'
                  ? 'bg-primary text-white border-primary shadow-xs'
                  : 'bg-surface-muted hover:bg-surface-hover hover:border-primary/40 border-border text-text-main'
              }`}
            >
              <Shield className="w-3.5 h-3.5" /> Admin
            </button>
            <button
              onClick={() => handleRoleSelect('guest')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                !role
                  ? 'bg-primary text-white border-primary shadow-xs'
                  : 'bg-surface-muted hover:bg-surface-hover hover:border-primary/40 border-border text-text-main'
              }`}
            >
              Guest
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white text-xs font-medium px-4 py-2 rounded-full shadow-card hover:shadow-card-hover border border-primary/30 hover:scale-105 transition-all duration-200 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-white/90" />
          <span>Role: <strong className="capitalize font-semibold">{role || 'Guest'}</strong></span>
        </button>
      )}
    </div>
  );
};

export default DevRoleSwitcher;
