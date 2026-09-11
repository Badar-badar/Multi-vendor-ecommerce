import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { MailCheck, ArrowRight, RotateCw, CheckCircle2, AlertCircle, ArrowLeft, Shield } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import {
  selectAuthLoading,
  selectAuthError,
  selectEmailToVerify,
  selectCurrentUser,
} from '../../features/auth/authSelectors';
import { clearAuthError, clearVerificationState, setMockUser } from '../../features/auth/authSlice';
import AuthLayout from '../../components/layout/AuthLayout';
import Button from '../../components/common/Button';

export const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const user = useSelector(selectCurrentUser);
  const emailToVerify = useSelector(selectEmailToVerify);
  const loading = useSelector(selectAuthLoading);
  const serverError = useSelector(selectAuthError);

  const targetEmail =
    searchParams.get('email') || emailToVerify || user?.email || 'patron@domain.com';

  // 6-digit OTP input state
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);
  const [resendCountdown, setResendCountdown] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Countdown timer for resend
  useEffect(() => {
    let timer;
    if (resendCountdown > 0) {
      timer = setInterval(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCountdown]);

  // Handle individual OTP input
  const handleChange = (index, value) => {
    const cleanVal = value.replace(/[^0-9]/g, '');
    if (!cleanVal && value !== '') return;

    const newDigits = [...digits];
    newDigits[index] = cleanVal ? cleanVal.slice(-1) : '';
    setDigits(newDigits);
    setErrorMsg('');

    // Auto-advance to next input
    if (cleanVal && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (!pastedData) return;

    const newDigits = [...digits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pastedData[i] || '';
    }
    setDigits(newDigits);
    setErrorMsg('');
    const nextEmptyIndex = newDigits.findIndex((d) => !d);
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus();
    } else {
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async (e) => {
    if (e) e.preventDefault();
    dispatch(clearAuthError());

    const code = digits.join('');
    if (code.length < 6) {
      setErrorMsg('Please enter all 6 digits of your security code.');
      return;
    }

    try {
      // Simulate backend verification
      await new Promise((res) => setTimeout(res, 600));

      if (user) {
        dispatch(
          setMockUser({
            ...user,
            isEmailVerified: true,
          })
        );
      }
      dispatch(clearVerificationState());
      setIsSuccess(true);
      toast.success('Your sovereign membership is verified!');
    } catch {
      setErrorMsg('Invalid or expired verification code. Please request a new one.');
    }
  };

  const handleResend = async () => {
    if (resendCountdown > 0 || isResending) return;

    setIsResending(true);
    try {
      await new Promise((res) => setTimeout(res, 500));
      setResendCountdown(60);
      toast.success(`Fresh verification code dispatched to ${targetEmail}`);
    } catch {
      toast.error('Failed to resend code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthLayout
      title="Verify Sovereign Membership"
      subtitle="Complete two-step verification to activate your private registry privileges."
      quote="“Authenticity is validated at every frontier.”"
      quoteAuthor="Zareen Maison Assurance"
    >
      <div className="space-y-6">
        {isSuccess ? (
          <div className="text-center space-y-5 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="font-serif text-2xl font-bold text-text-main">
                Membership Verified
              </h2>
              <p className="text-xs text-text-muted leading-relaxed">
                Your email <strong className="text-text-main">{targetEmail}</strong> has been authenticated with full privileges.
              </p>
            </div>

            <div className="pt-4 space-y-3">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                rightIcon={ArrowRight}
                onClick={() => navigate('/onboarding/profile')}
              >
                Complete Profile Onboarding
              </Button>

              <Button
                variant="secondary"
                size="md"
                fullWidth
                onClick={() => navigate('/products')}
              >
                Explore Curated Marketplace
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="space-y-2 text-center sm:text-left">
              <div className="w-10 h-10 rounded-xl bg-accent/15 text-accent border border-accent/30 flex items-center justify-center mb-2 shadow-xs">
                <MailCheck className="w-5 h-5" />
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-text-main">
                Verify Your Email
              </h2>
              <p className="text-xs text-text-muted leading-relaxed">
                We have sent a 6-digit confirmation code to:
              </p>
              <div className="inline-block text-xs font-semibold text-text-main bg-surface-muted py-1 px-3 rounded-lg border border-border">
                {targetEmail}
              </div>
            </div>

            {/* Error alerts */}
            {(errorMsg || serverError) && (
              <div className="p-3 rounded-xl bg-error-light border border-rose-200 flex items-start gap-2.5 text-xs text-error-dark animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-error shrink-0 mt-0.5" />
                <span>{errorMsg || serverError}</span>
              </div>
            )}

            {/* OTP Form */}
            <form onSubmit={handleVerify} className="space-y-6">
              <div>
                <label className="text-xs font-semibold text-text-main block text-center mb-3">
                  Enter 6-Digit Verification Code
                </label>

                {/* 6 Digit Inputs */}
                <div
                  className="flex items-center justify-center gap-2 sm:gap-3"
                  onPaste={handlePaste}
                >
                  {digits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => (inputRefs.current[idx] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      aria-label={`Digit ${idx + 1}`}
                      className={`w-10 h-12 sm:w-12 sm:h-12 text-center text-lg font-bold rounded-xl border bg-surface-muted transition-all focus:outline-none ${
                        digit
                          ? 'border-primary bg-surface ring-2 ring-primary/10'
                          : 'border-border focus:border-text-main focus:bg-surface'
                      } ${errorMsg ? 'border-error ring-1 ring-error/20' : ''}`}
                    />
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
                rightIcon={ArrowRight}
              >
                Verify & Continue
              </Button>
            </form>

            {/* Resend Section */}
            <div className="pt-2 text-center space-y-2">
              <p className="text-xs text-text-muted">
                Didn&apos;t receive the code?
              </p>
              {resendCountdown > 0 ? (
                <p className="text-xs text-text-subtle font-medium">
                  Resend available in{' '}
                  <span className="text-accent font-semibold">{resendCountdown}s</span>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isResending}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:text-accent-hover hover:underline cursor-pointer disabled:opacity-50"
                >
                  <RotateCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
                  <span>Resend Code</span>
                </button>
              )}
            </div>

            {/* Footer options */}
            <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-text-muted">
              <Link
                to="/login"
                className="inline-flex items-center gap-1 hover:text-text-main hover:underline"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Sign In</span>
              </Link>

              <Link to="/register" className="hover:text-text-main hover:underline">
                Change Email Address
              </Link>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-text-subtle pt-1">
              <Shield className="w-3.5 h-3.5 text-accent" />
              <span>Token expires in 15 minutes</span>
            </div>
          </>
        )}
      </div>
    </AuthLayout>
  );
};

export default VerifyEmailPage;
