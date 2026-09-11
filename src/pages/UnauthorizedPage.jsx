import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShieldAlert, LogIn, ArrowLeft, Home } from 'lucide-react';
import Button from '../components/common/Button';

export const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const returnUrl = location.state?.from?.pathname || '/';

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200 shadow-subtle">
          <ShieldAlert className="w-8 h-8 stroke-[1.5]" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 block">
            HTTP 401 — Authentication Required
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text-main">
            Authentication Required
          </h1>
          <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
            Please sign in to your Zareen account to access this private sanctum, order portfolio, or saved preferences.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link
            to="/login"
            state={{ from: { pathname: returnUrl } }}
            className="w-full sm:w-auto"
          >
            <Button variant="primary" size="md" leftIcon={LogIn} className="w-full justify-center">
              Sign In to Account
            </Button>
          </Link>

          <Link to="/" className="w-full sm:w-auto">
            <Button variant="outline" size="md" leftIcon={Home} className="w-full justify-center">
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
