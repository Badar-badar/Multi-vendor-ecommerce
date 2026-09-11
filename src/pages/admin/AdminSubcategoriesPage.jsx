import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderTree,
  Plus,
  Edit,
  Trash2,
  Layers,
  Search,
  PowerOff,
  ChevronRight,
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
  addSubcategoryLocal,
  updateSubcategoryLocal,
  deleteSubcategoryLocal,
} from '../../features/admin/adminSlice';

export const AdminSubcategoriesPage = () => {
  const dispatch = useDispatch();
  const categories = useSelector(selectAdminCategories);
  const subcategories = useSelector(selectAdminSubcategories);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedParentCat, setSelectedParentCat] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editingSubcategory, setEditingSubcategory] = useState(null);

  const [formData, setFormData] = useState({
    categoryId: 'CAT-01',
    name: '',
    slug: '',
    description: '',
    status: 'Active',
  });

  const filteredSubcategories = useMemo(() => {
    return subcategories.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.categoryName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.slug?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCat =
        selectedParentCat === 'all' || s.categoryId === selectedParentCat;
      return matchesSearch && matchesCat;
    });
  }, [subcategories, searchTerm, selectedParentCat]);

  const openCreateModal = () => {
    setEditingSubcategory(null);
    setFormData({
      categoryId: categories[0]?.id || 'CAT-01',
      name: '',
      slug: '',
      description: '',
      status: 'Active',
    });
    setModalOpen(true);
  };

  const openEditModal = (subcat) => {
    setEditingSubcategory(subcat);
    setFormData({
      categoryId: subcat.categoryId,
      name: subcat.name,
      slug: subcat.slug,
      description: subcat.description || '',
      status: subcat.status || 'Active',
    });
    setModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error('Please enter a subcategory name');
      return;
    }

    const parentCat = categories.find((c) => c.id === formData.categoryId);

    if (editingSubcategory) {
      dispatch(
        updateSubcategoryLocal({
          id: editingSubcategory.id,
          categoryName: parentCat ? parentCat.name : '',
          ...formData,
        })
      );
      toast.success('Subcategory updated successfully.');
    } else {
      const newSub = {
        id: `SUBCAT-${Date.now().toString().slice(-3)}`,
        categoryName: parentCat ? parentCat.name : '',
        ...formData,
        slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        productsCount: 0,
      };
      dispatch(addSubcategoryLocal(newSub));
      toast.success('New subcategory created.');
    }
    setModalOpen(false);
  };

  const handleToggleStatus = (s) => {
    const nextStatus = s.status === 'Active' ? 'Disabled' : 'Active';
    dispatch(updateSubcategoryLocal({ id: s.id, status: nextStatus }));
    toast.success(`Subcategory ${nextStatus.toLowerCase()}.`);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    dispatch(deleteSubcategoryLocal(deleteTarget.id));
    toast.success(`Subcategory "${deleteTarget.name}" deleted.`);
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
              Subcategory Management
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Granular product categorizations assigned under primary departments.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/admin/categories">
              <Button variant="outline" size="sm" leftIcon={Layers}>
                Primary Categories
              </Button>
            </Link>
            <Button variant="primary" size="sm" leftIcon={Plus} onClick={openCreateModal}>
              New Subcategory
            </Button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex-1 max-w-sm">
            <Input
              placeholder="Search subcategories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={Search}
              size="sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Parent Category:</span>
            <select
              value={selectedParentCat}
              onChange={(e) => setSelectedParentCat(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 cursor-pointer"
            >
              <option value="all">All Departments</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Subcategories Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Subcategory Name</th>
                  <th className="py-3.5 px-4">Parent Category</th>
                  <th className="py-3.5 px-4">Slug</th>
                  <th className="py-3.5 px-4">Products</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSubcategories.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      No subcategories found matching criteria.
                    </td>
                  </tr>
                ) : (
                  filteredSubcategories.map((subcat) => (
                    <tr key={subcat.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900">{subcat.name}</p>
                        <p className="text-[11px] text-slate-500 line-clamp-1">
                          {subcat.description}
                        </p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[11px] font-semibold border border-slate-200">
                          <Layers className="w-3 h-3 text-slate-500" />
                          {subcat.categoryName}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">
                        /{subcat.slug}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900">{subcat.productsCount || 0}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge
                          variant={subcat.status === 'Active' ? 'success' : 'secondary'}
                          size="xs"
                        >
                          {subcat.status}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(subcat)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
                            title="Edit Subcategory"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(subcat)}
                            className={`p-1.5 rounded-lg cursor-pointer ${
                              subcat.status === 'Disabled'
                                ? 'text-amber-600'
                                : 'text-slate-400 hover:text-slate-700'
                            }`}
                            title={subcat.status === 'Disabled' ? 'Enable' : 'Disable'}
                          >
                            <PowerOff className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(subcat)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                            title="Delete Subcategory"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-serif font-bold text-slate-900 text-base">
                  {editingSubcategory ? 'Edit Subcategory' : 'Create Subcategory'}
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
                    Parent Category *
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Subcategory Name *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Tourbillons & Complications"
                    size="sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Slug
                  </label>
                  <Input
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. tourbillons-complications"
                    size="sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Short description..."
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-900 h-20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                  >
                    <option value="Active">Active</option>
                    <option value="Disabled">Disabled</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                  <Button variant="outline" size="sm" type="button" onClick={() => setModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" type="submit">
                    {editingSubcategory ? 'Update' : 'Create'}
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
          title="Delete Subcategory?"
          message={`Are you sure you wish to delete subcategory "${deleteTarget?.name}"? Items linked to this subcategory will remain in their parent category.`}
          confirmText="Delete Subcategory"
          variant="danger"
        />
      </div>
    </>
  );
};

export default AdminSubcategoriesPage;
