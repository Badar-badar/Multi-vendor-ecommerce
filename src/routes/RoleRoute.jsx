import { Navigate, useLocation, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { Sparkles } from 'lucide-react';
import { ROLES } from '../utils/constants';
import { hasAllPermissions, hasAnyPermission } from '../utils/permissions';

export const RoleRoute = ({
  allowedRoles = [],
  requiredPermissions = [],
  requireAllPermissions = true,
  children,
}) => {
  const { user, isAuthenticated, loading, initialized } = useAuth();
  const location = useLocation();

  // Prevent unauthorized flashing while checking session on app startup
  if (!initialized || loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 p-8">
        <div className="relative w-12 h-12 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-2 border-accent border-t-transparent animate-spin" />
          <Sparkles className="w-4 h-4 text-accent absolute" />
        </div>
        <p className="text-xs text-text-muted font-medium tracking-wide">
          Verifying Role & Permission Clearance...
        </p>
      </div>
    );
  }

  // 1. Unauthenticated check -> redirect to login with return URL
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const currentRole = user?.role || ROLES.CUSTOMER;

  // 2. Role Clearance check
  if (allowedRoles.length > 0 && !allowedRoles.includes(currentRole)) {
    // If a Customer is attempting to access Seller routes, direct them to the seller onboarding status page
    if (
      currentRole === ROLES.CUSTOMER &&
      allowedRoles.includes(ROLES.SELLER) &&
      !allowedRoles.includes(ROLES.CUSTOMER)
    ) {
      return <Navigate to="/seller/application" replace />;
    }

    return <Navigate to="/403" state={{ from: location }} replace />;
  }

  // 3. Permission Clearance check (if specified)
  if (requiredPermissions.length > 0) {
    const hasPerms = requireAllPermissions
      ? hasAllPermissions(user, requiredPermissions)
      : hasAnyPermission(user, requiredPermissions);

    if (!hasPerms) {
      return <Navigate to="/403" state={{ from: location }} replace />;
    }
  }

  return children || <Outlet />;
};

export default RoleRoute;
