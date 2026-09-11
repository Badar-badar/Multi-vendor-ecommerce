import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ArrowRight, Shield, AlertCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { selectAuthLoading, selectAuthError } from '../../features/auth/authSelectors';
import { clearAuthError, setMockUser } from '../../features/auth/authSlice';
import AuthLayout from '../../components/layout/AuthLayout';
import Input from '../../components/forms/Input';
import Checkbox from '../../components/forms/Checkbox';
import Button from '../../components/common/Button';
import GoogleOAuthButton from '../../components/auth/GoogleOAuthButton';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const loading = useSelector(selectAuthLoading);
  const serverError = useSelector(selectAuthError);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState({});

  // Redirect destination after login
  const from = location.state?.from?.pathname || '/';

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Please provide a valid email format.';
    }

    if (!password) {
      errs.password = 'Password is required.';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearAuthError());

    if (!validate()) return;

    try {
      // Simulate backend authentication
      await new Promise((res) => setTimeout(res, 500));

      const normalizedEmail = email.trim().toLowerCase();
      let role = 'customer';
      let name = email.split('@')[0].replace('.', ' ').toUpperCase();

      if (normalizedEmail.includes('admin')) {
        role = 'admin';
        name = 'Victoria Vance';
      } else if (normalizedEmail.includes('seller') || normalizedEmail.includes('atelier')) {
        role = 'seller';
        name = 'Jean-Luc Moreau';
      }

      const mockUser = {
        id: `usr-${Date.now()}`,
        name: name,
        email: normalizedEmail,
        role: role,
        avatar:
          role === 'seller'
            ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop'
            : role === 'admin'
            ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop'
            : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
        isEmailVerified: true,
      };

      dispatch(setMockUser(mockUser));
      toast.success(`Welcome back, ${mockUser.name}.`);

      // Intelligent redirect based on role or original requested URL
      if (from && from !== '/' && from !== '/login') {
        navigate(from, { replace: true });
      } else if (role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else if (role === 'seller') {
        navigate('/seller/dashboard', { replace: true });
      } else {
        navigate('/account', { replace: true });
      }
    } catch {
      toast.error('Unable to sign in. Please verify your credentials.');
    }
  };

  return (
    <AuthLayout
      title="Enter the Private Sovereign Registry"
      subtitle="Access your curated orders, saved artisan acquisitions, and personalized concierge portfolio."
      quote="“Simplicity and uncompromising craftsmanship are the hallmarks of enduring luxury.”"
      quoteAuthor="Zareen Maison Council"
    >
      <div className="space-y-6">
        {/* Title Header */}
        <div className="space-y-1 text-center sm:text-left">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-text-main">
            Member Sign In
          </h2>
          <p className="text-xs text-text-muted">
            Enter your sovereign credentials to access your account.
          </p>
        </div>

        {/* Server Error Alert Banner */}
        {serverError && (
          <div className="p-3 rounded-xl bg-error-light border border-rose-200 flex items-start gap-2.5 text-xs text-error-dark animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-error shrink-0 mt-0.5" />
            <span>{serverError}</span>
          </div>
        )}

        {/* Google OAuth Option */}
        <div className="space-y-4">
          <GoogleOAuthButton text="Continue with Google" redirectPath={from} />

          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-border" />
            <span className="absolute bg-background px-3 text-[11px] font-semibold text-text-subtle uppercase tracking-wider">
              Or with sovereign email
            </span>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Input
            id="login-email"
            type="email"
            label="Email Address"
            placeholder="patron@domain.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
            }}
            icon={Mail}
            error={errors.email}
            required
            autoComplete="email"
          />

          <Input
            id="login-password"
            type="password"
            label="Password"
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
            }}
            icon={Lock}
            error={errors.password}
            required
            autoComplete="current-password"
          />

          {/* Remember me & Forgot Password */}
          <div className="flex items-center justify-between pt-1">
            <Checkbox
              id="remember-me"
              label="Remember this device"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />

            <Link
              to="/forgot-password"
              className="text-xs font-semibold text-accent hover:text-accent-hover hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            rightIcon={ArrowRight}
            className="mt-2"
          >
            Sign In to Account
          </Button>
        </form>

        {/* Register CTA */}
        <div className="pt-4 border-t border-border text-center text-xs text-text-muted">
          <span>New to Zareen? </span>
          <Link
            to="/register"
            className="font-bold text-text-main hover:text-accent hover:underline ml-1"
          >
            Inscribe a New Account
          </Link>
        </div>

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-text-subtle pt-2">
          <Shield className="w-3.5 h-3.5 text-accent" />
          <span>256-Bit Encrypted Sovereign Authentication</span>
        </div>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
