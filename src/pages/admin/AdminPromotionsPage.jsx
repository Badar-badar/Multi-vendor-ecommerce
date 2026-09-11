import { useState, useMemo } from 'react';
import {
  Megaphone,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Eye,
  Sparkles,
  ExternalLink,
  Image,
  Search,
  CheckCircle,
  Clock,
  PowerOff,
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Input from '../../components/common/Input';
import ConfirmModal from '../../components/common/ConfirmModal';
import { selectAdminPromotions } from '../../features/admin/adminSelectors';
import {
  addPromotionLocal,
  updatePromotionLocal,
  deletePromotionLocal,
} from '../../features/admin/adminSlice';

export const AdminPromotionsPage = () => {
  const dispatch = useDispatch();
  const promotions = useSelector(selectAdminPromotions);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editingPromotion, setEditingPromotion] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    type: 'Hero Banner',
    target: 'Haute Horlogerie',
    featuredProductsCount: 8,
    featuredSellersCount: 2,
    startDate: '2026-09-15',
    endDate: '2026-10-15',
    status: 'Scheduled',
    bannerImage: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80',
  });

  const filteredPromotions = useMemo(() => {
    return promotions.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.target?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        selectedStatus === 'all' || p.status === selectedStatus;

      const matchesType =
        selectedType === 'all' || p.type === selectedType;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [promotions, searchTerm, selectedStatus, selectedType]);

  const openCreateModal = () => {
    setEditingPromotion(null);
    setFormData({
      title: '',
      type: 'Hero Banner',
      target: 'Jewelry & Watches',
      featuredProductsCount: 6,
      featuredSellersCount: 2,
      startDate: new Date().toISOString().slice(0, 10),
      endDate: '2026-10-31',
      status: 'Active',
      bannerImage: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop&q=80',
    });
    setModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditingPromotion(p);
    setFormData({
      title: p.title,
      type: p.type || 'Hero Banner',
      target: p.target || '',
      featuredProductsCount: p.featuredProductsCount || 4,
      featuredSellersCount: p.featuredSellersCount || 1,
      startDate: p.startDate || '',
      endDate: p.endDate || '',
      status: p.status || 'Active',
      bannerImage: p.bannerImage || '',
    });
    setModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.title) {
      toast.error('Promotion campaign title is required');
      return;
    }

    if (editingPromotion) {
      dispatch(
        updatePromotionLocal({
          id: editingPromotion.id,
          ...formData,
        })
      );
      toast.success('Campaign updated successfully.');
    } else {
      const newPromo = {
        id: `PRM-${Date.now().toString().slice(-3)}`,
        ...formData,
        impressions: 0,
        clicks: 0,
      };
      dispatch(addPromotionLocal(newPromo));
      toast.success('Marketing campaign scheduled.');
    }
    setModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    dispatch(deletePromotionLocal(deleteTarget.id));
    toast.success(`Campaign "${deleteTarget.title}" removed.`);
    setDeleteTarget(null);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return <Badge variant="success" size="xs">Active</Badge>;
      case 'Scheduled':
        return <Badge variant="info" size="xs">Scheduled</Badge>;
      case 'Draft':
        return <Badge variant="warning" size="xs">Draft</Badge>;
      case 'Ended':
      case 'Expired':
        return <Badge variant="secondary" size="xs">Ended</Badge>;
      case 'Disabled':
        return <Badge variant="danger" size="xs">Disabled</Badge>;
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
              Storefront Curations
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
              Promotions & Featured Campaigns
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Control marketplace hero banners, seasonal spotlights, and featured artisan curations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="primary" size="sm" leftIcon={Plus} onClick={openCreateModal}>
              New Campaign
            </Button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex-1 max-w-sm">
            <Input
              placeholder="Search campaigns by title or target..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={Search}
              size="sm"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 cursor-pointer text-xs"
            >
              <option value="all">All Campaign Statuses</option>
              <option value="Active">Active</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Draft">Draft</option>
              <option value="Ended">Ended / Expired</option>
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 cursor-pointer text-xs"
            >
              <option value="all">All Placement Types</option>
              <option value="Hero Banner">Hero Banner</option>
              <option value="Featured Collection">Featured Collection</option>
              <option value="Spotlight Atelier">Spotlight Atelier</option>
            </select>

            <span className="text-xs font-semibold text-slate-500 ml-2">
              {filteredPromotions.length} Campaigns
            </span>
          </div>
        </div>

        {/* Promotions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPromotions.length === 0 ? (
            <div className="col-span-full p-12 bg-white rounded-2xl border border-slate-200 text-center space-y-2">
              <Megaphone className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="font-serif font-bold text-slate-800 text-sm">
                No Marketing Campaigns Found
              </p>
              <p className="text-xs text-slate-500">
                Adjust search criteria or create a new campaign banner above.
              </p>
            </div>
          ) : (
            filteredPromotions.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between group hover:border-slate-300 transition-all"
              >
                <div>
                  <div className="relative h-44 bg-slate-900 overflow-hidden">
                    <img
                      src={p.bannerImage}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    <div className="absolute top-3 right-3">
                      {getStatusBadge(p.status)}
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300 block">
                        {p.type}
                      </span>
                      <h3 className="font-serif font-bold text-base line-clamp-1 drop-shadow-sm">
                        {p.title}
                      </h3>
                    </div>
                  </div>

                  <div className="p-4 space-y-3 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Target Curation:</span>
                      <strong className="text-slate-900">{p.target}</strong>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Featured Items:</span>
                      <span className="font-semibold text-slate-800">
                        {p.featuredProductsCount} Products · {p.featuredSellersCount} Sellers
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Run Dates:</span>
                      <span className="font-mono text-[11px] text-slate-500">
                        {p.startDate} → {p.endDate}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-center">
                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-[10px] text-slate-400 block font-medium">Impressions</span>
                        <strong className="text-slate-900 font-bold">
                          {(p.impressions || 0).toLocaleString()}
                        </strong>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-[10px] text-slate-400 block font-medium">Clicks</span>
                        <strong className="text-amber-800 font-bold">
                          {(p.clicks || 0).toLocaleString()}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 flex justify-end gap-2 border-t border-slate-100 pt-3">
                  <button
                    onClick={() => openEditModal(p)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
                    title="Edit Campaign"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(p)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                    title="Delete Campaign"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-150 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-serif font-bold text-slate-900 text-base">
                  {editingPromotion ? 'Edit Campaign' : 'Create Promotional Campaign'}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-900 cursor-pointer font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Campaign Title *
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Autumn Haute Horlogerie Showcase"
                    size="sm"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Placement Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
                    >
                      <option value="Hero Banner">Hero Banner</option>
                      <option value="Featured Collection">Featured Collection</option>
                      <option value="Spotlight Atelier">Spotlight Atelier</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
                    >
                      <option value="Active">Active</option>
                      <option value="Scheduled">Scheduled</option>
                      <option value="Draft">Draft</option>
                      <option value="Ended">Ended</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Target Category / Atelier
                  </label>
                  <Input
                    value={formData.target}
                    onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                    placeholder="e.g. Haute Horlogerie or Atelier Maison"
                    size="sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Start Date
                    </label>
                    <Input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      size="sm"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      End Date
                    </label>
                    <Input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      size="sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Banner Asset URL
                  </label>
                  <Input
                    value={formData.bannerImage}
                    onChange={(e) => setFormData({ ...formData, bannerImage: e.target.value })}
                    placeholder="https://..."
                    size="sm"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <Button variant="outline" size="sm" type="button" onClick={() => setModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" type="submit">
                    {editingPromotion ? 'Update' : 'Schedule Campaign'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <ConfirmModal
          isOpen={Boolean(deleteTarget)}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleConfirmDelete}
          title="Delete Marketing Campaign?"
          message={`Are you sure you wish to delete promotion "${deleteTarget?.title}"? The banner spotlight will immediately be unmounted from the marketplace.`}
          confirmText="Delete Campaign"
          variant="danger"
        />
      </div>
    </>
  );
};

export default AdminPromotionsPage;
