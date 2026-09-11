import { useState, useMemo } from 'react';
import {
  MessageSquare,
  Search,
  Star,
  CheckCircle2,
  XCircle,
  EyeOff,
  ShieldAlert,
  ShieldCheck,
  Check,
  X,
  Flag,
  Trash2,
  Filter,
  Eye,
  Calendar,
  ThumbsUp,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import ConfirmModal from '../../components/common/ConfirmModal';
import { selectAdminReviews } from '../../features/admin/adminSelectors';
import { moderateReviewLocal } from '../../features/admin/adminSlice';

export const AdminReviewsPage = () => {
  const dispatch = useDispatch();
  const reviews = useSelector(selectAdminReviews);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedRating, setSelectedRating] = useState('all');
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  // Detail Modal & Delete Confirmation
  const [activeReviewDetail, setActiveReviewDetail] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [flagModalTarget, setFlagModalTarget] = useState(null);
  const [flagReasonInput, setFlagReasonInput] = useState('Sentinel Auto-Detection: Suspicious promotional language or unauthorized competitor link.');

  // Filtering & Sorting
  const filteredReviews = useMemo(() => {
    return reviews
      .filter((r) => {
        const matchesSearch =
          r.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.comment?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
          selectedStatus === 'all' || r.status === selectedStatus;

        const matchesRating =
          selectedRating === 'all' || r.rating === Number(selectedRating);

        const matchesVerified = !onlyVerified || r.verifiedPurchase;

        return matchesSearch && matchesStatus && matchesRating && matchesVerified;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.date || 0) - new Date(a.date || 0);
        if (sortBy === 'oldest') return new Date(a.date || 0) - new Date(b.date || 0);
        if (sortBy === 'highest_rating') return b.rating - a.rating;
        if (sortBy === 'lowest_rating') return a.rating - b.rating;
        return 0;
      });
  }, [reviews, searchTerm, selectedStatus, selectedRating, onlyVerified, sortBy]);

  // Status Metrics
  const stats = useMemo(() => {
    const total = reviews.length;
    const pending = reviews.filter((r) => r.status === 'Pending').length;
    const flagged = reviews.filter((r) => r.status === 'Flagged').length;
    const approved = reviews.filter((r) => r.status === 'Approved').length;
    const hidden = reviews.filter((r) => r.status === 'Hidden').length;
    return { total, pending, flagged, approved, hidden };
  }, [reviews]);

  const handleModerate = (reviewId, actionStatus, flagReason = null) => {
    dispatch(moderateReviewLocal({ reviewId, status: actionStatus, flagReason }));
    toast.success(`Review status updated to ${actionStatus}.`);
    if (activeReviewDetail && activeReviewDetail.id === reviewId) {
      setActiveReviewDetail((prev) => ({
        ...prev,
        status: actionStatus,
        flagReason: flagReason || (actionStatus === 'Approved' ? null : prev.flagReason),
      }));
    }
  };

  const handleConfirmFlag = () => {
    if (!flagModalTarget) return;
    handleModerate(flagModalTarget.id, 'Flagged', flagReasonInput);
    setFlagModalTarget(null);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    dispatch(moderateReviewLocal({ reviewId: deleteTarget.id, status: 'Hidden' }));
    toast.success('Review permanently removed from catalog display.');
    setDeleteTarget(null);
    if (activeReviewDetail?.id === deleteTarget.id) {
      setActiveReviewDetail(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return <Badge variant="success" size="xs">Approved</Badge>;
      case 'Pending':
        return <Badge variant="warning" size="xs">Pending Review</Badge>;
      case 'Flagged':
        return <Badge variant="danger" size="xs">Flagged / Spam</Badge>;
      case 'Hidden':
        return <Badge variant="secondary" size="xs">Hidden</Badge>;
      default:
        return <Badge variant="default" size="xs">{status}</Badge>;
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block mb-1">
              Content & Trust Moderation
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
              Patron Reviews & Sentinel Moderation
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Screen authentic product feedback, filter out malicious links, and preserve sovereign brand integrity.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">
              {filteredReviews.length} / {reviews.length} Reviews
            </span>
          </div>
        </div>

        {/* Metrics Summary Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <button
            onClick={() => setSelectedStatus('all')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              selectedStatus === 'all'
                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                : 'bg-white text-slate-900 border-slate-200 hover:border-slate-300'
            }`}
          >
            <span className={`text-[10px] font-bold uppercase tracking-wider block ${selectedStatus === 'all' ? 'text-slate-300' : 'text-slate-400'}`}>
              Total Reviews
            </span>
            <span className="text-2xl font-serif font-bold mt-1 block">
              {stats.total}
            </span>
          </button>

          <button
            onClick={() => setSelectedStatus('Pending')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              selectedStatus === 'Pending'
                ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                : 'bg-white text-slate-900 border-slate-200 hover:border-slate-300'
            }`}
          >
            <span className={`text-[10px] font-bold uppercase tracking-wider block ${selectedStatus === 'Pending' ? 'text-amber-100' : 'text-amber-600'}`}>
              Pending Audit
            </span>
            <span className="text-2xl font-serif font-bold mt-1 block">
              {stats.pending}
            </span>
          </button>

          <button
            onClick={() => setSelectedStatus('Flagged')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              selectedStatus === 'Flagged'
                ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                : 'bg-white text-slate-900 border-slate-200 hover:border-slate-300'
            }`}
          >
            <span className={`text-[10px] font-bold uppercase tracking-wider block ${selectedStatus === 'Flagged' ? 'text-rose-100' : 'text-rose-600'}`}>
              Flagged / Alerts
            </span>
            <span className="text-2xl font-serif font-bold mt-1 block">
              {stats.flagged}
            </span>
          </button>

          <button
            onClick={() => setSelectedStatus('Approved')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              selectedStatus === 'Approved'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                : 'bg-white text-slate-900 border-slate-200 hover:border-slate-300'
            }`}
          >
            <span className={`text-[10px] font-bold uppercase tracking-wider block ${selectedStatus === 'Approved' ? 'text-emerald-100' : 'text-emerald-600'}`}>
              Approved Active
            </span>
            <span className="text-2xl font-serif font-bold mt-1 block">
              {stats.approved}
            </span>
          </button>
        </div>

        {/* Toolbar with multi-filtering */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex-1 max-w-sm">
              <Input
                placeholder="Search reviews by product, patron, content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={Search}
                size="sm"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              {/* Status Select */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 cursor-pointer text-xs"
              >
                <option value="all">All Moderation Statuses</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending Review</option>
                <option value="Flagged">Flagged / Sentinel Alert</option>
                <option value="Hidden">Hidden from Store</option>
              </select>

              {/* Rating Select */}
              <select
                value={selectedRating}
                onChange={(e) => setSelectedRating(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 cursor-pointer text-xs"
              >
                <option value="all">All Star Ratings</option>
                <option value="5">5 Stars ★★★★★</option>
                <option value="4">4 Stars ★★★★☆</option>
                <option value="3">3 Stars ★★★☆☆</option>
                <option value="2">2 Stars ★★☆☆☆</option>
                <option value="1">1 Star ★☆☆☆☆</option>
              </select>

              {/* Sort By Select */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 cursor-pointer text-xs"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest_rating">Highest Rated</option>
                <option value="lowest_rating">Lowest Rated</option>
              </select>

              {/* Verified Only Checkbox */}
              <label className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={onlyVerified}
                  onChange={(e) => setOnlyVerified(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500 w-3.5 h-3.5"
                />
                <span>Verified Only</span>
              </label>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.length === 0 ? (
            <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center space-y-2">
              <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="font-serif font-bold text-slate-800 text-sm">
                No Patron Reviews Found
              </p>
              <p className="text-xs text-slate-500">
                Try adjusting your search criteria or resetting filters.
              </p>
            </div>
          ) : (
            filteredReviews.map((r) => (
              <div
                key={r.id}
                className={`p-5 rounded-2xl bg-white border transition-all ${
                  r.status === 'Flagged'
                    ? 'border-rose-300 bg-rose-50/20'
                    : r.status === 'Pending'
                    ? 'border-amber-200 bg-amber-50/10'
                    : 'border-slate-200/80 shadow-xs'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < r.rating
                                ? 'text-amber-500 fill-amber-500'
                                : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                      <h4 className="font-bold text-xs text-slate-900 font-serif">
                        {r.title || 'Product Evaluation'}
                      </h4>
                      {getStatusBadge(r.status)}
                      {r.verifiedPurchase && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <ShieldCheck className="w-3 h-3" /> Verified Purchase
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-500 mt-1">
                      Product: <strong className="text-slate-800">{r.productName}</strong> ({r.productBrand || r.sellerName || 'Maison Atelier'}) · Patron: <span className="font-semibold text-slate-700">{r.customerName}</span> · {r.date}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 self-end sm:self-center">
                    <button
                      onClick={() => setActiveReviewDetail(r)}
                      className="px-2.5 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-200 flex items-center gap-1 cursor-pointer transition-colors"
                      title="Inspect Details"
                    >
                      <Eye className="w-3.5 h-3.5" /> Inspect
                    </button>

                    {r.status !== 'Approved' && (
                      <button
                        onClick={() => handleModerate(r.id, 'Approved')}
                        className="px-2.5 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-semibold hover:bg-emerald-100 flex items-center gap-1 cursor-pointer transition-colors"
                        title="Approve Review"
                      >
                        <Check className="w-3.5 h-3.5" /> Approve
                      </button>
                    )}

                    {r.status !== 'Flagged' && (
                      <button
                        onClick={() => {
                          setFlagModalTarget(r);
                          setFlagReasonInput(r.flagReason || 'Sentinel Auto-Detection: Suspicious content or off-platform promotional reference.');
                        }}
                        className="px-2.5 py-1.5 bg-rose-50 text-rose-700 rounded-lg text-xs font-semibold hover:bg-rose-100 flex items-center gap-1 cursor-pointer transition-colors"
                        title="Flag / Sentinel Alert"
                      >
                        <Flag className="w-3.5 h-3.5" /> Flag
                      </button>
                    )}

                    {r.status !== 'Hidden' && (
                      <button
                        onClick={() => handleModerate(r.id, 'Hidden')}
                        className="px-2.5 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-200 flex items-center gap-1 cursor-pointer transition-colors"
                        title="Hide from Storefront"
                      >
                        <EyeOff className="w-3.5 h-3.5" /> Hide
                      </button>
                    )}

                    <button
                      onClick={() => setDeleteTarget(r)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer transition-colors"
                      title="Delete Review"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="pt-3 text-xs text-slate-700 space-y-2">
                  <p className="leading-relaxed">{r.comment}</p>

                  {/* Review Images if any */}
                  {r.images && r.images.length > 0 && (
                    <div className="flex items-center gap-2 pt-1">
                      {r.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt="Review attachment"
                          className="w-14 h-14 object-cover rounded-lg border border-slate-200 hover:scale-105 transition-transform cursor-pointer"
                          onClick={() => setActiveReviewDetail(r)}
                        />
                      ))}
                    </div>
                  )}

                  {r.flagReason && (
                    <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 flex items-center gap-2.5 text-[11px] text-rose-800 font-medium">
                      <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>Sentinel Alert: {r.flagReason}</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Detailed Inspection Modal */}
        {activeReviewDetail && (
          <Modal
            isOpen={Boolean(activeReviewDetail)}
            onClose={() => setActiveReviewDetail(null)}
            title="Patron Review Inspection & Audit"
            size="lg"
          >
            <div className="space-y-4 text-xs">
              <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                    Target Acquisition
                  </span>
                  <h4 className="font-serif font-bold text-slate-900 text-sm">
                    {activeReviewDetail.productName}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Artisan Atelier: {activeReviewDetail.productBrand || activeReviewDetail.sellerName || 'Verified Maison'}
                  </p>
                </div>
                <div>{getStatusBadge(activeReviewDetail.status)}</div>
              </div>

              {/* Reviewer Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-white rounded-xl border border-slate-200 text-[11px]">
                <div>
                  <span className="text-slate-400 block">Patron:</span>
                  <strong className="text-slate-900">{activeReviewDetail.customerName}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Date Submitted:</span>
                  <span className="font-mono text-slate-700">{activeReviewDetail.date}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Verification:</span>
                  <span className={activeReviewDetail.verifiedPurchase ? 'text-emerald-700 font-bold' : 'text-slate-500'}>
                    {activeReviewDetail.verifiedPurchase ? 'Verified Purchase' : 'Unverified Submission'}
                  </span>
                </div>
              </div>

              {/* Rating & Content */}
              <div className="space-y-2 p-4 rounded-xl border border-slate-200 bg-white">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < activeReviewDetail.rating
                          ? 'text-amber-500 fill-amber-500'
                          : 'text-slate-200'
                      }`}
                    />
                  ))}
                  <span className="font-bold text-slate-900 ml-2">
                    {activeReviewDetail.rating}.0 / 5.0
                  </span>
                </div>

                <h3 className="font-serif font-bold text-slate-900 text-sm pt-1">
                  {activeReviewDetail.title || 'Product Evaluation'}
                </h3>

                <p className="text-slate-700 leading-relaxed pt-1">
                  {activeReviewDetail.comment}
                </p>

                {activeReviewDetail.images && activeReviewDetail.images.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">
                      Attached Media Artifacts
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {activeReviewDetail.images.map((img, idx) => (
                        <a key={idx} href={img} target="_blank" rel="noreferrer">
                          <img
                            src={img}
                            alt="Attached artifact"
                            className="w-20 h-20 object-cover rounded-xl border border-slate-200 hover:opacity-90"
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Moderation Controls inside Modal */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <Button
                    variant={activeReviewDetail.status === 'Approved' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => handleModerate(activeReviewDetail.id, 'Approved')}
                    leftIcon={Check}
                  >
                    Approve
                  </Button>
                  <Button
                    variant={activeReviewDetail.status === 'Flagged' ? 'danger' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setFlagModalTarget(activeReviewDetail);
                      setFlagReasonInput(activeReviewDetail.flagReason || 'Sentinel Auto-Detection: Suspicious promotional content.');
                    }}
                    leftIcon={Flag}
                  >
                    Flag / Sentinel
                  </Button>
                  <Button
                    variant={activeReviewDetail.status === 'Hidden' ? 'secondary' : 'outline'}
                    size="sm"
                    onClick={() => handleModerate(activeReviewDetail.id, 'Hidden')}
                    leftIcon={EyeOff}
                  >
                    Hide
                  </Button>
                </div>

                <Button variant="outline" size="sm" onClick={() => setActiveReviewDetail(null)}>
                  Close
                </Button>
              </div>
            </div>
          </Modal>
        )}

        {/* Flag Reason Modal */}
        {flagModalTarget && (
          <Modal
            isOpen={Boolean(flagModalTarget)}
            onClose={() => setFlagModalTarget(null)}
            title="Flag Review as Suspicious / Spam"
            size="sm"
          >
            <div className="space-y-4 text-xs">
              <p className="text-slate-600">
                Specify the Sentinel audit rationale for flagging review #{flagModalTarget.id} by patron &ldquo;{flagModalTarget.customerName}&rdquo;.
              </p>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Reason for Flagging *
                </label>
                <textarea
                  value={flagReasonInput}
                  onChange={(e) => setFlagReasonInput(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-900 text-xs h-24"
                  placeholder="e.g. Inappropriate language, off-platform solicitations, suspected fraudulent bot entry..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <Button variant="outline" size="sm" onClick={() => setFlagModalTarget(null)}>
                  Cancel
                </Button>
                <Button variant="danger" size="sm" onClick={handleConfirmFlag}>
                  Confirm Flag
                </Button>
              </div>
            </div>
          </Modal>
        )}

        {/* Delete Confirmation Modal */}
        <ConfirmModal
          isOpen={Boolean(deleteTarget)}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleConfirmDelete}
          title="Remove Patron Review?"
          message={`Are you sure you wish to unmount the review from patron "${deleteTarget?.customerName}" on product "${deleteTarget?.productName}"? This action will hide the review from public catalog presentation.`}
          confirmText="Remove Review"
          variant="danger"
        />
      </div>
    </>
  );
};

export default AdminReviewsPage;
