import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  Plus,
  Edit,
  Trash2,
  FolderTree,
  PowerOff,
  ExternalLink,
  Percent,
  Package,
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Input from '../../components/common/Input';
import ConfirmModal from '../../components/common/ConfirmModal';
import {
  selectAdminCategories,
  selectAdminSubcategories,
} from '../../features/admin/adminSelectors';
import {
  addCategoryLocal,
  updateCategoryLocal,
  deleteCategoryLocal,
} from '../../features/admin/adminSlice';

export const AdminCategoriesPage = () => {
  const dispatch = useDispatch();
  const categories = useSelector(selectAdminCategories);
  const subcategories = useSelector(selectAdminSubcategories);

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    commissionRate: 10,
    status: 'Active',
  });

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&auto=format&fit=crop&q=80',
      commissionRate: 10,
      status: 'Active',
    });
    setModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      image: cat.image || '',
      commissionRate: cat.commissionRate || 10,
      status: cat.status || 'Active',
    });
    setModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error('Please enter a category name');
      return;
    }

    if (editingCategory) {
      dispatch(
        updateCategoryLocal({
          id: editingCategory.id,
          ...formData,
        })
      );
      toast.success('Category updated successfully.');
    } else {
      const newCat = {
        id: `CAT-0${categories.length + 1}`,
        ...formData,
        slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        subcategoriesCount: 0,
        productsCount: 0,
      };
      dispatch(addCategoryLocal(newCat));
      toast.success('New category created.');
    }
    setModalOpen(false);
  };

  const handleToggleStatus = (cat) => {
    const nextStatus = cat.status === 'Active' ? 'Disabled' : 'Active';
    dispatch(updateCategoryLocal({ id: cat.id, status: nextStatus }));
    toast.success(`Category ${nextStatus.toLowerCase()}.`);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    dispatch(deleteCategoryLocal(deleteTarget.id));
    toast.success(`Category "${deleteTarget.name}" deleted.`);
    setDeleteTarget(null);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block mb-1">
              Catalog Taxonomy
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
              Primary Categories
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Organize marketplace categories, configure platform take rates, and manage taxonomy.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/admin/subcategories">
              <Button variant="outline" size="sm" leftIcon={FolderTree}>
                Subcategories ({subcategories.length})
              </Button>
            </Link>
            <Button variant="primary" size="sm" leftIcon={Plus} onClick={openCreateModal}>
              New Category
            </Button>
          </div>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between group hover:border-slate-300 transition-all"
            >
              <div>
                <div className="relative h-36 bg-slate-100 overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className="font-serif font-bold text-white text-base truncate drop-shadow-sm">
                      {cat.name}
                    </span>
                    <Badge
                      variant={cat.status === 'Active' ? 'success' : 'secondary'}
                      size="xs"
                    >
                      {cat.status}
                    </Badge>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <p className="text-xs text-slate-600 line-clamp-2 min-h-[32px]">
                    {cat.description || 'Curated luxury department on Zareen.'}
                  </p>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-medium">Subcats</span>
                      <strong className="text-xs text-slate-900 font-bold">
                        {cat.subcategoriesCount || subcategories.filter((s) => s.categoryId === cat.id).length}
                      </strong>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-medium">Products</span>
                      <strong className="text-xs text-slate-900 font-bold">
                        {cat.productsCount || 0}
                      </strong>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-medium">Take Rate</span>
                      <strong className="text-xs text-amber-800 font-bold">
                        {cat.commissionRate || 10}%
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0 flex items-center justify-between border-t border-slate-100 pt-3">
                <span className="text-[11px] font-mono text-slate-400">/{cat.slug}</span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(cat)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
                    title="Edit Category"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleToggleStatus(cat)}
                    className={`p-1.5 rounded-lg cursor-pointer ${
                      cat.status === 'Disabled' ? 'text-amber-600' : 'text-slate-400 hover:text-slate-700'
                    }`}
                    title={cat.status === 'Disabled' ? 'Enable' : 'Disable'}
                  >
                    <PowerOff className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(cat)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                    title="Delete Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Create / Edit Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-lg w-full shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-serif font-bold text-lg text-slate-900">
                  {editingCategory ? 'Edit Category' : 'Create New Category'}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-slate-400 hover:text-slate-700"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category Name *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      setFormData({
                        ...formData,
                        name,
                        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                      });
                    }}
                    placeholder="e.g., Haute Horlogerie"
                    size="sm"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Slug *</label>
                    <Input
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="haute-horlogerie"
                      size="sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Commission (%)
                    </label>
                    <Input
                      type="number"
                      value={formData.commissionRate}
                      onChange={(e) =>
                        setFormData({ ...formData, commissionRate: Number(e.target.value) })
                      }
                      size="sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                    placeholder="Describe this luxury department..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Cover Image URL
                  </label>
                  <Input
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    size="sm"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                  <Button variant="outline" size="sm" type="button" onClick={() => setModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" type="submit">
                    {editingCategory ? 'Update Category' : 'Create Category'}
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
          title="Delete Category?"
          message={`Are you sure you wish to delete the "${deleteTarget?.name}" category? Associated products may require department reassignment.`}
          confirmText="Delete Category"
          variant="danger"
        />
      </div>
    </>
  );
};

export default AdminCategoriesPage;
