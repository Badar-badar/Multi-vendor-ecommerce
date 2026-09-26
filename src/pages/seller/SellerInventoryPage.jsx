import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Boxes,
  Search,
  Plus,
  Minus,
  Edit2,
  AlertTriangle,
  CheckCircle2,
  Package,
  Eye,
  ArrowUpDown,
  X,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { selectSellerProducts } from '../../features/seller/sellerSelectors';
import { updateInventoryStock } from '../../features/seller/sellerSlice';
import { fetchSellerProducts } from '../../features/seller/sellerThunk';
import { formatCurrency } from '../../utils/formatCurrency';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

export const SellerInventoryPage = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectSellerProducts) || [];

  useEffect(() => {
    dispatch(fetchSellerProducts());
  }, [dispatch]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'In Stock' | 'Low Stock' | 'Out of Stock'
  const [editingItem, setEditingItem] = useState(null);
  const [stockInput, setStockInput] = useState(0);
  const [thresholdInput, setThresholdInput] = useState(3);

  // Statistics calculation
  const totalUnits = useMemo(
    () => products.reduce((sum, p) => sum + (Number(p.stock) || 0), 0),
    [products]
  );
  const lowStockCount = useMemo(
    () => products.filter((p) => p.stock > 0 && p.stock <= (p.lowStockThreshold || 3)).length,
    [products]
  );
  const outOfStockCount = useMemo(
    () => products.filter((p) => p.stock === 0).length,
    [products]
  );
  const totalValuation = useMemo(
    () => products.reduce((sum, p) => sum + (Number(p.stock) || 0) * (Number(p.price) || 0), 0),
    [products]
  );

  // Filtered Inventory list
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      const isLowStock = prod.stock > 0 && prod.stock <= (prod.lowStockThreshold || 3);
      const isOutOfStock = prod.stock === 0;

      const matchesStatus =
        statusFilter === 'All' ||
        (statusFilter === 'In Stock' && prod.stock > (prod.lowStockThreshold || 3)) ||
        (statusFilter === 'Low Stock' && isLowStock) ||
        (statusFilter === 'Out of Stock' && isOutOfStock);

      const matchesSearch =
        !searchQuery.trim() ||
        prod.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.sku?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [products, statusFilter, searchQuery]);

  const handleOpenEditModal = (prod) => {
    setEditingItem(prod);
    setStockInput(prod.stock);
    setThresholdInput(prod.lowStockThreshold || 3);
  };

  const handleQuickStep = (prod, delta) => {
    const updatedVal = Math.max(0, prod.stock + delta);
    dispatch(
      updateInventoryStock({
        id: prod.id,
        stock: updatedVal,
      })
    );
    toast.success(`Updated "${prod.name}" stock to ${updatedVal} units.`);
  };

  const handleSaveModal = (e) => {
    e.preventDefault();
    if (!editingItem) return;
    dispatch(
      updateInventoryStock({
        id: editingItem.id,
        stock: stockInput,
        lowStockThreshold: thresholdInput,
      })
    );
    toast.success(`Inventory for "${editingItem.name}" updated successfully.`);
    setEditingItem(null);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div>
            <h1 className="font-serif font-bold text-xl sm:text-2xl text-text-main">
              Atelier Inventory Management
            </h1>
            <p className="text-xs text-text-muted">
              Live storage inventory telemetry, reserved orders allocation, and automated reorder alerts.
            </p>
          </div>

          <Link to="/seller/products/create">
            <Button variant="primary" size="sm" leftIcon={Plus}>
              New Product
            </Button>
          </Link>
        </div>

        {/* 4 Inventory Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-surface rounded-2xl border border-border space-y-1 shadow-subtle">
            <span className="text-[11px] font-semibold text-text-muted">Total Stock in Atelier</span>
            <p className="font-serif text-2xl font-bold text-text-main">{totalUnits} units</p>
            <span className="text-[10px] text-text-subtle">{products.length} registered SKUs</span>
          </div>

          <div className="p-4 bg-surface rounded-2xl border border-border space-y-1 shadow-subtle">
            <span className="text-[11px] font-semibold text-text-muted">Inventory Valuation</span>
            <p className="font-serif text-2xl font-bold text-text-main">
              {formatCurrency(totalValuation)}
            </p>
            <span className="text-[10px] text-text-subtle">Gross retail market value</span>
          </div>

          <div className="p-4 bg-surface rounded-2xl border border-border space-y-1 shadow-subtle">
            <span className="text-[11px] font-semibold text-text-muted">Low Stock Threshold</span>
            <p className="font-serif text-2xl font-bold text-amber-600">{lowStockCount} items</p>
            <span className="text-[10px] text-amber-700">Approaching depletion</span>
          </div>

          <div className="p-4 bg-surface rounded-2xl border border-border space-y-1 shadow-subtle">
            <span className="text-[11px] font-semibold text-text-muted">Depleted / Out of Stock</span>
            <p className="font-serif text-2xl font-bold text-rose-600">{outOfStockCount} items</p>
            <span className="text-[10px] text-rose-700">Requires restocking</span>
          </div>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {[
              { id: 'All', label: 'All SKUs', count: products.length },
              { id: 'In Stock', label: 'Healthy Stock', count: products.filter((p) => p.stock > (p.lowStockThreshold || 3)).length },
              { id: 'Low Stock', label: 'Low Stock', count: lowStockCount },
              { id: 'Out of Stock', label: 'Out of Stock', count: outOfStockCount },
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

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search by creation or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-surface border border-border rounded-xl focus:outline-none focus:border-primary text-text-main"
            />
            <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Inventory Desktop Table */}
        <div className="hidden md:block bg-surface rounded-2xl border border-border overflow-hidden shadow-subtle">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-surface-muted/60 border-b border-border text-text-muted text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold">Creation Details</th>
                <th className="py-3 px-4 font-semibold">SKU</th>
                <th className="py-3 px-4 font-semibold text-center">Current Total</th>
                <th className="py-3 px-4 font-semibold text-center">Reserved</th>
                <th className="py-3 px-4 font-semibold text-center">Available</th>
                <th className="py-3 px-4 font-semibold text-center">Threshold</th>
                <th className="py-3 px-4 font-semibold">Health Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((prod) => {
                  const isLowStock = prod.stock > 0 && prod.stock <= (prod.lowStockThreshold || 3);
                  const isOutOfStock = prod.stock === 0;
                  const availableToSell = Math.max(0, prod.stock - (prod.reservedStock || 0));

                  return (
                    <tr key={prod.id} className="hover:bg-surface-muted/40 transition-colors">
                      {/* Product details */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.images?.[0]}
                            alt={prod.name}
                            className="w-10 h-10 rounded-xl object-cover border border-border shrink-0"
                          />
                          <div className="min-w-0 max-w-[200px]">
                            <span className="font-serif font-bold text-text-main block truncate">
                              {prod.name}
                            </span>
                            <span className="text-[11px] text-text-muted">
                              {formatCurrency(prod.price)}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="py-3.5 px-4 font-mono font-semibold text-text-subtle">
                        {prod.sku}
                      </td>

                      {/* Current Stock with stepper */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex items-center border border-border rounded-xl bg-surface-muted overflow-hidden">
                          <button
                            type="button"
                            onClick={() => handleQuickStep(prod, -1)}
                            disabled={prod.stock <= 0}
                            className="w-6 h-6 flex items-center justify-center text-xs font-bold text-text-muted hover:text-text-main hover:bg-surface disabled:opacity-30 cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-text-main">
                            {prod.stock}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleQuickStep(prod, 1)}
                            className="w-6 h-6 flex items-center justify-center text-xs font-bold text-text-muted hover:text-text-main hover:bg-surface cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </td>

                      {/* Reserved in Pending Orders */}
                      <td className="py-3.5 px-4 text-center text-text-muted font-semibold">
                        {prod.reservedStock || 0}
                      </td>

                      {/* Available to Sell */}
                      <td className="py-3.5 px-4 text-center font-bold text-text-main">
                        {availableToSell}
                      </td>

                      {/* Threshold */}
                      <td className="py-3.5 px-4 text-center text-text-subtle font-mono">
                        {prod.lowStockThreshold || 3} units
                      </td>

                      {/* Health Status */}
                      <td className="py-3.5 px-4">
                        <Badge
                          variant={
                            isOutOfStock
                              ? 'error'
                              : isLowStock
                              ? 'warning'
                              : 'success'
                          }
                          size="xs"
                        >
                          {isOutOfStock ? 'Depleted' : isLowStock ? 'Low Stock' : 'Optimal'}
                        </Badge>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditModal(prod)}
                            className="px-2.5 py-1 rounded-lg bg-surface border border-border hover:bg-surface-muted text-text-main font-semibold text-xs transition-colors cursor-pointer"
                          >
                            Adjust
                          </button>
                          <Link
                            to={`/seller/products/${prod.id}/edit`}
                            className="p-1.5 rounded-lg text-text-muted hover:text-text-main hover:bg-surface-muted"
                            title="Edit Listing"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-xs text-text-muted">
                    No inventory records match your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Inventory Cards */}
        <div className="md:hidden space-y-3">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((prod) => {
              const isLowStock = prod.stock > 0 && prod.stock <= (prod.lowStockThreshold || 3);
              const isOutOfStock = prod.stock === 0;

              return (
                <div key={prod.id} className="p-4 bg-surface rounded-2xl border border-border space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={prod.images?.[0]}
                        alt={prod.name}
                        className="w-12 h-12 rounded-xl object-cover border border-border"
                      />
                      <div>
                        <span className="font-serif font-bold text-xs text-text-main block">
                          {prod.name}
                        </span>
                        <span className="text-[11px] font-mono text-text-subtle">SKU: {prod.sku}</span>
                      </div>
                    </div>

                    <Badge
                      variant={isOutOfStock ? 'error' : isLowStock ? 'warning' : 'success'}
                      size="xs"
                    >
                      {isOutOfStock ? 'Depleted' : isLowStock ? 'Low Stock' : 'Optimal'}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-2 p-2.5 bg-surface-muted rounded-xl text-center text-xs">
                    <div>
                      <span className="text-[10px] text-text-subtle block">Total</span>
                      <span className="font-bold text-text-main">{prod.stock}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-text-subtle block">Reserved</span>
                      <span className="font-semibold text-text-muted">{prod.reservedStock || 0}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-text-subtle block">Available</span>
                      <span className="font-bold text-emerald-700">
                        {Math.max(0, prod.stock - (prod.reservedStock || 0))}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handleOpenEditModal(prod)}
                      className="flex-1 py-1.5 rounded-lg bg-surface border border-border text-xs font-semibold text-text-main text-center hover:bg-surface-muted"
                    >
                      Adjust Allocation
                    </button>
                    <Link
                      to={`/seller/products/${prod.id}/edit`}
                      className="p-2 rounded-lg border border-border text-text-muted hover:text-text-main"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-xs text-text-muted bg-surface rounded-2xl border border-border">
              No inventory entries found.
            </div>
          )}
        </div>

        {/* Modal: Adjust Inventory Allocation */}
        {editingItem && (
          <div className="fixed inset-0 z-50 bg-primary/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-surface rounded-2xl border border-border p-6 max-w-md w-full shadow-elevated space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <Boxes className="w-4 h-4 text-accent" />
                  <h3 className="font-serif font-bold text-sm text-text-main">
                    Adjust Stock Allocation
                  </h3>
                </div>
                <button
                  onClick={() => setEditingItem(null)}
                  className="p-1 text-text-muted hover:text-text-main"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3 bg-surface-muted rounded-xl space-y-0.5 text-xs">
                <span className="font-bold text-text-main block">{editingItem.name}</span>
                <span className="font-mono text-text-subtle block">SKU: {editingItem.sku}</span>
                <span className="text-text-muted block">
                  Unit Price: {formatCurrency(editingItem.price)}
                </span>
              </div>

              <form onSubmit={handleSaveModal} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-text-main block mb-1">
                    Physical Stock in Atelier (Units)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100000"
                    value={stockInput}
                    onChange={(e) => setStockInput(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-3 py-2 text-sm bg-surface-muted border border-border rounded-xl font-bold text-text-main focus:outline-none focus:border-primary"
                    required
                  />
                  <p className="text-[11px] text-text-muted mt-1">
                    {editingItem.reservedStock || 0} unit(s) currently reserved in active orders.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-text-main block mb-1">
                    Low Stock Alert Limit
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={thresholdInput}
                    onChange={(e) => setThresholdInput(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-2 text-xs bg-surface-muted border border-border rounded-xl text-text-main focus:outline-none focus:border-primary"
                    required
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    fullWidth
                    onClick={() => setEditingItem(null)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm" fullWidth>
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SellerInventoryPage;
