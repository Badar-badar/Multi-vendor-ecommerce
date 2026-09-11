import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, Home, ArrowLeft, Store, LayoutDashboard } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import Button from '../components/common/Button';
import { ROLES } from '../utils/constants';

export const ForbiddenPage = () => {
  const navigate = useNavigate();
  const { user, isSeller, isAdmin, isAuthenticated } = useAuth();

  const getDashboardPath = () => {
    if (!isAuthenticated) return '/login';
    if (isAdmin) return '/admin/dashboard';
    if (isSeller) return '/seller/dashboard';
    return '/account';
  };

  const getDashboardLabel = () => {
    if (!isAuthenticated) return 'Sign In';
    if (isAdmin) return 'Admin Command';
    if (isSeller) return 'Seller Studio';
    return 'Customer Hub';
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Forbidden Icon */}
        <div className="w-16 h-16 rounded-3xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto border border-rose-200 dark:border-rose-800 shadow-subtle animate-in fade-in zoom-in-95">
          <ShieldAlert className="w-8 h-8 stroke-[1.5]" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 block">
            HTTP 403 — Access Restricted
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text-main">
            Authorization Restricted
          </h1>
          <p className="text-xs sm:text-sm text-text-muted leading-relaxed max-w-sm mx-auto">
            You do not hold the required authorization credentials or role privileges to access this private domain.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Button
            variant="outline"
            size="md"
            leftIcon={ArrowLeft}
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto justify-center"
          >
            Go Back
          </Button>

          <Link to={getDashboardPath()} className="w-full sm:w-auto">
            <Button
              variant="primary"
              size="md"
              leftIcon={LayoutDashboard}
              className="w-full justify-center"
            >
              {getDashboardLabel()}
            </Button>
          </Link>

          {!isSeller && !isAdmin && isAuthenticated && (
            <Link to="/seller/register" className="w-full sm:w-auto">
              <Button
                variant="secondary"
                size="md"
                leftIcon={Store}
                className="w-full justify-center"
              >
                Artisan Application
              </Button>
            </Link>
          )}

          <Link to="/" className="w-full sm:w-auto">
            <Button
              variant="ghost"
              size="md"
              leftIcon={Home}
              className="w-full justify-center"
            >
              Marketplace
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForbiddenPage;
