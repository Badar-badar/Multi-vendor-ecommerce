import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, User, ArrowRight, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { selectAuthLoading, selectAuthError } from '../../features/auth/authSelectors';
import { clearAuthError, setMockUser, setEmailToVerify } from '../../features/auth/authSlice';
import AuthLayout from '../../components/layout/AuthLayout';
import Input from '../../components/forms/Input';
import Checkbox from '../../components/forms/Checkbox';
import Button from '../../components/common/Button';
import GoogleOAuthButton from '../../components/auth/GoogleOAuthButton';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loading = useSelector(selectAuthLoading);
  const serverError = useSelector(selectAuthError);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Password rules validation logic
  const passwordChecks = {
    length: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const passwordScore = Object.values(passwordChecks).filter(Boolean).length;
  const getStrengthLabel = () => {
    if (passwordScore === 0) return { label: 'Empty', color: 'bg-border', text: 'text-text-subtle' };
    if (passwordScore <= 2) return { label: 'Weak', color: 'bg-rose-500', text: 'text-rose-600' };
    if (passwordScore <= 4) return { label: 'Moderate', color: 'bg-amber-500', text: 'text-amber-600' };
    return { label: 'Exceptional', color: 'bg-emerald-500', text: 'text-emerald-600' };
  };

  const strength = getStrengthLabel();

  const validate = () => {
    const errs = {};

    if (!name.trim()) {
      errs.name = 'Full name is required.';
    } else if (name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters.';
    }

    if (!email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Please provide a valid email format.';
    }

    if (!password) {
      errs.password = 'Password is required.';
    } else if (passwordScore < 3) {
      errs.password = 'Password must meet minimum security criteria (at least 8 chars with mixed cases & numbers).';
    }

    if (!confirmPassword) {
      errs.confirmPassword = 'Please confirm your password.';
    } else if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    if (!agreeTerms) {
      errs.terms = 'You must accept the Terms of Service & Privacy Policy.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearAuthError());

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      // Simulate registration dispatch
      await new Promise((res) => setTimeout(res, 600));

      const newCustomer = {
        id: `cust-${Date.now()}`,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role: 'customer',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
        isEmailVerified: false,
      };

      dispatch(setMockUser(newCustomer));
      dispatch(setEmailToVerify(email.trim().toLowerCase()));

      toast.success('Registration successful! Please verify your email.');
      navigate('/verify-email');
    } catch {
      toast.error('Unable to create account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Inscribe Your Sovereign Membership"
      subtitle="Join our private circle of patrons and gain immediate access to bespoke acquisitions and direct atelier commissions."
      quote="“Craftsmanship is not merely an art form; it is an enduring covenant between master and patron.”"
      quoteAuthor="Haute Joaillerie Atelier, Paris"
    >
      <div className="space-y-6">
        {/* Title Header */}
        <div className="space-y-1 text-center sm:text-left">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-text-main">
            Create Account
          </h2>
          <p className="text-xs text-text-muted">
            Enter your details to inscribe your private membership.
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
          <GoogleOAuthButton text="Register with Google" redirectPath="/onboarding/profile" />

          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-border" />
            <span className="absolute bg-background px-3 text-[11px] font-semibold text-text-subtle uppercase tracking-wider">
              Or with credential
            </span>
          </div>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Input
            id="register-name"
            type="text"
            label="Full Name"
            placeholder="Eleanor Vance"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
            }}
            icon={User}
            error={errors.name}
            required
            autoComplete="name"
          />

          <Input
            id="register-email"
            type="email"
            label="Email Address"
            placeholder="eleanor@domain.com"
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

          {/* Password with Strength Visualizer */}
          <div className="space-y-1.5">
            <Input
              id="register-password"
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
              autoComplete="new-password"
            />

            {/* Password Strength Meter */}
            {password && (
              <div className="p-3 bg-surface-muted rounded-xl border border-border space-y-2 mt-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-text-muted font-medium">Security Strength:</span>
                  <span className={`font-bold ${strength.text}`}>{strength.label}</span>
                </div>
                {/* 5-bar meter */}
                <div className="grid grid-cols-5 gap-1.5 h-1.5 w-full">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`h-full rounded-full transition-colors duration-300 ${
                        passwordScore >= level ? strength.color : 'bg-border'
                      }`}
                    />
                  ))}
                </div>
                {/* Rule checklist */}
                <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] pt-1 text-text-muted">
                  <div className={`flex items-center gap-1.5 ${passwordChecks.length ? 'text-emerald-600 font-medium' : ''}`}>
                    <CheckCircle2 className={`w-3.5 h-3.5 ${passwordChecks.length ? 'text-emerald-500' : 'text-text-subtle'}`} />
                    <span>8+ Characters</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${passwordChecks.hasUpper && passwordChecks.hasLower ? 'text-emerald-600 font-medium' : ''}`}>
                    <CheckCircle2 className={`w-3.5 h-3.5 ${passwordChecks.hasUpper && passwordChecks.hasLower ? 'text-emerald-500' : 'text-text-subtle'}`} />
                    <span>Mixed Case</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${passwordChecks.hasNumber ? 'text-emerald-600 font-medium' : ''}`}>
                    <CheckCircle2 className={`w-3.5 h-3.5 ${passwordChecks.hasNumber ? 'text-emerald-500' : 'text-text-subtle'}`} />
                    <span>Includes Number</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${passwordChecks.hasSpecial ? 'text-emerald-600 font-medium' : ''}`}>
                    <CheckCircle2 className={`w-3.5 h-3.5 ${passwordChecks.hasSpecial ? 'text-emerald-500' : 'text-text-subtle'}`} />
                    <span>Special Symbol</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Input
            id="register-confirm-password"
            type="password"
            label="Confirm Password"
            placeholder="••••••••••••"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: null }));
            }}
            icon={Lock}
            error={errors.confirmPassword}
            required
            autoComplete="new-password"
          />

          {/* Terms & Conditions Acceptance */}
          <div className="pt-1">
            <Checkbox
              id="agree-terms"
              checked={agreeTerms}
              onChange={(e) => {
                setAgreeTerms(e.target.checked);
                if (errors.terms) setErrors((prev) => ({ ...prev, terms: null }));
              }}
              label={
                <span className="text-xs text-text-muted leading-tight">
                  I agree to the{' '}
                  <Link to="/terms" className="text-text-main font-semibold hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-text-main font-semibold hover:underline">
                    Privacy Policy
                  </Link>
                </span>
              }
              error={errors.terms}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading || isSubmitting}
            rightIcon={ArrowRight}
            className="mt-4"
          >
            Create Account
          </Button>
        </form>

        {/* Login CTA */}
        <div className="pt-4 border-t border-border text-center text-xs text-text-muted">
          <span>Already hold a Zareen registry? </span>
          <Link
            to="/login"
            className="font-bold text-text-main hover:text-accent hover:underline ml-1"
          >
            Sign In Instead
          </Link>
        </div>

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-text-subtle pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-accent" />
          <span>Strict zero-knowledge client privacy protocols</span>
        </div>
      </div>
    </AuthLayout>
  );
};

export default RegisterPage;
