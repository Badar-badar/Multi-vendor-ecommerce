import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Star,
  CheckCircle2,
  ThumbsUp,
  MessageSquarePlus,
  Camera,
  UploadCloud,
  X,
  ShieldCheck,
  Flag,
  ArrowUpDown,
  Image as ImageIcon,
  LogIn,
  AlertCircle,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';
import {
  selectFilteredAndSortedReviews,
  selectProductReviewStats,
  selectVotedReviews,
  selectReportedReviews,
} from '../../features/reviews/reviewSelectors';
import {
  setFilterRating,
  setSortBy,
  addLocalReview,
  markReviewHelpfulLocal,
  reportReviewLocal,
} from '../../features/reviews/reviewSlice';
import Button from '../common/Button';
import Modal from '../common/Modal';
import Input from '../forms/Input';
import Textarea from '../forms/Textarea';

const REPORT_REASONS = [
  'Inappropriate or offensive content',
  'Spam, advertising, or commercial solicitation',
  'Fake or misleading evaluation',
  'Violates patron confidentiality',
  'Other violation of Zareen Sovereign Standards',
];

export const ProductReviewsSection = ({ productId = 'prod-1', productName = 'Artisan Creation' }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useAuth();

  // Redux Selectors
  const reviews = useSelector(selectFilteredAndSortedReviews(productId));
  const stats = useSelector(selectProductReviewStats(productId));
  const votedReviews = useSelector(selectVotedReviews);
  const reportedReviews = useSelector(selectReportedReviews);

  // Filter & Sort State
  const [activeFilter, setActiveFilterState] = useState('all');
  const [activeSort, setActiveSortState] = useState('relevant');

  // Modals State
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [isAuthPromptOpen, setIsAuthPromptOpen] = useState(false);
  const [reportingReviewId, setReportingReviewId] = useState(null);
  const [reportReason, setReportReason] = useState(REPORT_REASONS[0]);
  const [selectedPhotoModal, setSelectedPhotoModal] = useState(null);

  // Review Form State
  const [formRating, setFormRating] = useState(5);
  const [formHoverRating, setFormHoverRating] = useState(0);
  const [formTitle, setFormTitle] = useState('');
  const [formComment, setFormComment] = useState('');
  const [uploadedImages, setUploadedImages] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle Filter Change
  const handleFilterChange = (filterVal) => {
    setActiveFilterState(filterVal);
    dispatch(setFilterRating(filterVal));
  };

  // Handle Sort Change
  const handleSortChange = (sortVal) => {
    setActiveSortState(sortVal);
    dispatch(setSortBy(sortVal));
  };

  // Open Write Review Modal with Authentication Check
  const handleOpenWriteReview = () => {
    if (!isAuthenticated) {
      setIsAuthPromptOpen(true);
      return;
    }
    setIsWriteModalOpen(true);
  };

  // Helpful Vote
  const handleHelpfulVote = (reviewId) => {
    if (votedReviews[reviewId]) return;
    dispatch(markReviewHelpfulLocal(reviewId));
    toast.success('Thank you for acknowledging this patron evaluation.');
  };

  // Report Review Submit
  const handleReportSubmit = (e) => {
    e.preventDefault();
    if (!reportingReviewId) return;

    dispatch(reportReviewLocal({ reviewId: reportingReviewId, reason: reportReason }));
    setReportingReviewId(null);
    toast.success('Review has been flagged for Sentinel moderation audit.');
  };

  // Image Upload Simulation
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (uploadedImages.length + files.length > 3) {
      toast.error('You may attach a maximum of 3 patron photographs.');
      return;
    }

    const sampleImages = [
      'https://images.unsplash.com/photo-1544441893-675973e31985?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
    ];

    const newImgs = files.map((f, i) => sampleImages[i % sampleImages.length]);
    setUploadedImages((prev) => [...prev, ...newImgs].slice(0, 3));
    toast.success(`${files.length} photo(s) attached.`);
  };

  const handleRemoveImage = (index) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Validate and Submit Review
  const validateForm = () => {
    const errs = {};
    if (!formTitle.trim()) {
      errs.title = 'Review headline is required.';
    } else if (formTitle.trim().length < 4) {
      errs.title = 'Headline must be at least 4 characters.';
    }

    if (!formComment.trim()) {
      errs.comment = 'Review feedback is required.';
    } else if (formComment.trim().length < 15) {
      errs.comment = 'Please provide at least 15 characters of craftsmanship feedback.';
    }

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await new Promise((res) => setTimeout(res, 600));

      const newReviewPayload = {
        productId,
        author: user?.name || 'Verified Patron',
        location: user?.city ? `${user.city}, ${user?.country || 'USA'}` : 'Verified Collector',
        avatar:
          user?.avatar ||
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
        rating: formRating,
        title: formTitle.trim(),
        comment: formComment.trim(),
        images: uploadedImages,
      };

      dispatch(addLocalReview(newReviewPayload));
      setIsWriteModalOpen(false);
      toast.success('Your authenticated review has been published.');

      // Reset form
      setFormTitle('');
      setFormComment('');
      setFormRating(5);
      setUploadedImages([]);
      setFormErrors({});
    } catch {
      toast.error('Failed to submit review.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="reviews-section" className="space-y-8 pt-6">
      {/* 1. Rating Summary Breakdown & Call to Action */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-8 bg-surface rounded-3xl border border-border shadow-subtle">
        {/* Left Score Column */}
        <div className="lg:col-span-4 flex flex-col justify-center items-center text-center sm:border-r border-border/80 sm:pr-8">
          <span className="font-serif text-5xl sm:text-6xl font-bold text-text-main">
            {stats.avg}
          </span>
          <div className="flex items-center gap-1 text-amber-500 my-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-5 h-5 ${
                  s <= Math.round(Number(stats.avg))
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-border'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-text-muted">
            Based on {stats.total} verified patron reviews
          </p>
          <div className="mt-4 pt-4 border-t border-border/60 w-full flex justify-center">
            <Button
              variant="primary"
              size="md"
              leftIcon={MessageSquarePlus}
              onClick={handleOpenWriteReview}
            >
              Write a Review
            </Button>
          </div>
        </div>

        {/* Right Rating Distribution Bars */}
        <div className="lg:col-span-8 flex flex-col justify-center space-y-2.5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-text-main">
              Rating Distribution
            </span>
            <span className="text-xs text-text-muted font-mono">{stats.total} Total Ratings</span>
          </div>

          {[5, 4, 3, 2, 1].map((starVal) => {
            const count = stats.distribution[starVal] || 0;
            const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
            return (
              <button
                key={starVal}
                type="button"
                onClick={() => handleFilterChange(String(starVal))}
                className="flex items-center gap-3 text-xs text-text-muted hover:text-text-main transition-colors group cursor-pointer text-left"
              >
                <span className="w-14 font-medium flex items-center gap-1 shrink-0">
                  {starVal} <Star className="w-3 h-3 fill-amber-400 text-amber-400 inline" />
                </span>
                <div className="flex-1 h-2 bg-surface-muted rounded-full overflow-hidden border border-border">
                  <div
                    className="h-full bg-accent rounded-full transition-all duration-500 group-hover:bg-accent-hover"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-16 text-right font-mono text-[11px] text-text-subtle group-hover:text-text-main">
                  {count} ({pct}%)
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Filter & Sort Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        {/* Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-semibold text-text-subtle mr-1 shrink-0">Filter:</span>
          {[
            { id: 'all', label: `All (${stats.total})` },
            { id: '5', label: `5 ★ (${stats.distribution[5] || 0})` },
            { id: '4', label: `4 ★ (${stats.distribution[4] || 0})` },
            { id: '3', label: `3 ★ (${stats.distribution[3] || 0})` },
            { id: '2', label: `2 ★ (${stats.distribution[2] || 0})` },
            { id: '1', label: `1 ★ (${stats.distribution[1] || 0})` },
            { id: 'photos', label: 'With Photos', icon: Camera },
          ].map((f) => {
            const Icon = f.icon;
            const isSelected = activeFilter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => handleFilterChange(f.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-surface hover:bg-surface-muted border border-border text-text-muted hover:text-text-main'
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                <span>{f.label}</span>
              </button>
            );
          })}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          <ArrowUpDown className="w-3.5 h-3.5 text-text-subtle" />
          <span className="text-xs font-semibold text-text-subtle">Sort:</span>
          <select
            value={activeSort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="px-3 py-1.5 bg-surface border border-border rounded-xl text-xs font-semibold text-text-main focus:outline-none focus:border-text-main cursor-pointer"
          >
            <option value="relevant">Most Relevant</option>
            <option value="newest">Newest First</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
          </select>
        </div>
      </div>

      {/* 3. Reviews Feed */}
      <div className="space-y-4">
        {reviews.length > 0 ? (
          reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-surface rounded-2xl border border-border p-5 sm:p-6 space-y-4 shadow-subtle hover:border-border-dark transition-colors"
            >
              {/* Review Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <img
                    src={rev.avatar}
                    alt={rev.author}
                    className="w-10 h-10 rounded-full object-cover border border-border"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-text-main">{rev.author}</h4>
                      {rev.verified && (
                        <span className="flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified Purchase
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-text-muted">{rev.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <div className="flex items-center text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-border'
                        }`}
                      />
                    ))}
                  </div>
                  <span>•</span>
                  <span className="font-mono text-[11px]">{rev.date}</span>
                </div>
              </div>

              {/* Title & Comment */}
              <div>
                <h5 className="font-serif text-sm sm:text-base font-bold text-text-main mb-1.5">
                  "{rev.title}"
                </h5>
                <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                  {rev.comment}
                </p>
              </div>

              {/* Review Photographs */}
              {rev.images && rev.images.length > 0 && (
                <div className="flex items-center gap-2.5 pt-1">
                  {rev.images.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedPhotoModal(imgUrl)}
                      className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-border bg-surface-muted group cursor-zoom-in"
                    >
                      <img
                        src={imgUrl}
                        alt={`Review photo ${idx + 1}`}
                        className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-300"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Seller Atelier Reply if any */}
              {rev.sellerReply && (
                <div className="bg-surface-muted p-4 rounded-xl border border-border space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-accent">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Response from Atelier Maison</span>
                  </div>
                  <p className="text-xs text-text-muted italic leading-relaxed">
                    "{rev.sellerReply}"
                  </p>
                </div>
              )}

              {/* Helpful & Report Actions */}
              <div className="pt-2 flex items-center justify-between text-xs text-text-subtle border-t border-border/60">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => handleHelpfulVote(rev.id)}
                    disabled={votedReviews[rev.id]}
                    className={`flex items-center gap-1.5 text-xs transition-colors cursor-pointer ${
                      votedReviews[rev.id]
                        ? 'text-accent font-semibold'
                        : 'hover:text-text-main'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>
                      Helpful ({rev.helpfulCount || 0})
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setReportingReviewId(rev.id)}
                    disabled={reportedReviews[rev.id]}
                    className={`flex items-center gap-1 text-[11px] transition-colors cursor-pointer ${
                      reportedReviews[rev.id]
                        ? 'text-rose-600 font-semibold'
                        : 'hover:text-rose-600'
                    }`}
                  >
                    <Flag className="w-3 h-3" />
                    <span>{reportedReviews[rev.id] ? 'Reported' : 'Report'}</span>
                  </button>
                </div>

                <span className="text-[10px] text-text-subtle flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-accent" /> Authenticated Evaluation
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="p-10 text-center bg-surface rounded-2xl border border-border space-y-2">
            <p className="font-serif font-bold text-sm text-text-main">
              No evaluations found
            </p>
            <p className="text-xs text-text-muted">
              No reviews match the selected filter criteria. Try selecting "All Reviews".
            </p>
          </div>
        )}
      </div>

      {/* 4. Write a Review Modal */}
      <Modal
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        size="md"
        title="Share Your Patron Experience"
        description={`Your evaluation will be verified and published for ${productName}.`}
      >
        <form onSubmit={handleReviewSubmit} className="space-y-4" noValidate>
          {/* Star Rating Picker */}
          <div>
            <label className="text-xs font-semibold text-text-main block mb-1">
              Overall Rating *
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setFormHoverRating(star)}
                  onMouseLeave={() => setFormHoverRating(0)}
                  onClick={() => setFormRating(star)}
                  className="p-1 text-amber-500 hover:scale-110 transition-transform cursor-pointer"
                  aria-label={`${star} Stars`}
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= (formHoverRating || formRating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-border'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-bold text-text-main ml-2">
                {formRating} of 5 Stars
              </span>
            </div>
          </div>

          <Input
            id="review-headline"
            label="Review Headline *"
            placeholder="e.g. Masterful finish, extraordinary silk drape..."
            value={formTitle}
            onChange={(e) => {
              setFormTitle(e.target.value);
              if (formErrors.title) setFormErrors((prev) => ({ ...prev, title: null }));
            }}
            error={formErrors.title}
            required
          />

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-text-main">
                Review Details *
              </label>
              <span className="text-[11px] font-mono text-text-subtle">
                {formComment.length} / 1000
              </span>
            </div>
            <textarea
              rows={4}
              maxLength={1000}
              placeholder="Detail your experience regarding material quality, artisanal finish, sizing, and packaging..."
              value={formComment}
              onChange={(e) => {
                setFormComment(e.target.value);
                if (formErrors.comment) setFormErrors((prev) => ({ ...prev, comment: null }));
              }}
              className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-surface border rounded-xl focus:outline-none focus:border-text-main text-text-main resize-none ${
                formErrors.comment ? 'border-error' : 'border-border'
              }`}
            />
            {formErrors.comment && (
              <p className="text-[11px] text-error mt-1">{formErrors.comment}</p>
            )}
          </div>

          {/* Upload Photos UI */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-text-main block">
              Attach Patron Photographs (Optional, up to 3)
            </label>
            <div className="flex items-center gap-3">
              {uploadedImages.length < 3 && (
                <label className="flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed border-border hover:border-accent bg-surface-muted text-xs text-text-muted hover:text-text-main transition-colors cursor-pointer">
                  <UploadCloud className="w-4 h-4 text-accent" />
                  <span>Upload Photos</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}

              {uploadedImages.map((url, i) => (
                <div
                  key={i}
                  className="relative w-12 h-12 rounded-xl overflow-hidden border border-border"
                >
                  <img src={url} alt="Uploaded thumbnail" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    className="absolute top-0.5 right-0.5 p-0.5 bg-black/70 text-white rounded-full hover:bg-rose-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-border flex items-center justify-end gap-3">
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsWriteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" loading={isSubmitting}>
              Publish Review
            </Button>
          </div>
        </form>
      </Modal>

      {/* 5. Unauthenticated Prompt Modal */}
      <Modal
        isOpen={isAuthPromptOpen}
        onClose={() => setIsAuthPromptOpen(false)}
        size="sm"
        title="Sign In to Review"
        description="Only authenticated Zareen patrons with verified acquisitions may submit reviews."
      >
        <div className="space-y-4 text-center py-2">
          <div className="w-12 h-12 rounded-2xl bg-accent-light text-accent flex items-center justify-center mx-auto border border-accent/20">
            <LogIn className="w-6 h-6" />
          </div>

          <p className="text-xs text-text-muted leading-relaxed">
            Please log in to your sovereign registry to share your feedback for this creation.
          </p>

          <div className="pt-2 flex flex-col gap-2">
            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={() => {
                setIsAuthPromptOpen(false);
                navigate('/login', { state: { from: window.location } });
              }}
            >
              Sign In to Account
            </Button>
            <Button
              variant="outline"
              size="md"
              fullWidth
              onClick={() => setIsAuthPromptOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* 6. Report Review Modal */}
      <Modal
        isOpen={Boolean(reportingReviewId)}
        onClose={() => setReportingReviewId(null)}
        size="md"
        title="Flag Review for Moderation"
        description="Help the Zareen Sentinel preserve sovereign authenticity and community trust."
      >
        <form onSubmit={handleReportSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-text-main block mb-2">
              Reason for Report *
            </label>
            <div className="space-y-2">
              {REPORT_REASONS.map((r) => (
                <label
                  key={r}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                    reportReason === r
                      ? 'bg-accent-light/50 border-accent text-text-main font-semibold'
                      : 'bg-surface border-border text-text-muted hover:bg-surface-muted'
                  }`}
                >
                  <input
                    type="radio"
                    name="reportReason"
                    value={r}
                    checked={reportReason === r}
                    onChange={() => setReportReason(r)}
                    className="accent-accent"
                  />
                  <span>{r}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-border flex items-center justify-end gap-3">
            <Button
              variant="outline"
              type="button"
              onClick={() => setReportingReviewId(null)}
            >
              Cancel
            </Button>
            <Button variant="danger" type="submit">
              Submit Report
            </Button>
          </div>
        </form>
      </Modal>

      {/* 7. Image Lightbox Modal */}
      <Modal
        isOpen={Boolean(selectedPhotoModal)}
        onClose={() => setSelectedPhotoModal(null)}
        size="lg"
        title="Patron Creation Photograph"
      >
        {selectedPhotoModal && (
          <div className="aspect-square sm:aspect-4/3 w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center">
            <img
              src={selectedPhotoModal}
              alt="High-resolution patron photograph"
              className="max-h-full max-w-full object-contain"
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ProductReviewsSection;
