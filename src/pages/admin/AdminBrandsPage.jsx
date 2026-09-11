import { useState, useMemo } from 'react';
import {
  Award,
  Plus,
  Edit,
  Trash2,
  Search,
  PowerOff,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Package,
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Input from '../../components/common/Input';
import ConfirmModal from '../../components/common/ConfirmModal';
import { formatCurrency } from '../../utils/formatCurrency';
import { selectAdminBrands } from '../../features/admin/adminSelectors';
import {
  addBrandLocal,
  updateBrandLocal,
  deleteBrandLocal,
} from '../../features/admin/adminSlice';

export const AdminBrandsPage = () => {
  const dispatch = useDispatch();
  const brands = useSelector(selectAdminBrands);

  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editingBrand, setEditingBrand] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    origin: '',
    tier: 'Heritage Maison',
    logo: '',
    description: '',
    verified: true,
    status: 'Active',
  });

  const filteredBrands = useMemo(() => {
    return brands.filter(
      (b) =>
        b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.origin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.tier?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [brands, searchTerm]);

  const openCreateModal = () => {
    setEditingBrand(null);
    setFormData({
      name: '',
      origin: 'Paris, France',
      tier: 'Heritage Maison',
      logo: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=100&auto=format&fit=crop&q=80',
      description: '',
      verified: true,
      status: 'Active',
    });
    setModalOpen(true);
  };

  const openEditModal = (brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name,
      origin: brand.origin || '',
      tier: brand.tier || 'Heritage Maison',
      logo: brand.logo || '',
      description: brand.description || '',
      verified: brand.verified !== false,
      status: brand.status || 'Active',
    });
    setModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error('Brand name is required');
      return;
    }

    if (editingBrand) {
      dispatch(
        updateBrandLocal({
          id: editingBrand.id,
          ...formData,
        })
      );
      toast.success('Brand details updated.');
    } else {
      const newBrand = {
        id: `BRD-${Date.now().toString().slice(-3)}`,
        ...formData,
        productsCount: 0,
        gmv: 0,
      };
      dispatch(addBrandLocal(newBrand));
      toast.success('New brand registered.');
    }
    setModalOpen(false);
  };

  const handleToggleStatus = (b) => {
    const nextStatus = b.status === 'Active' ? 'Disabled' : 'Active';
    dispatch(updateBrandLocal({ id: b.id, status: nextStatus }));
    toast.success(`Brand ${nextStatus.toLowerCase()}.`);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    dispatch(deleteBrandLocal(deleteTarget.id));
    toast.success(`Brand "${deleteTarget.name}" removed.`);
    setDeleteTarget(null);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block mb-1">
              Brand Registry
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
              Accredited Brand Directory
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage maison partnerships, trademark certifications, and verified luxury labels.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="primary" size="sm" leftIcon={Plus} onClick={openCreateModal}>
              Register Brand
            </Button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex-1 max-w-sm">
            <Input
              placeholder="Search brands by name, origin..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={Search}
              size="sm"
            />
          </div>

          <span className="text-xs font-semibold text-slate-500">
            {filteredBrands.length} Verified Brands Registered
          </span>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredBrands.map((brand) => (
            <div
              key={brand.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-200"
                  />
                  <div className="flex items-center gap-1">
                    {brand.verified && (
                      <span title="Verified Luxury Maison">
                        <ShieldCheck className="w-4 h-4 text-amber-800" />
                      </span>
                    )}
                    <Badge
                      variant={brand.status === 'Active' ? 'success' : 'secondary'}
                      size="xs"
                    >
                      {brand.status}
                    </Badge>
                  </div>
                </div>

                <div>
                  <h3 className="font-serif font-bold text-slate-900 text-sm">{brand.name}</h3>
                  <p className="text-[11px] text-slate-500">{brand.origin || 'International'}</p>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 min-h-[32px]">
                  {brand.description || 'Certified luxury atelier brand.'}
                </p>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-center text-xs">
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-medium">Products</span>
                    <strong className="text-slate-900 font-bold">{brand.productsCount || 0}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-medium">Tier</span>
                    <strong className="text-amber-800 font-semibold truncate block">
                      {brand.tier}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-1.5 pt-3 border-t border-slate-100">
                <button
                  onClick={() => openEditModal(brand)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
                  title="Edit Brand"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleToggleStatus(brand)}
                  className={`p-1.5 rounded-lg cursor-pointer ${
                    brand.status === 'Disabled' ? 'text-amber-600' : 'text-slate-400 hover:text-slate-700'
                  }`}
                  title={brand.status === 'Disabled' ? 'Enable' : 'Disable'}
                >
                  <PowerOff className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteTarget(brand)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                  title="Delete Brand"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-serif font-bold text-slate-900 text-base">
                  {editingBrand ? 'Edit Brand Registry' : 'Register New Brand'}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-900 cursor-pointer text-xs font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Brand Name *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Vesper Horology"
                    size="sm"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Origin Country/City
                    </label>
                    <Input
                      value={formData.origin}
                      onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                      placeholder="e.g. Geneva, Switzerland"
                      size="sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Maison Tier
                    </label>
                    <select
                      value={formData.tier}
                      onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                    >
                      <option value="Heritage Maison">Heritage Maison</option>
                      <option value="Sovereign Atelier">Sovereign Atelier</option>
                      <option value="Artisan Goldsmith">Artisan Goldsmith</option>
                      <option value="Haute Parfumerie">Haute Parfumerie</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Brand Logo URL
                  </label>
                  <Input
                    value={formData.logo}
                    onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                    placeholder="https://..."
                    size="sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Description & Heritage
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Craftsmanship heritage, certifications..."
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-900 h-20"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                  <Button variant="outline" size="sm" type="button" onClick={() => setModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" type="submit">
                    {editingBrand ? 'Update Brand' : 'Register Brand'}
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
          title="Delete Brand Registry?"
          message={`Are you sure you wish to remove "${deleteTarget?.name}" from the Zareen brand registry?`}
          confirmText="Delete Brand"
          variant="danger"
        />
      </div>
    </>
  );
};

export default AdminBrandsPage;
