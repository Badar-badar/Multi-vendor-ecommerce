import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  FileEdit,
  ArrowRight,
  Store,
  Building2,
  RefreshCw,
  ShieldCheck,
  MapPin,
  Camera,
  Calendar,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { selectSellerProfile } from '../../features/seller/sellerSelectors';
import { setSellerProfile } from '../../features/seller/sellerSlice';
import { setMockUser } from '../../features/auth/authSlice';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

export const SellerApplicationStatusPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentSeller = useSelector(selectSellerProfile);

  // Status can be: 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected'
  const [status, setStatus] = useState(currentSeller?.status || 'Under Review');
  const [rejectionReason, setRejectionReason] = useState(
    currentSeller?.rejectionReason ||
      'Please upload a clearer high-resolution photograph of your physical artisan workshop and verify your street address.'
  );

  const handleSimulateApprove = () => {
    setStatus('Approved');
    dispatch(
      setSellerProfile({
        ...currentSeller,
        status: 'Approved',
        verified: true,
      })
    );
    dispatch(
      setMockUser({
        id: currentSeller?.id || 'sel-101',
        name: currentSeller?.ownerName || 'Jean-Luc Moreau',
        email: currentSeller?.email || 'seller@zareen.luxury',
        role: 'seller',
        storeName: currentSeller?.storeName || 'Atelier Maison',
        avatar:
          currentSeller?.storeLogo ||
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
        isEmailVerified: true,
      })
    );
    toast.success('Seller application accredited! Seller Studio unlocked.');
  };

  const handleSimulateReject = () => {
    setStatus('Rejected');
    dispatch(
      setSellerProfile({
        ...currentSeller,
        status: 'Rejected',
        rejectionReason: 'Please upload a clearer high-resolution photograph of your physical artisan workshop and verify your street address.',
      })
    );
    toast.error('Application status changed to: Revisions Required');
  };

  const handleSimulateUnderReview = () => {
    setStatus('Under Review');
    dispatch(
      setSellerProfile({
        ...currentSeller,
        status: 'Under Review',
      })
    );
    toast('Application set to Under Review', { icon: '⏳' });
  };

  const handleResubmit = () => {
    setStatus('Submitted');
    dispatch(
      setSellerProfile({
        ...currentSeller,
        status: 'Submitted',
      })
    );
    toast.success('Dossier updated & resubmitted for curatorial committee review.');
  };

  const workshopImg =
    currentSeller?.workshopPhoto ||
    currentSeller?.businessPhoto ||
    'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop';

  return (
    <div className="min-h-[85vh] bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Status Card */}
        <div className="bg-surface rounded-3xl border border-border p-6 sm:p-10 text-center space-y-6 shadow-subtle animate-in fade-in">
          {/* Status Icon & Header */}
          {status === 'Approved' ? (
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-2">
                <Badge variant="success" size="sm" className="mx-auto uppercase tracking-wider">
                  Accreditation Approved
                </Badge>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text-main">
                  Welcome to Zareen Studio, {currentSeller?.ownerName || 'Artisan Partner'}
                </h1>
                <p className="text-xs sm:text-sm text-text-muted max-w-md mx-auto leading-relaxed">
                  Your store dossier for <strong className="text-text-main">{currentSeller?.storeName || 'Your Atelier'}</strong> has been accredited with sovereign seller privileges.
                </p>
              </div>

              <div className="pt-2">
                <Link to="/seller/dashboard">
                  <Button variant="primary" size="lg" rightIcon={ArrowRight}>
                    Enter Seller Studio
                  </Button>
                </Link>
              </div>
            </div>
          ) : status === 'Rejected' ? (
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 border border-rose-200 dark:border-rose-800 flex items-center justify-center mx-auto shadow-sm">
                <AlertCircle className="w-9 h-9" />
              </div>

              <div className="space-y-2">
                <Badge variant="error" size="sm" className="mx-auto uppercase tracking-wider">
                  Revisions Required
                </Badge>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text-main">
                  Application Revisions Requested
                </h1>
                <p className="text-xs sm:text-sm text-text-muted max-w-md mx-auto leading-relaxed">
                  Our artisan review committee has reviewed your submission for{' '}
                  <strong className="text-text-main">{currentSeller?.storeName || 'your atelier'}</strong> and requested adjustments before accreditation.
                </p>
              </div>

              {/* Rejection Reason Card */}
              <div className="p-4 bg-rose-50/70 dark:bg-rose-950/20 rounded-2xl border border-rose-200 dark:border-rose-900/50 text-left space-y-1.5 text-xs">
                <span className="font-bold text-rose-900 dark:text-rose-300 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" /> Committee Feedback:
                </span>
                <p className="text-rose-700 dark:text-rose-400 leading-relaxed pl-5.5">{rejectionReason}</p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link to="/seller/register" className="w-full sm:w-auto">
                  <Button
                    variant="primary"
                    size="md"
                    leftIcon={FileEdit}
                    className="w-full justify-center"
                  >
                    Edit & Update Application
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  size="md"
                  leftIcon={RefreshCw}
                  onClick={handleResubmit}
                  className="w-full sm:w-auto justify-center"
                >
                  Resubmit Dossier
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-amber-50 dark:bg-amber-950/30 text-amber-600 border border-amber-200 dark:border-amber-800 flex items-center justify-center mx-auto shadow-sm">
                <Clock className="w-9 h-9" />
              </div>

              <div className="space-y-2">
                <Badge variant="warning" size="sm" className="mx-auto uppercase tracking-wider">
                  {status === 'Draft' ? 'Draft Dossier' : 'Application ' + status}
                </Badge>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text-main">
                  Application Under Concierge Review
                </h1>
                <p className="text-xs sm:text-sm text-text-muted max-w-md mx-auto leading-relaxed">
                  We are auditing your craftsmanship ethos, workshop proof, and atelier details for{' '}
                  <strong className="text-text-main">{currentSeller?.storeName || 'Your Atelier'}</strong>. Verification typically concludes in 24 to 48 hours.
                </p>
              </div>

              {/* Progress Stepper */}
              <div className="grid grid-cols-3 gap-2 pt-2">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">✓</div>
                  <span className="text-[11px] font-semibold text-text-main">Dossier Sent</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold animate-pulse">2</div>
                  <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">Curatorial Audit</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-7 h-7 rounded-full bg-surface-muted text-text-muted border border-border flex items-center justify-center text-xs font-bold">3</div>
                  <span className="text-[11px] font-medium text-text-muted">Studio Access</span>
                </div>
              </div>

              {/* Application Details Summary */}
              <div className="p-4 bg-surface-muted rounded-2xl border border-border text-left space-y-2.5 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <span className="text-text-muted flex items-center gap-1.5"><Store className="w-3.5 h-3.5" /> Store Name:</span>
                  <span className="font-bold text-text-main">
                    {currentSeller?.storeName || 'Atelier Maison'}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <span className="text-text-muted flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> Category:</span>
                  <span className="font-medium text-text-main">
                    {currentSeller?.category || 'Fine Jewelry & High Horology'}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <span className="text-text-muted flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Workshop Location:</span>
                  <span className="font-medium text-text-main">
                    {currentSeller?.city || 'Paris'}, {currentSeller?.country || 'France'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-muted flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Submitted:</span>
                  <span className="font-medium text-text-main">
                    {currentSeller?.submittedAt || 'Today'}
                  </span>
                </div>
              </div>

              {/* Workshop Photo Preview */}
              {workshopImg && (
                <div className="rounded-2xl border border-border overflow-hidden bg-surface-muted text-left">
                  <div className="px-4 py-2 border-b border-border bg-surface flex items-center gap-2 text-xs font-semibold text-text-muted">
                    <Camera className="w-3.5 h-3.5" /> Submitted Workshop Photo
                  </div>
                  <div className="relative aspect-video w-full overflow-hidden">
                    <img
                      src={workshopImg}
                      alt="Artisan Workshop"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Dev Simulation Switcher */}
          <div className="pt-6 border-t border-border space-y-2">
            <span className="text-[11px] font-bold text-text-subtle uppercase tracking-wider block">
              Application Status Simulator (Testing Sandbox)
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={handleSimulateApprove}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  status === 'Approved'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-surface-muted text-text-muted hover:text-text-main border border-border'
                }`}
              >
                Approve Seller
              </button>

              <button
                type="button"
                onClick={handleSimulateReject}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  status === 'Rejected'
                    ? 'bg-rose-600 text-white'
                    : 'bg-surface-muted text-text-muted hover:text-text-main border border-border'
                }`}
              >
                Reject / Request Info
              </button>

              <button
                type="button"
                onClick={handleSimulateUnderReview}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  status === 'Under Review' || status === 'Submitted'
                    ? 'bg-amber-600 text-white'
                    : 'bg-surface-muted text-text-muted hover:text-text-main border border-border'
                }`}
              >
                Under Review
              </button>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center">
          <Link
            to="/"
            className="text-xs font-semibold text-text-muted hover:text-text-main hover:underline"
          >
            Return to Marketplace
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SellerApplicationStatusPage;
