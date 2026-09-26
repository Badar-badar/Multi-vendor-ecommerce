import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  AlertTriangle,
  CheckCircle2,
  Boxes,
  ArrowUpDown,
  ExternalLink,
  MoreVertical,
  X,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { selectSellerProducts } from '../../features/seller/sellerSelectors';
import { deleteProduct, updateProduct, updateInventoryStock } from '../../features/seller/sellerSlice';
import { fetchSellerProducts } from '../../features/seller/sellerThunk';
import { formatCurrency } from '../../utils/formatCurrency';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import ConfirmModal from '../../components/common/ConfirmModal';

export const SellerProductsPage = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectSellerProducts) || [];

  useEffect(() => {
    dispatch(fetchSellerProducts());
  }, [dispatch]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'Active' | 'Draft' | 'Low Stock' | 'Out of Stock'
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'price_high' | 'price_low' | 'sales' | 'stock'

  // Quick stock edit modal state
  const [stockModalProduct, setStockModalProduct] = useState(null);
  const [newStockValue, setNewStockValue] = useState(0);

  // Delete modal state
  const [deleteProductTarget, setDeleteProductTarget] = useState(null);

  // Unique categories in seller's catalog
  const availableCategories = useMemo(() => {
    const cats = new Set(
      products
        .map((p) => (typeof p.category === 'object' ? p.category?.name : p.category))
        .filter(Boolean)
    );
    return ['All', ...Array.from(cats)];
  }, [products]);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((prod) => {
        const isLowStock = prod.stock > 0 && prod.stock <= (prod.lowStockThreshold || 3);
        const isOutOfStock = prod.stock === 0;

        const matchesStatus =
          statusFilter === 'All' ||
          (statusFilter === 'Active' && prod.status === 'Active') ||
          (statusFilter === 'Draft' && prod.status === 'Draft') ||
          (statusFilter === 'Low Stock' && isLowStock) ||
          (statusFilter === 'Out of Stock' && isOutOfStock);

        const catName = typeof prod.category === 'object' ? prod.category?.name : prod.category;
        const brandName = typeof prod.brand === 'object' ? prod.brand?.name : prod.brand;

        const matchesCategory =
          categoryFilter === 'All' || catName?.toLowerCase() === categoryFilter.toLowerCase();

        const matchesSearch =
          !searchQuery.trim() ||
          prod.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prod.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          brandName?.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesStatus && matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price_high') return b.price - a.price;
        if (sortBy === 'price_low') return a.price - b.price;
        if (sortBy === 'sales') return (b.salesCount || 0) - (a.salesCount || 0);
        if (sortBy === 'stock') return a.stock - b.stock;
        // Default newest / id
        return (b._id || b.id || '').localeCompare(a._id || a.id || '');
      });
  }, [products, statusFilter, categoryFilter, searchQuery, sortBy]);

  const handleConfirmDelete = () => {
    if (!deleteProductTarget) return;
    dispatch(deleteProduct(deleteProductTarget.id));
    toast.success(`"${deleteProductTarget.name}" has been removed from your catalog.`);
    setDeleteProductTarget(null);
  };

  const handleSaveStock = (e) => {
    e.preventDefault();
    if (!stockModalProduct) return;
    dispatch(
      updateInventoryStock({
        id: stockModalProduct.id,
        stock: newStockValue,
      })
    );
    toast.success(`Inventory for "${stockModalProduct.name}" updated to ${newStockValue} units.`);
    setStockModalProduct(null);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div>
            <h1 className="font-serif font-bold text-xl sm:text-2xl text-text-main">
              Creations & Catalog ({products.length})
            </h1>
            <p className="text-xs text-text-muted">
              Manage atelier listings, variant pricing, inventory allocation, and sales status.
            </p>
          </div>

          <Link to="/seller/products/create">
            <Button variant="primary" size="md" leftIcon={Plus}>
              Add Product
            </Button>
          </Link>
        </div>

        {/* Filter Toolbar: Status Tabs + Search + Category + Sort */}
        <div className="space-y-4">
          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {[
              { id: 'All', label: 'All Items', count: products.length },
              { id: 'Active', label: 'Active', count: products.filter((p) => p.status === 'Active').length },
              { id: 'Draft', label: 'Drafts', count: products.filter((p) => p.status === 'Draft').length },
              { id: 'Low Stock', label: 'Low Stock', count: products.filter((p) => p.stock > 0 && p.stock <= (p.lowStockThreshold || 3)).length },
              { id: 'Out of Stock', label: 'Out of Stock', count: products.filter((p) => p.stock === 0).length },
            ].map((tab) => {
              const isSelected = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-primary text-white shadow-xs'
                      : 'bg-surface hover:bg-surface-muted border border-border text-text-muted hover:text-text-main'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-surface-muted text-text-subtle'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search, Category & Sort Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            {/* Search Input (6 Cols) */}
            <div className="sm:col-span-6 relative">
              <input
                type="text"
                placeholder="Search by creation name, SKU, or atelier..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-surface border border-border rounded-xl focus:outline-none focus:border-primary text-text-main"
              />
              <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            {/* Category Select (3 Cols) */}
            <div className="sm:col-span-3">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-surface border border-border rounded-xl focus:outline-none focus:border-primary text-text-main capitalize cursor-pointer"
              >
                {availableCategories.map((c) => (
                  <option key={c} value={c}>
                    {c === 'All' ? 'All Categories' : c}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Select (3 Cols) */}
            <div className="sm:col-span-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-surface border border-border rounded-xl focus:outline-none focus:border-primary text-text-main cursor-pointer"
              >
                <option value="newest">Sort: Newest</option>
                <option value="price_high">Price: High to Low</option>
                <option value="price_low">Price: Low to High</option>
                <option value="sales">Most Units Sold</option>
                <option value="stock">Lowest Stock First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Desktop Table Presentation */}
        <div className="hidden md:block bg-surface rounded-2xl border border-border overflow-hidden shadow-subtle">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-surface-muted/60 border-b border-border text-text-muted text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold">Creation</th>
                <th className="py-3 px-4 font-semibold">SKU</th>
                <th className="py-3 px-4 font-semibold">Retail Price</th>
                <th className="py-3 px-4 font-semibold">Stock Level</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Sales</th>
                <th className="py-3 px-4 font-semibold">Updated</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((prod) => {
                  const isLowStock = prod.stock > 0 && prod.stock <= (prod.lowStockThreshold || 3);
                  const isOutOfStock = prod.stock === 0;

                  return (
                    <tr key={prod.id} className="hover:bg-surface-muted/40 transition-colors">
                      {/* Product Image & Name */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.images?.[0] || 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=200'}
                            alt={prod.name}
                            className="w-11 h-11 rounded-xl object-cover border border-border shrink-0"
                          />
                          <div className="min-w-0 max-w-[220px]">
                            <Link
                              to={`/seller/products/${prod.id}/edit`}
                              className="font-serif font-bold text-text-main hover:text-accent transition-colors block truncate"
                            >
                              {prod.name}
                            </Link>
                            <span className="text-[11px] text-text-muted capitalize block truncate">
                              {prod.category} {prod.subcategory ? `• ${prod.subcategory}` : ''}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="py-3.5 px-4 font-mono font-semibold text-text-subtle">
                        {prod.sku}
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4 font-serif font-bold text-text-main">
                        <div>
                          <span>{formatCurrency(prod.price)}</span>
                          {prod.compareAtPrice && prod.compareAtPrice > prod.price && (
                            <span className="text-[11px] text-text-subtle line-through block font-normal font-sans">
                              {formatCurrency(prod.compareAtPrice)}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Stock Level */}
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => {
                            setStockModalProduct(prod);
                            setNewStockValue(prod.stock);
                          }}
                          className="text-left group cursor-pointer"
                          title="Click to adjust stock"
                        >
                          <span
                            className={`inline-flex items-center gap-1 font-bold ${
                              isOutOfStock
                                ? 'text-rose-600'
                                : isLowStock
                                ? 'text-amber-600'
                                : 'text-emerald-700'
                            }`}
                          >
                            {prod.stock} units
                          </span>
                          <span className="text-[10px] text-accent block opacity-0 group-hover:opacity-100 transition-opacity underline">
                            Quick adjust
                          </span>
                        </button>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <Badge
                          variant={
                            prod.status === 'Active'
                              ? 'success'
                              : prod.status === 'Draft'
                              ? 'neutral'
                              : 'error'
                          }
                          size="xs"
                        >
                          {prod.status}
                        </Badge>
                      </td>

                      {/* Sales */}
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-text-main block">
                          {prod.salesCount || 0} sold
                        </span>
                        <span className="text-[11px] text-text-muted">
                          {formatCurrency(prod.revenue || prod.price * (prod.salesCount || 0))}
                        </span>
                      </td>

                      {/* Updated Date */}
                      <td className="py-3.5 px-4 text-text-muted font-mono text-[11px]">
                        {prod.updatedAt || '2026-08-28'}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/products/${prod.slug || prod.id}`}
                            className="p-1.5 rounded-lg text-text-muted hover:text-text-main hover:bg-surface-muted transition-colors"
                            title="View on Customer Marketplace"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>

                          <Link
                            to={`/seller/products/${prod.id}/edit`}
                            className="p-1.5 rounded-lg text-text-muted hover:text-text-main hover:bg-surface-muted transition-colors"
                            title="Edit Listing Specs"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </Link>

                          <button
                            onClick={() => setDeleteProductTarget(prod)}
                            className="p-1.5 rounded-lg text-text-muted hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Retire Creation"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-xs text-text-muted">
                    No creations matched your search or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Responsive Cards Presentation */}
        <div className="md:hidden space-y-3">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((prod) => {
              const isLowStock = prod.stock > 0 && prod.stock <= (prod.lowStockThreshold || 3);
              const isOutOfStock = prod.stock === 0;

              return (
                <div
                  key={prod.id}
                  className="p-4 bg-surface rounded-2xl border border-border space-y-3 shadow-xs"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={prod.images?.[0]}
                        alt={prod.name}
                        className="w-14 h-14 rounded-xl object-cover border border-border shrink-0"
                      />
                      <div className="min-w-0">
                        <Link
                          to={`/seller/products/${prod.id}/edit`}
                          className="font-serif font-bold text-sm text-text-main truncate block"
                        >
                          {prod.name}
                        </Link>
                        <span className="text-xs font-mono text-text-subtle block">
                          SKU: {prod.sku}
                        </span>
                        <span className="text-xs font-bold text-text-main">
                          {formatCurrency(prod.price)}
                        </span>
                      </div>
                    </div>

                    <Badge
                      variant={
                        prod.status === 'Active'
                          ? 'success'
                          : prod.status === 'Draft'
                          ? 'neutral'
                          : 'error'
                      }
                      size="xs"
                    >
                      {prod.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border text-xs">
                    <div>
                      <span className="text-[11px] text-text-muted block">Stock Status</span>
                      <span
                        className={`font-bold ${
                          isOutOfStock ? 'text-rose-600' : isLowStock ? 'text-amber-600' : 'text-emerald-700'
                        }`}
                      >
                        {prod.stock > 0 ? `${prod.stock} units` : 'Out of Stock'}
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] text-text-muted block">Total Sales</span>
                      <span className="font-bold text-text-main">{prod.salesCount || 0} sold</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-border">
                    <Link
                      to={`/seller/products/${prod.id}/edit`}
                      className="flex-1 py-1.5 px-3 rounded-lg bg-surface-muted hover:bg-surface-hover text-text-main text-xs font-semibold text-center border border-border"
                    >
                      Edit Listing
                    </Link>
                    <button
                      onClick={() => {
                        setStockModalProduct(prod);
                        setNewStockValue(prod.stock);
                      }}
                      className="flex-1 py-1.5 px-3 rounded-lg border border-border text-text-main text-xs font-semibold hover:bg-surface-muted"
                    >
                      Adjust Stock
                    </button>
                    <button
                      onClick={() => setDeleteProductTarget(prod)}
                      className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-xs text-text-muted bg-surface rounded-2xl border border-border">
              No creations matched your criteria.
            </div>
          )}
        </div>

        {/* Quick Stock Adjustment Modal */}
        {stockModalProduct && (
          <div className="fixed inset-0 z-50 bg-primary/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-surface rounded-2xl border border-border p-6 max-w-sm w-full shadow-elevated space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="font-serif font-bold text-sm text-text-main">
                  Adjust Inventory Allocation
                </h3>
                <button
                  onClick={() => setStockModalProduct(null)}
                  className="p-1 text-text-muted hover:text-text-main"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="text-xs text-text-muted space-y-1">
                <p className="font-semibold text-text-main">{stockModalProduct.name}</p>
                <p className="font-mono text-[11px]">SKU: {stockModalProduct.sku}</p>
              </div>

              <form onSubmit={handleSaveStock} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-text-main block mb-1">
                    Units in Atelier Storage
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10000"
                    value={newStockValue}
                    onChange={(e) => setNewStockValue(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-3 py-2 text-sm bg-surface-muted border border-border rounded-xl font-bold text-text-main focus:outline-none focus:border-primary"
                    required
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    fullWidth
                    onClick={() => setStockModalProduct(null)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm" fullWidth>
                    Update Stock
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <ConfirmModal
          isOpen={Boolean(deleteProductTarget)}
          onClose={() => setDeleteProductTarget(null)}
          onConfirm={handleConfirmDelete}
          title="Retire Creation from Catalog?"
          message={`Are you sure you wish to retire "${deleteProductTarget?.name}" (SKU: ${deleteProductTarget?.sku})? This will immediately remove it from public marketplace discovery.`}
          confirmText="Yes, Retire Creation"
          cancelText="Keep in Catalog"
          variant="danger"
        />
      </div>
    </>
  );
};

export default SellerProductsPage;
