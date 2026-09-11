import React, { useState, useMemo } from 'react';
import {
  Star,
  CheckCircle2,
  ThumbsUp,
  MessageSquare,
  ShieldCheck,
  Send,
  Sparkles,
  Edit,
  Trash2,
  X,
  Clock,
  Filter,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import ConfirmModal from '../../components/common/ConfirmModal';

const INITIAL_SELLER_REVIEWS = [
  {
    id: 'SR-01',
    productId: 'prod-1',
    productName: 'Mulberry Silk & Wool Double-Breasted Trench',
    productImage: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=120&auto=format&fit=crop&q=80',
    patronName: 'Lady Eleanor Vance',
    patronLocation: 'Paris, France',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    rating: 5,
    title: 'Exquisite tailoring and silk weight',
    comment: 'The drape of this trench coat is unlike anything from mainstream luxury houses. The Mulberry silk blend feels substantial yet breathable, and the horn buttons add an unmistakably bespoke touch.',
    date: '2026-09-05',
    verified: true,
    helpfulCount: 24,
    images: [
      'https://images.unsplash.com/photo-1544441893-675973e31985?w=400&auto=format&fit=crop&q=80',
    ],
    sellerReply: 'Thank you Lady Eleanor. Each creation undergoes 24 hours of hand-edge finishing in our Parisian workshop. We are honored to accompany your wardrobe.',
    replyDate: '2026-09-06',
  },
  {
    id: 'SR-02',
    productId: 'prod-3',
    productName: 'Saddle Leather Weekender Duffel in Cognac',
    productImage: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=120&auto=format&fit=crop&q=80',
    patronName: 'Julian Montgomery',
    patronLocation: 'New York, USA',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    rating: 5,
    title: 'Flawless fit and finish',
    comment: 'The Tuscan full-grain leather is thick, richly scented, and developing a stunning honey patina. The brass Excella zippers glide effortlessly.',
    date: '2026-09-02',
    verified: true,
    helpfulCount: 16,
    images: [],
    sellerReply: null,
    replyDate: null,
  },
  {
    id: 'SR-03',
    productId: 'prod-2',
    productName: '18k Solstice Choker with Pavé Diamonds',
    productImage: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=120&auto=format&fit=crop&q=80',
    patronName: 'Sophie Beaumont',
    patronLocation: 'Geneva, Switzerland',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
    rating: 4,
    title: 'Stunning brilliance, slightly delayed custom clasp',
    comment: 'The diamonds sparkle with remarkable fire. The custom sizing took an extra 2 days in the studio, but well worth the wait.',
    date: '2026-08-28',
    verified: true,
    helpfulCount: 4,
    images: [],
    sellerReply: 'We are delighted you appreciate the fire of the pavé setting Sophie. We always take extra time to ensure safety clasp tension is flawless.',
    replyDate: '2026-08-29',
  },
];

export const SellerReviewsPage = () => {
  const [reviews, setReviews] = useState(INITIAL_SELLER_REVIEWS);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'unreplied' | '5star'
  const [selectedProductFilter, setSelectedProductFilter] = useState('all');

  // Reply Draft States
  const [replyTextMap, setReplyTextMap] = useState({});
  const [replyingReviewId, setReplyingReviewId] = useState(null);
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [deletingReplyReviewId, setDeletingReplyReviewId] = useState(null);

  // Statistics Calculation
  const stats = useMemo(() => {
    const total = reviews.length;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    const avg = total > 0 ? (sum / total).toFixed(2) : '5.00';
    const unrepliedCount = reviews.filter((r) => !r.sellerReply).length;

    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      distribution[r.rating] = (distribution[r.rating] || 0) + 1;
    });

    return { total, avg, unrepliedCount, distribution };
  }, [reviews]);

  // Unique Products for Product-wise filter
  const productOptions = useMemo(() => {
    const map = new Map();
    reviews.forEach((r) => {
      if (!map.has(r.productId)) {
        map.set(r.productId, r.productName);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [reviews]);

  // Filtered reviews
  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      const matchesTab =
        activeTab === 'all' ||
        (activeTab === 'unreplied' && !r.sellerReply) ||
        (activeTab === '5star' && r.rating === 5);

      const matchesProduct =
        selectedProductFilter === 'all' || r.productId === selectedProductFilter;

      return matchesTab && matchesProduct;
    });
  }, [reviews, activeTab, selectedProductFilter]);

  // Handle Publish / Update Reply
  const handleSaveReply = (reviewId) => {
    const text = replyTextMap[reviewId]?.trim();
    if (!text) {
      toast.error('Please enter your atelier response message.');
      return;
    }

    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId
          ? {
              ...r,
              sellerReply: text,
              replyDate: new Date().toISOString().split('T')[0],
            }
          : r
      )
    );

    setReplyingReviewId(null);
    setEditingReplyId(null);
    setReplyTextMap((prev) => ({ ...prev, [reviewId]: '' }));
    toast.success('Atelier dialogue response published.');
  };

  // Start Editing Existing Reply
  const handleStartEditReply = (rev) => {
    setEditingReplyId(rev.id);
    setReplyTextMap((prev) => ({ ...prev, [rev.id]: rev.sellerReply }));
  };

  // Confirm Delete Reply
  const handleConfirmDeleteReply = () => {
    if (!deletingReplyReviewId) return;

    setReviews((prev) =>
      prev.map((r) =>
        r.id === deletingReplyReviewId
          ? { ...r, sellerReply: null, replyDate: null }
          : r
      )
    );

    setDeletingReplyReviewId(null);
    toast.success('Atelier response removed.');
  };

  return (
    <>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-4 h-4 text-accent" />
              <span className="text-xs font-bold uppercase tracking-wider text-accent">
                Atelier Reputation & Sentiment
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-text-main">
              Patron Reviews & Feedback
            </h1>
            <p className="text-xs text-text-muted mt-1">
              Inspect authenticated patron evaluations and maintain sovereign dialogue with collectors.
            </p>
          </div>
        </div>

        {/* Rating Breakdown & Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-surface rounded-2xl border border-border p-5 space-y-1 shadow-subtle flex flex-col justify-center">
            <span className="text-xs text-text-muted">Master Reputation Score</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-serif font-bold text-text-main">
                {stats.avg}
              </span>
              <div className="flex items-center text-amber-500">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${
                      s <= Math.round(Number(stats.avg))
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-border'
                    }`}
                  />
                ))}
              </div>
            </div>
            <span className="text-[11px] text-emerald-600 font-medium">
              99.2% Positive Sovereign Sentiment
            </span>
          </div>

          <div className="bg-surface rounded-2xl border border-border p-5 space-y-1 shadow-subtle">
            <span className="text-xs text-text-muted">Total Verified Reviews</span>
            <p className="text-2xl font-serif font-bold text-text-main">
              {stats.total}
            </p>
            <span className="text-[11px] text-text-muted">
              Across {productOptions.length} artisan creations
            </span>
          </div>

          <div className="bg-surface rounded-2xl border border-border p-5 space-y-1 shadow-subtle">
            <span className="text-xs text-text-muted">Awaiting Atelier Reply</span>
            <p className="text-2xl font-serif font-bold text-accent">
              {stats.unrepliedCount}
            </p>
            <span className="text-[11px] text-text-muted">Patrons awaiting response</span>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-surface text-text-muted border border-border hover:bg-surface-muted hover:text-text-main'
              }`}
            >
              All Reviews ({reviews.length})
            </button>
            <button
              onClick={() => setActiveTab('unreplied')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'unreplied'
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-surface text-text-muted border border-border hover:bg-surface-muted hover:text-text-main'
              }`}
            >
              Needs Reply ({stats.unrepliedCount})
            </button>
            <button
              onClick={() => setActiveTab('5star')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === '5star'
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-surface text-text-muted border border-border hover:bg-surface-muted hover:text-text-main'
              }`}
            >
              5-Star Masterworks ({stats.distribution[5] || 0})
            </button>
          </div>

          {/* Product Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-text-subtle">Product:</span>
            <select
              value={selectedProductFilter}
              onChange={(e) => setSelectedProductFilter(e.target.value)}
              className="px-3 py-1.5 bg-surface border border-border rounded-xl text-xs font-semibold text-text-main focus:outline-none cursor-pointer"
            >
              <option value="all">All Atelier Creations</option>
              {productOptions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.length === 0 ? (
            <div className="p-8 bg-surface rounded-2xl border border-border text-center text-xs text-text-muted">
              No reviews match this filter criteria.
            </div>
          ) : (
            filteredReviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-surface rounded-2xl border border-border p-6 space-y-4 shadow-subtle hover:border-border-dark transition-colors"
              >
                {/* Product Header */}
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <div className="flex items-center gap-3">
                    <img
                      src={rev.productImage}
                      alt={rev.productName}
                      className="w-10 h-10 rounded-lg object-cover border border-border"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-text-main">{rev.productName}</h4>
                      <span className="text-[10px] text-text-subtle font-mono">
                        Review ID: {rev.id}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-amber-500">
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
                </div>

                {/* Patron & Comment */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={rev.avatar}
                        alt={rev.patronName}
                        className="w-7 h-7 rounded-full object-cover border border-border"
                      />
                      <div>
                        <p className="text-xs font-semibold text-text-main flex items-center gap-1.5">
                          {rev.patronName}
                          {rev.verified && (
                            <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-full font-semibold">
                              Verified Purchase
                            </span>
                          )}
                        </p>
                        <span className="text-[10px] text-text-subtle">
                          {rev.patronLocation} • {rev.date}
                        </span>
                      </div>
                    </div>
                  </div>

                  <h5 className="font-serif text-sm font-bold text-text-main">
                    "{rev.title}"
                  </h5>
                  <p className="text-xs text-text-muted leading-relaxed">
                    {rev.comment}
                  </p>

                  {rev.images && rev.images.length > 0 && (
                    <div className="flex items-center gap-2 pt-1">
                      {rev.images.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt="Patron attachment"
                          className="w-14 h-14 rounded-lg object-cover border border-border"
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Seller Reply Box / Existing Response */}
                {rev.sellerReply && editingReplyId !== rev.id ? (
                  <div className="bg-surface-muted/80 p-4 rounded-xl border border-border space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-accent">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Your Atelier Response</span>
                        {rev.replyDate && (
                          <span className="text-[10px] text-text-subtle font-normal">
                            ({rev.replyDate})
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleStartEditReply(rev)}
                          className="p-1 rounded text-text-muted hover:text-text-main hover:bg-surface transition-colors cursor-pointer"
                          title="Edit response"
                        >
                          <Edit className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingReplyReviewId(rev.id)}
                          className="p-1 rounded text-text-muted hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete response"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-text-muted italic leading-relaxed">
                      "{rev.sellerReply}"
                    </p>
                  </div>
                ) : replyingReviewId === rev.id || editingReplyId === rev.id ? (
                  <div className="pt-2 space-y-3 bg-surface-muted/50 p-4 rounded-xl border border-border">
                    <label className="text-xs font-semibold text-text-main block">
                      {editingReplyId === rev.id ? 'Edit Atelier Reply' : 'Compose Atelier Response'}
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Compose a courteous, bespoke reply acknowledging the patron's evaluation..."
                      value={replyTextMap[rev.id] || ''}
                      onChange={(e) =>
                        setReplyTextMap({ ...replyTextMap, [rev.id]: e.target.value })
                      }
                      className="w-full text-xs p-3 rounded-xl border border-border bg-surface focus:outline-none focus:border-text-main text-text-main resize-none"
                    />
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setReplyingReviewId(null);
                          setEditingReplyId(null);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        leftIcon={Send}
                        onClick={() => handleSaveReply(rev.id)}
                      >
                        Publish Response
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="pt-1 flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={MessageSquare}
                      onClick={() => {
                        setReplyingReviewId(rev.id);
                        setReplyTextMap((prev) => ({ ...prev, [rev.id]: '' }));
                      }}
                    >
                      Reply to Patron
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Delete Reply Confirmation Modal */}
        <ConfirmModal
          isOpen={Boolean(deletingReplyReviewId)}
          onClose={() => setDeletingReplyReviewId(null)}
          onConfirm={handleConfirmDeleteReply}
          title="Delete Atelier Response?"
          message="Are you sure you wish to delete your published response? This will remove your message from the creation page."
          confirmText="Delete Response"
          variant="danger"
        />
      </div>
    </>
  );
};

export default SellerReviewsPage;
