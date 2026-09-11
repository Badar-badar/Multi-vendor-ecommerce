import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, CheckCircle2, ArrowLeft, KeyRound, AlertCircle, RotateCw } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { selectAuthLoading, selectAuthError } from '../../features/auth/authSelectors';
import { clearAuthError } from '../../features/auth/authSlice';
import AuthLayout from '../../components/layout/AuthLayout';
import Input from '../../components/forms/Input';
import Button from '../../components/common/Button';

export const ForgotPasswordPage = () => {
  const dispatch = useDispatch();

  const loading = useSelector(selectAuthLoading);
  const serverError = useSelector(selectAuthError);

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isDispatched, setIsDispatched] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const validate = () => {
    if (!email.trim()) {
      setError('Email address is required.');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please provide a valid email format.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearAuthError());

    if (!validate()) return;

    try {
      // Simulate backend API dispatch
      await new Promise((res) => setTimeout(res, 600));
      setIsDispatched(true);
      toast.success('Password recovery instructions sent.');
    } catch {
      toast.error('Unable to process request. Please try again.');
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      await new Promise((res) => setTimeout(res, 500));
      toast.success(`Instructions re-sent to ${email}`);
    } catch {
      toast.error('Failed to resend. Please check your connection.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthLayout
      title="Sovereign Credential Recovery"
      subtitle="Safeguarding your private acquisitions with one-time zero-knowledge recovery keys."
      quote="“Trust is built upon ironclad discretion and unwavering integrity.”"
      quoteAuthor="Zareen Security Sentinel"
    >
      <div className="space-y-6">
        {isDispatched ? (
          <div className="text-center space-y-5 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="font-serif text-2xl font-bold text-text-main">
                Recovery Link Dispatched
              </h2>
              <p className="text-xs text-text-muted leading-relaxed">
                If an account matches <strong className="text-text-main">{email}</strong>, a secure one-time password reset link has been transmitted.
              </p>
            </div>

            <div className="p-3.5 bg-surface-muted rounded-xl border border-border text-start space-y-1.5 text-xs text-text-muted">
              <p className="font-semibold text-text-main">Next Steps:</p>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-text-subtle">
                <li>Check your inbox and spam folder.</li>
                <li>Follow the secure single-use recovery link.</li>
                <li>The link remains active for 60 minutes.</li>
              </ul>
            </div>

            <div className="pt-2 space-y-3">
              <Link to="/login" className="block">
                <Button variant="primary" size="lg" fullWidth>
                  Return to Member Sign In
                </Button>
              </Link>

              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-accent hover:text-accent-hover hover:underline cursor-pointer disabled:opacity-50"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
                <span>Didn&apos;t get the email? Resend link</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="space-y-1 text-center sm:text-left">
              <div className="w-10 h-10 rounded-xl bg-accent/15 text-accent border border-accent/30 flex items-center justify-center mb-2 shadow-xs">
                <KeyRound className="w-5 h-5" />
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-text-main">
                Forgot Password?
              </h2>
              <p className="text-xs text-text-muted leading-relaxed">
                Enter your registered email address to receive secure password recovery instructions.
              </p>
            </div>

            {/* Server Error Alert Banner */}
            {serverError && (
              <div className="p-3 rounded-xl bg-error-light border border-rose-200 flex items-start gap-2.5 text-xs text-error-dark animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-error shrink-0 mt-0.5" />
                <span>{serverError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <Input
                id="forgot-email"
                type="email"
                label="Email Address"
                placeholder="patron@domain.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                icon={Mail}
                error={error}
                required
                autoComplete="email"
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
                rightIcon={ArrowRight}
                className="mt-2"
              >
                Send Recovery Instructions
              </Button>
            </form>

            {/* Back to sign in */}
            <div className="pt-4 border-t border-border text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-text-main hover:underline"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Member Sign In</span>
              </Link>
            </div>
          </>
        )}
      </div>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
