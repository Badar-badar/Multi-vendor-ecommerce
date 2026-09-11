import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Hourglass, LogIn, Home, ShieldAlert } from 'lucide-react';
import Button from '../../components/common/Button';

export const SessionExpiredPage = () => {
  const location = useLocation();
  const returnUrl = location.state?.from?.pathname || '/';

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center space-y-6 bg-surface p-8 sm:p-10 rounded-3xl border border-border shadow-subtle animate-in fade-in">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200 shadow-xs">
          <Hourglass className="w-8 h-8 stroke-[1.75]" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 block">
            Security Notification
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text-main">
            Sovereign Session Expired
          </h1>
          <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
            Your encrypted session token has expired due to inactivity. For your asset protection and order privacy, please re-authenticate.
          </p>
        </div>

        <div className="p-3 bg-surface-muted rounded-xl border border-border flex items-center justify-center gap-2 text-xs text-text-subtle">
          <ShieldAlert className="w-4 h-4 text-accent shrink-0" />
          <span>No unsaved order data was compromised.</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/login"
            state={{ from: { pathname: returnUrl } }}
            className="w-full sm:w-auto flex-1"
          >
            <Button
              variant="primary"
              size="md"
              leftIcon={LogIn}
              className="w-full justify-center"
            >
              Re-authenticate Now
            </Button>
          </Link>

          <Link to="/" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="md"
              leftIcon={Home}
              className="w-full justify-center"
            >
              Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SessionExpiredPage;
