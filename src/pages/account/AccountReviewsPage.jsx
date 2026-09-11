import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Star,
  MessageSquare,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  ArrowRight,
  Package,
  Camera,
  ExternalLink,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import {
  selectUserReviews,
  selectEligibleReviews,
} from '../../features/reviews/reviewSelectors';
import {
  updateLocalReview,
  deleteLocalReview,
  addLocalReview,
} from '../../features/reviews/reviewSlice';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import ConfirmModal from '../../components/common/ConfirmModal';
import Input from '../../components/forms/Input';
import Textarea from '../../components/forms/Textarea';

export const AccountReviewsPage = () => {
  const dispatch = useDispatch();
  const userReviews = useSelector(selectUserReviews);
  const eligibleReviews = useSelector(selectEligibleReviews);

  const [activeTab, setActiveTab] = useState('submitted'); // 'submitted' | 'eligible'

  // Edit Review Modal State
  const [editingReview, setEditingReview] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editTitle, setEditTitle] = useState('');
  const [editComment, setEditComment] = useState('');

  // Delete Confirm Modal State
  const [deletingReviewId, setDeletingReviewId] = useState(null);

  // Write Review Modal for Eligible item
  const [eligibleItemForReview, setEligibleItemForReview] = useState(null);
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');

  // Open Edit Modal
  const handleOpenEdit = (rev) => {
    setEditingReview(rev);
    setEditRating(rev.rating);
    setEditTitle(rev.title);
    setEditComment(rev.comment);
  };

  // Save Edit Review
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editTitle.trim() || !editComment.trim()) {
      toast.error('Please complete all required fields.');
      return;
    }

    dispatch(
      updateLocalReview({
        reviewId: editingReview.id,
        updatedData: {
          rating: editRating,
          title: editTitle.trim(),
          comment: editComment.trim(),
          date: 'Edited recently',
        },
      })
    );

    setEditingReview(null);
    toast.success('Your review evaluation has been updated.');
  };

  // Confirm Delete Review
  const handleConfirmDelete = () => {
    if (!deletingReviewId) return;
    dispatch(deleteLocalReview(deletingReviewId));
    setDeletingReviewId(null);
    toast.success('Review has been removed from public registry.');
  };

  // Submit Eligible Review
  const handleSaveNewReview = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newComment.trim()) {
      toast.error('Please complete all fields.');
      return;
    }

    dispatch(
      addLocalReview({
        productId: eligibleItemForReview.productId,
        productName: eligibleItemForReview.productName,
        productImage: eligibleItemForReview.productImage,
        rating: newRating,
        title: newTitle.trim(),
        comment: newComment.trim(),
      })
    );

    setEligibleItemForReview(null);
    setNewTitle('');
    setNewComment('');
    setNewRating(5);
    toast.success('Thank you! Your verified patron review has been published.');
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="w-4 h-4 text-accent" />
            <span className="text-xs font-bold uppercase tracking-wider text-accent">
              Patron Dialogue Hub
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-text-main">
            My Product Evaluations
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Manage your published craftsmanship critiques and evaluate recently received acquisitions.
          </p>
        </div>

        {/* Navigation back to Account Dashboard */}
        <Link to="/account">
          <Button variant="outline" size="sm">
            Account Overview
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-border pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('submitted')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'submitted'
              ? 'bg-primary text-white shadow-xs'
              : 'bg-surface hover:bg-surface-muted text-text-muted border border-border'
          }`}
        >
          My Published Reviews ({userReviews.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('eligible')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'eligible'
              ? 'bg-primary text-white shadow-xs'
              : 'bg-surface hover:bg-surface-muted text-text-muted border border-border'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Eligible to Review ({eligibleReviews.length})</span>
        </button>
      </div>

      {/* TAB 1: SUBMITTED REVIEWS */}
      {activeTab === 'submitted' && (
        <div className="space-y-4">
          {userReviews.length === 0 ? (
            <div className="p-12 bg-surface rounded-3xl border border-border text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-surface-muted flex items-center justify-center mx-auto text-text-muted">
                <MessageSquare className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-base text-text-main">
                  No Reviews Published Yet
                </h3>
                <p className="text-xs text-text-muted max-w-sm mx-auto">
                  When you purchase and evaluate handcrafted creations on Zareen, your feedback will appear here.
                </p>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setActiveTab('eligible')}
              >
                Inspect Eligible Purchases
              </Button>
            </div>
          ) : (
            userReviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-surface rounded-2xl border border-border p-5 sm:p-6 space-y-4 shadow-subtle"
              >
                {/* Product Card Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        rev.productImage ||
                        'https://images.unsplash.com/photo-1544441893-675973e31985?w=120&auto=format&fit=crop&q=80'
                      }
                      alt={rev.productName || 'Product'}
                      className="w-12 h-12 rounded-xl object-cover border border-border"
                    />
                    <div>
                      <h3 className="font-serif font-bold text-sm text-text-main">
                        {rev.productName || 'Artisan Creation'}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant="success" size="xs">
                          {rev.status || 'Published'}
                        </Badge>
                        <span className="text-[11px] text-text-muted font-mono">{rev.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(rev)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold text-text-muted hover:text-text-main hover:bg-surface-muted transition-colors cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingReviewId(rev.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>

                {/* Stars and Content */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < rev.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-border'
                        }`}
                      />
                    ))}
                  </div>

                  <h4 className="font-serif font-bold text-sm text-text-main">
                    "{rev.title}"
                  </h4>
                  <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                    {rev.comment}
                  </p>

                  {rev.images && rev.images.length > 0 && (
                    <div className="flex items-center gap-2 pt-2">
                      {rev.images.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt="Review attachment"
                          className="w-14 h-14 rounded-xl object-cover border border-border"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: ELIGIBLE REVIEWS */}
      {activeTab === 'eligible' && (
        <div className="space-y-4">
          {eligibleReviews.length === 0 ? (
            <div className="p-12 bg-surface rounded-3xl border border-border text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-base text-text-main">
                  All Acquisitions Evaluated
                </h3>
                <p className="text-xs text-text-muted max-w-sm mx-auto">
                  You have reviewed all your recent sovereign acquisitions. Thank you for contributing to our atelier community.
                </p>
              </div>
              <Link to="/products">
                <Button variant="primary" size="sm">
                  Explore Curated Marketplace
                </Button>
              </Link>
            </div>
          ) : (
            eligibleReviews.map((item) => (
              <div
                key={item.id}
                className="bg-surface rounded-2xl border border-border p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-subtle"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="w-16 h-16 rounded-xl object-cover border border-border shrink-0"
                  />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-accent block">
                      {item.sellerName}
                    </span>
                    <h3 className="font-serif font-bold text-sm sm:text-base text-text-main">
                      {item.productName}
                    </h3>
                    <p className="text-xs text-text-muted mt-0.5">
                      Ordered: <span className="font-mono">{item.orderId}</span> • Purchased on {item.purchasedDate}
                    </p>
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="md"
                  leftIcon={Edit}
                  onClick={() => {
                    setEligibleItemForReview(item);
                    setNewTitle('');
                    setNewComment('');
                    setNewRating(5);
                  }}
                  className="shrink-0"
                >
                  Write Review
                </Button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Edit Review Modal */}
      <Modal
        isOpen={Boolean(editingReview)}
        onClose={() => setEditingReview(null)}
        size="md"
        title="Edit Your Patron Evaluation"
        description="Update your rating and feedback for this creation."
      >
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-text-main block mb-1">
              Rating *
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setEditRating(s)}
                  className="p-1 text-amber-500 cursor-pointer hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-6 h-6 ${
                      s <= editRating ? 'fill-amber-400 text-amber-400' : 'text-border'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-bold text-text-main ml-2">
                {editRating} of 5 Stars
              </span>
            </div>
          </div>

          <Input
            id="edit-headline"
            label="Review Headline *"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            required
          />

          <Textarea
            id="edit-comment"
            label="Review Details *"
            rows={4}
            value={editComment}
            onChange={(e) => setEditComment(e.target.value)}
            required
          />

          <div className="pt-3 border-t border-border flex items-center justify-end gap-3">
            <Button
              variant="outline"
              type="button"
              onClick={() => setEditingReview(null)}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Write Review for Eligible Purchase Modal */}
      <Modal
        isOpen={Boolean(eligibleItemForReview)}
        onClose={() => setEligibleItemForReview(null)}
        size="md"
        title="Evaluate Creation"
        description={`Share your feedback for ${eligibleItemForReview?.productName}.`}
      >
        <form onSubmit={handleSaveNewReview} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-text-main block mb-1">
              Overall Rating *
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setNewRating(s)}
                  className="p-1 text-amber-500 cursor-pointer hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-6 h-6 ${
                      s <= newRating ? 'fill-amber-400 text-amber-400' : 'text-border'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-bold text-text-main ml-2">
                {newRating} of 5 Stars
              </span>
            </div>
          </div>

          <Input
            id="eligible-title"
            label="Review Headline *"
            placeholder="e.g. Sublime craftsmanship, exquisite heirloom"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
          />

          <Textarea
            id="eligible-comment"
            label="Review Details *"
            placeholder="Detail your experience regarding material quality, artisanal finish, sizing, and packaging..."
            rows={4}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            required
          />

          <div className="pt-3 border-t border-border flex items-center justify-end gap-3">
            <Button
              variant="outline"
              type="button"
              onClick={() => setEligibleItemForReview(null)}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Publish Review
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={Boolean(deletingReviewId)}
        onClose={() => setDeletingReviewId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Review Evaluation?"
        message="Are you sure you wish to delete this review? It will be permanently removed from the public creation registry."
        confirmText="Delete Review"
        variant="danger"
      />
    </div>
  );
};

export default AccountReviewsPage;
