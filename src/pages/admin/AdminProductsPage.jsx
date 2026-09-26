import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Eye,
  Trash2,
  Edit,
  PowerOff,
  Plus,
  ArrowUpDown,
  ExternalLink,
  Tag,
  Store,
  FolderTree,
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Input from '../../components/common/Input';
import ConfirmModal from '../../components/common/ConfirmModal';
import { formatCurrency } from '../../utils/formatCurrency';
import {
  selectAdminProducts,
  selectAdminCategories,
  selectAdminBrands,
  selectAdminSellers,
} from '../../features/admin/adminSelectors';
import {
  updateProductStatusLocal,
  deleteProductLocal,
} from '../../features/admin/adminSlice';
import {
  fetchAdminProducts,
  fetchAdminCategories,
  fetchAdminBrands,
  fetchAdminSellers,
} from '../../features/admin/adminThunk';

export const AdminProductsPage = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectAdminProducts) || [];
  const categories = useSelector(selectAdminCategories) || [];
  const brands = useSelector(selectAdminBrands) || [];
  const sellers = useSelector(selectAdminSellers) || [];

  useEffect(() => {
    dispatch(fetchAdminProducts());
    dispatch(fetchAdminCategories());
    dispatch(fetchAdminBrands());
    dispatch(fetchAdminSellers());
  }, [dispatch]);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('Incomplete information');
  const [rejectionNotes, setRejectionNotes] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedSeller, setSelectedSeller] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedStock, setSelectedStock] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [previewProduct, setPreviewProduct] = useState(null);

  const getCategoryName = (c) => (typeof c === 'object' ? (c?.name || c?.slug) : c) || '';
  const getBrandName = (b) => (typeof b === 'object' ? (b?.name || b?.slug) : b) || '';
  const getSellerName = (s) => (typeof s === 'object' ? (s?.storeName || s?.name || s?.email) : s) || '';

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const pName = p.name || '';
      const pSku = p.sku || '';
      const pBrand = getBrandName(p.brand);
      const pSeller = getSellerName(p.seller);
      const pCategory = getCategoryName(p.category);

      const matchesSearch =
        pName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pSku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pBrand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pSeller.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCat =
        selectedCategory === 'all' || pCategory === selectedCategory;
      const matchesBrand =
        selectedBrand === 'all' || pBrand === selectedBrand;
      const matchesSeller =
        selectedSeller === 'all' || pSeller === selectedSeller;
      const matchesStatus =
        selectedStatus === 'all' || p.status === selectedStatus;
      const matchesStock =
        selectedStock === 'all' ||
        (selectedStock === 'in_stock' && p.stock > 5) ||
        (selectedStock === 'low_stock' && p.stock > 0 && p.stock <= 5) ||
        (selectedStock === 'out_of_stock' && p.stock === 0);

      return (
        matchesSearch &&
        matchesCat &&
        matchesBrand &&
        matchesSeller &&
        matchesStatus &&
        matchesStock
      );
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'stock_desc') return b.stock - a.stock;
      if (sortBy === 'sales_desc') return (b.salesCount || 0) - (a.salesCount || 0);
      return (b._id || b.id || '').localeCompare(a._id || a.id || '');
    });
  }, [
    products,
    searchTerm,
    selectedCategory,
    selectedBrand,
    selectedSeller,
    selectedStatus,
    selectedStock,
    sortBy,
  ]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleApprove = (id) => {
    dispatch(updateProductStatusLocal({ productId: id, status: 'Approved' }));
    toast.success('Product catalog listing approved.');
  };

  const handleConfirmReject = (e) => {
    e.preventDefault();
    if (!rejectTarget) return;
    dispatch(updateProductStatusLocal({ productId: rejectTarget.id, status: 'Rejected' }));
    toast.error(`"${rejectTarget.name}" rejected: ${rejectionReason}`);
    setRejectTarget(null);
    setRejectionNotes('');
  };

  const handleToggleDisable = (p) => {
    const nextStatus = p.status === 'Disabled' ? 'Approved' : 'Disabled';
    dispatch(updateProductStatusLocal({ productId: p.id, status: nextStatus }));
    toast.success(`Product ${nextStatus === 'Disabled' ? 'disabled' : 'enabled'}.`);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    dispatch(deleteProductLocal(deleteTarget.id));
    toast.success(`"${deleteTarget.name}" removed from marketplace catalog.`);
    setDeleteTarget(null);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return <Badge variant="success" size="xs">Approved</Badge>;
      case 'Pending Approval':
      case 'Pending':
        return <Badge variant="warning" size="xs">Pending Review</Badge>;
      case 'Rejected':
        return <Badge variant="danger" size="xs">Rejected</Badge>;
      case 'Disabled':
        return <Badge variant="secondary" size="xs">Disabled</Badge>;
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
              Catalog Governance
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
              Product Catalog Management
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Review, approve, curate, and moderate all products across accredited ateliers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500">
              Showing {filteredProducts.length} of {products.length} Products
            </span>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Input
              placeholder="Search by title, SKU, brand, seller..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              leftIcon={Search}
              size="sm"
            />

            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              value={selectedBrand}
              onChange={(e) => {
                setSelectedBrand(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer"
            >
              <option value="all">All Brands</option>
              {brands.map((b) => (
                <option key={b.id} value={b.name}>
                  {b.name}
                </option>
              ))}
            </select>

            <select
              value={selectedSeller}
              onChange={(e) => {
                setSelectedSeller(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer"
            >
              <option value="all">All Sellers</option>
              {sellers.map((s) => (
                <option key={s.id} value={s.storeName}>
                  {s.storeName}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-slate-500">Quick Filters:</span>
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="Approved">Approved</option>
                <option value="Pending Approval">Pending Approval</option>
                <option value="Rejected">Rejected</option>
                <option value="Disabled">Disabled</option>
              </select>

              <select
                value={selectedStock}
                onChange={(e) => {
                  setSelectedStock(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 cursor-pointer"
              >
                <option value="all">All Stock Levels</option>
                <option value="in_stock">In Stock (&gt;5)</option>
                <option value="low_stock">Low Stock (1-5)</option>
                <option value="out_of_stock">Out of Stock (0)</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-semibold">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="stock_desc">Highest Stock</option>
                <option value="sales_desc">Top Selling</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Product</th>
                  <th className="py-3.5 px-4">Seller & Brand</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Stock</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Created</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedProducts.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-500">
                      No products match your criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedProducts.map((product) => {
                    const prodId = product._id || product.id;
                    const prodImage = product.images?.[0]?.url || product.images?.[0] || product.thumbnail || product.image || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80';
                    const prodSeller = getSellerName(product.seller) || 'Atelier';
                    const prodBrand = getBrandName(product.brand) || 'Zareen';
                    const prodCategory = getCategoryName(product.category) || 'General';

                    return (
                      <tr key={prodId} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={prodImage}
                              alt={product.name}
                              className="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0"
                            />
                            <div className="min-w-0 max-w-[200px]">
                              <p className="font-bold text-slate-900 truncate">{product.name}</p>
                              <span className="text-[10px] font-mono text-slate-400">
                                SKU: {product.sku || 'N/A'}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-slate-800">{prodSeller}</p>
                          <p className="text-[11px] text-slate-400">{prodBrand}</p>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="text-slate-700 font-medium">{prodCategory}</span>
                        </td>
                        <td className="py-3.5 px-4 font-serif font-bold text-slate-900">
                          {formatCurrency(product.price)}
                        </td>
                        <td className="py-3.5 px-4">
                          {product.stock === 0 ? (
                            <span className="text-rose-600 font-bold text-[11px]">0 (Out)</span>
                          ) : product.stock <= 5 ? (
                            <span className="text-amber-700 font-bold text-[11px]">{product.stock} (Low)</span>
                          ) : (
                            <span className="text-slate-700 font-semibold text-[11px]">{product.stock} units</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">{getStatusBadge(product.status)}</td>
                        <td className="py-3.5 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                          {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : (product.createdDate || 'Recent')}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setPreviewProduct(product)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                              title="Inspect Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {(product.status === 'Pending Approval' || product.status === 'Pending') && (
                              <>
                                <button
                                  onClick={() => handleApprove(prodId)}
                                  className="p-1.5 rounded-lg text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 transition-colors cursor-pointer"
                                  title="Approve Catalog Item"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setRejectTarget(product)}
                                  className="p-1.5 rounded-lg text-rose-600 hover:text-rose-800 hover:bg-rose-50 transition-colors cursor-pointer"
                                  title="Reject Item"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </>
                            )}

                            <button
                              onClick={() => handleToggleDisable(product)}
                              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                product.status === 'Disabled'
                                  ? 'text-amber-600 hover:bg-amber-50'
                                  : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                              }`}
                              title={product.status === 'Disabled' ? 'Enable Product' : 'Disable Product'}
                            >
                              <PowerOff className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => setDeleteTarget(product)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Responsive Cards */}
          <div className="lg:hidden divide-y divide-slate-100 p-4 space-y-4">
            {paginatedProducts.map((product) => {
              const prodId = product._id || product.id;
              const prodImage = product.images?.[0]?.url || product.images?.[0] || product.thumbnail || product.image || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80';
              const prodSeller = getSellerName(product.seller) || 'Atelier';

              return (
                <div key={prodId} className="pt-3 space-y-3">
                  <div className="flex items-start gap-3">
                    <img
                      src={prodImage}
                      alt={product.name}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-bold text-xs text-slate-900 leading-tight">
                          {product.name}
                        </p>
                        {getStatusBadge(product.status)}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        {prodSeller} · <span className="font-mono">{product.sku || 'N/A'}</span>
                      </p>
                      <div className="flex items-center justify-between mt-2 text-xs">
                        <span className="font-serif font-bold text-slate-900">
                          {formatCurrency(product.price)}
                        </span>
                        <span className="text-slate-500">
                          Stock: <strong>{product.stock}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => setPreviewProduct(product)}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" /> Details
                    </button>

                    <div className="flex items-center gap-1.5">
                      {(product.status === 'Pending Approval' || product.status === 'Pending') && (
                        <button
                          onClick={() => handleApprove(prodId)}
                          className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold cursor-pointer"
                        >
                          Approve
                        </button>
                      )}
                      <button
                        onClick={() => handleToggleDisable(product)}
                        className="px-2 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer"
                      >
                        {product.status === 'Disabled' ? 'Enable' : 'Disable'}
                      </button>
                      <button
                        onClick={() => setDeleteTarget(product)}
                        className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-lg border border-slate-200 bg-white font-semibold disabled:opacity-40 cursor-pointer"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-lg border border-slate-200 bg-white font-semibold disabled:opacity-40 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Product Quick Modal */}
        {previewProduct && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4 animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-serif font-bold text-slate-900 text-base">
                  Catalog Product Dossier
                </h3>
                <button
                  onClick={() => setPreviewProduct(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-900 cursor-pointer"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="flex gap-4">
                <img
                  src={previewProduct.image}
                  alt={previewProduct.name}
                  className="w-24 h-24 rounded-xl object-cover border border-slate-200"
                />
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-slate-900">{previewProduct.name}</h4>
                  <p className="text-xs text-slate-500">Seller: <strong className="text-slate-800">{previewProduct.seller}</strong></p>
                  <p className="text-xs text-slate-500">Brand: <strong className="text-slate-800">{previewProduct.brand}</strong></p>
                  <p className="text-xs font-serif font-bold text-slate-900 mt-1">
                    {formatCurrency(previewProduct.price)} · Stock: {previewProduct.stock}
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                {previewProduct.description || 'Mastercrafted luxury piece adhering to Zareen authentication standards.'}
              </p>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <Button variant="outline" size="sm" onClick={() => setPreviewProduct(null)}>
                  Close
                </Button>
                {(previewProduct.status === 'Pending Approval' || previewProduct.status === 'Pending') && (
                  <>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => {
                        setRejectTarget(previewProduct);
                        setPreviewProduct(null);
                      }}
                    >
                      Reject Listing
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        handleApprove(previewProduct.id);
                        setPreviewProduct(null);
                      }}
                    >
                      Approve Product
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Rejection Reason Modal */}
        {rejectTarget && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <form
              onSubmit={handleConfirmReject}
              className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-150"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-serif font-bold text-slate-900 text-base">
                  Reject Product Listing
                </h3>
                <button
                  type="button"
                  onClick={() => setRejectTarget(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-900 cursor-pointer"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-600">
                Please provide a formal rejection justification for "<strong>{rejectTarget.name}</strong>" by atelier <strong>{rejectTarget.seller}</strong>.
              </p>

              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Primary Rejection Reason
                  </label>
                  <select
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-800 text-slate-800 cursor-pointer"
                  >
                    <option value="Incomplete information">Incomplete Information or Missing Specs</option>
                    <option value="Invalid category or subcategory">Invalid Category / Classification</option>
                    <option value="Image resolution / Quality issue">Image Resolution / Photography Standards Issue</option>
                    <option value="Pricing or discount policy issue">Pricing / Luxury Authenticity Anomaly</option>
                    <option value="Policy or provenance violation">Artisan Policy / Provenance Violation</option>
                    <option value="Counterfeit or unverified atelier">Unverified Authenticity Hallmarks</option>
                    <option value="Other">Other Specific Reason</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Atelier Moderation Feedback Notes (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide constructive guidance for the seller to rectify and resubmit..."
                    value={rejectionNotes}
                    onChange={(e) => setRejectionNotes(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-800 text-slate-800 resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setRejectTarget(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="danger" size="sm">
                  Confirm Rejection
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <ConfirmModal
          isOpen={Boolean(deleteTarget)}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleConfirmDelete}
          title="Delete Product Listing?"
          message={`Are you sure you wish to delete "${deleteTarget?.name}" (SKU: ${deleteTarget?.sku}) from the marketplace catalog?`}
          confirmText="Delete Product"
          variant="danger"
        />
      </div>
    </>
  );
};

export default AdminProductsPage;
