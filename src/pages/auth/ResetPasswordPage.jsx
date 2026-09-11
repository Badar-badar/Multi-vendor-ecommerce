import React, { useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Lock, ArrowRight, CheckCircle2, AlertCircle, ArrowLeft, ShieldCheck, RefreshCw } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { selectAuthLoading, selectAuthError } from '../../features/auth/authSelectors';
import { clearAuthError } from '../../features/auth/authSlice';
import AuthLayout from '../../components/layout/AuthLayout';
import Input from '../../components/forms/Input';
import Button from '../../components/common/Button';

export const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token: routeToken } = useParams();
  const [searchParams] = useSearchParams();

  const token = routeToken || searchParams.get('token') || 'valid-reset-key';
  const emailParam = searchParams.get('email') || '';

  const loading = useSelector(selectAuthLoading);
  const serverError = useSelector(selectAuthError);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [isTokenInvalid, setIsTokenInvalid] = useState(token === 'invalid' || token === 'expired');

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

    if (!password) {
      errs.password = 'New password is required.';
    } else if (passwordScore < 3) {
      errs.password = 'Password must meet security standards (minimum 8 characters with mixed cases & numbers).';
    }

    if (!confirmPassword) {
      errs.confirmPassword = 'Please confirm your new password.';
    } else if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearAuthError());

    if (!validate()) return;

    try {
      // Simulate API password reset
      await new Promise((res) => setTimeout(res, 600));

      setIsSuccess(true);
      toast.success('Your password has been successfully updated.');
    } catch {
      toast.error('Unable to reset password. The link may have expired.');
    }
  };

  return (
    <AuthLayout
      title="Create New Sovereign Password"
      subtitle="Establish new credentials protected by TLS 1.3 encryption."
      quote="“Security is the foundation upon which luxury stands.”"
      quoteAuthor="Zareen Cryptographic Sentinel"
    >
      <div className="space-y-6">
        {isTokenInvalid ? (
          <div className="text-center space-y-5 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto shadow-xs">
              <AlertCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="font-serif text-2xl font-bold text-text-main">
                Invalid or Expired Link
              </h2>
              <p className="text-xs text-text-muted leading-relaxed">
                This password reset token is no longer valid or has already expired after its 60-minute lifetime.
              </p>
            </div>

            <div className="pt-2 space-y-3">
              <Link to="/forgot-password" className="block">
                <Button variant="primary" size="lg" fullWidth leftIcon={RefreshCw}>
                  Request a New Recovery Link
                </Button>
              </Link>

              <Link to="/login" className="block">
                <Button variant="outline" size="md" fullWidth>
                  Return to Sign In
                </Button>
              </Link>
            </div>
          </div>
        ) : isSuccess ? (
          <div className="text-center space-y-5 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="font-serif text-2xl font-bold text-text-main">
                Password Successfully Reset
              </h2>
              <p className="text-xs text-text-muted leading-relaxed">
                Your sovereign account password has been updated securely. You can now sign in with your new credentials.
              </p>
            </div>

            <div className="pt-4">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                rightIcon={ArrowRight}
                onClick={() => navigate('/login')}
              >
                Go to Sign In
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="space-y-1 text-center sm:text-left">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-text-main">
                Reset Password
              </h2>
              <p className="text-xs text-text-muted leading-relaxed">
                {emailParam ? (
                  <>
                    Updating credentials for <strong className="text-text-main">{emailParam}</strong>.
                  </>
                ) : (
                  'Please create a strong new password for your account.'
                )}
              </p>
            </div>

            {/* Server Error Alert Banner */}
            {serverError && (
              <div className="p-3 rounded-xl bg-error-light border border-rose-200 flex items-start gap-2.5 text-xs text-error-dark animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-error shrink-0 mt-0.5" />
                <span>{serverError}</span>
              </div>
            )}

            {/* Reset Form */}
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="space-y-1.5">
                <Input
                  id="reset-new-password"
                  type="password"
                  label="New Password"
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
                id="reset-confirm-password"
                type="password"
                label="Confirm New Password"
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

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
                rightIcon={ArrowRight}
                className="mt-4"
              >
                Save New Password
              </Button>
            </form>

            {/* Back to Login */}
            <div className="pt-4 border-t border-border text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-text-main hover:underline"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Member Sign In</span>
              </Link>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-text-subtle pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-accent" />
              <span>Session encrypted with TLS 1.3</span>
            </div>
          </>
        )}
      </div>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
