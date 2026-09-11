import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  RotateCcw,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Package,
  ArrowRight,
  AlertTriangle,
  DollarSign,
  X,
  ShieldCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { selectSellerReturns } from '../../features/seller/sellerSelectors';
import { updateReturnStatus } from '../../features/seller/sellerSlice';
import { formatCurrency } from '../../utils/formatCurrency';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

const STATUS_FILTERS = ['All', 'Requested', 'Approved', 'Received', 'Refunded', 'Rejected'];

export const SellerReturnsPage = () => {
  const dispatch = useDispatch();
  const returns = useSelector(selectSellerReturns) || [];

  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReturn, setSelectedReturn] = useState(null);

  const filteredReturns = useMemo(() => {
    return returns.filter((ret) => {
      const matchesTab =
        activeTab === 'All' || ret.status?.toLowerCase() === activeTab.toLowerCase();

      const matchesSearch =
        !searchQuery.trim() ||
        ret.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ret.orderId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ret.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ret.product?.name?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesTab && matchesSearch;
    });
  }, [returns, activeTab, searchQuery]);

  const handleStatusChange = (returnId, newStatus) => {
    dispatch(
      updateReturnStatus({
        returnId,
        status: newStatus,
      })
    );
    toast.success(`Return #${returnId} marked as ${newStatus}.`);
    setSelectedReturn(null);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div>
            <h1 className="font-serif font-bold text-xl sm:text-2xl text-text-main">
              Returns & Exchange Requests ({returns.length})
            </h1>
            <p className="text-xs text-text-muted">
              Inspect patron return applications, review condition reasons, and authorize escrow refunds.
            </p>
          </div>
        </div>

        {/* 4 KPI Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-surface rounded-2xl border border-border space-y-1 shadow-subtle">
            <span className="text-[11px] font-semibold text-text-muted">Total Return Requests</span>
            <p className="font-serif text-2xl font-bold text-text-main">{returns.length}</p>
            <span className="text-[10px] text-text-subtle">Lifetime atelier requests</span>
          </div>

          <div className="p-4 bg-surface rounded-2xl border border-border space-y-1 shadow-subtle">
            <span className="text-[11px] font-semibold text-text-muted">Pending Review</span>
            <p className="font-serif text-2xl font-bold text-amber-600">
              {returns.filter((r) => r.status === 'Requested').length}
            </p>
            <span className="text-[10px] text-amber-700">Awaiting atelier response</span>
          </div>

          <div className="p-4 bg-surface rounded-2xl border border-border space-y-1 shadow-subtle">
            <span className="text-[11px] font-semibold text-text-muted">In Transit / Approved</span>
            <p className="font-serif text-2xl font-bold text-primary">
              {returns.filter((r) => r.status === 'Approved').length}
            </p>
            <span className="text-[10px] text-text-subtle">Awaiting arrival at workshop</span>
          </div>

          <div className="p-4 bg-surface rounded-2xl border border-border space-y-1 shadow-subtle">
            <span className="text-[11px] font-semibold text-text-muted">Settled Refunds</span>
            <p className="font-serif text-2xl font-bold text-emerald-700">
              {returns.filter((r) => r.status === 'Refunded').length}
            </p>
            <span className="text-[10px] text-emerald-800">Closed and refunded</span>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {STATUS_FILTERS.map((tab) => {
              const isSelected = activeTab === tab;
              const count =
                tab === 'All'
                  ? returns.length
                  : returns.filter((r) => r.status?.toLowerCase() === tab.toLowerCase()).length;

              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-primary text-white shadow-xs'
                      : 'bg-surface hover:bg-surface-muted border border-border text-text-muted hover:text-text-main'
                  }`}
                >
                  <span>{tab}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-surface-muted text-text-subtle'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search returns by ID, order #, customer, or creation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-surface border border-border rounded-xl focus:outline-none focus:border-primary text-text-main"
            />
            <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Returns Table (Desktop) */}
        <div className="hidden md:block bg-surface rounded-2xl border border-border overflow-hidden shadow-subtle">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-surface-muted/60 border-b border-border text-text-muted text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold">Return ID</th>
                <th className="py-3 px-4 font-semibold">Order Reference</th>
                <th className="py-3 px-4 font-semibold">Creation Item</th>
                <th className="py-3 px-4 font-semibold">Customer</th>
                <th className="py-3 px-4 font-semibold">Reason</th>
                <th className="py-3 px-4 font-semibold">Value</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredReturns.length > 0 ? (
                filteredReturns.map((ret) => (
                  <tr key={ret.id} className="hover:bg-surface-muted/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-text-main">{ret.id}</td>
                    <td className="py-3.5 px-4 font-mono text-text-subtle">
                      <Link
                        to={`/seller/orders/${ret.orderId}`}
                        className="hover:text-accent underline"
                      >
                        {ret.orderNumber || ret.orderId}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4 max-w-[200px]">
                      <div className="flex items-center gap-2">
                        {ret.product?.image && (
                          <img
                            src={ret.product.image}
                            alt=""
                            className="w-8 h-8 rounded-lg object-cover border border-border shrink-0"
                          />
                        )}
                        <span className="text-text-main font-medium truncate block">
                          {ret.product?.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-text-main block">{ret.customer?.name}</span>
                      <span className="text-[11px] text-text-muted block truncate">
                        {ret.customer?.email}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 max-w-[220px] text-text-muted truncate">
                      {ret.reason}
                    </td>
                    <td className="py-3.5 px-4 font-serif font-bold text-text-main">
                      {formatCurrency(ret.amount || 840)}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={
                          ret.status === 'Refunded'
                            ? 'success'
                            : ret.status === 'Rejected'
                            ? 'error'
                            : ret.status === 'Approved'
                            ? 'primary'
                            : 'warning'
                        }
                        size="xs"
                      >
                        {ret.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedReturn(ret)}
                        className="px-2.5 py-1 rounded-lg bg-surface border border-border hover:bg-surface-muted text-text-main font-semibold text-xs cursor-pointer"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-xs text-text-muted">
                    No return dossiers matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Responsive Returns Cards */}
        <div className="md:hidden space-y-3">
          {filteredReturns.length > 0 ? (
            filteredReturns.map((ret) => (
              <div key={ret.id} className="p-4 bg-surface rounded-2xl border border-border space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="font-mono font-bold text-xs text-text-main block">
                      Return #{ret.id}
                    </span>
                    <span className="text-[11px] text-text-muted">
                      Order: {ret.orderNumber || ret.orderId}
                    </span>
                  </div>
                  <Badge
                    variant={
                      ret.status === 'Refunded'
                        ? 'success'
                        : ret.status === 'Rejected'
                        ? 'error'
                        : ret.status === 'Approved'
                        ? 'primary'
                        : 'warning'
                    }
                    size="xs"
                  >
                    {ret.status}
                  </Badge>
                </div>

                <div className="text-xs text-text-main p-2 bg-surface-muted rounded-xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{ret.product?.name}</span>
                    <span className="font-serif font-bold">{formatCurrency(ret.amount)}</span>
                  </div>
                  <p className="text-[11px] text-text-muted italic">"{ret.reason}"</p>
                </div>

                <button
                  onClick={() => setSelectedReturn(ret)}
                  className="w-full py-1.5 px-3 rounded-lg bg-primary text-white text-xs font-semibold text-center"
                >
                  Manage Return
                </button>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-xs text-text-muted bg-surface rounded-2xl border border-border">
              No return requests in this category.
            </div>
          )}
        </div>

        {/* Return Management Action Modal */}
        {selectedReturn && (
          <div className="fixed inset-0 z-50 bg-primary/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-surface rounded-2xl border border-border p-6 max-w-md w-full shadow-elevated space-y-4 animate-in fade-in zoom-in-95 duration-200 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-accent" />
                  <h3 className="font-serif font-bold text-sm text-text-main">
                    Manage Return #{selectedReturn.id}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedReturn(null)}
                  className="p-1 text-text-muted hover:text-text-main"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3 bg-surface-muted rounded-xl space-y-1">
                <div className="flex justify-between">
                  <span className="text-text-muted">Customer:</span>
                  <span className="font-semibold text-text-main">{selectedReturn.customer?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Item:</span>
                  <span className="font-semibold text-text-main">{selectedReturn.product?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Refund Value:</span>
                  <span className="font-serif font-bold text-text-main">
                    {formatCurrency(selectedReturn.amount)}
                  </span>
                </div>
                <div className="pt-1 border-t border-border/80">
                  <span className="text-text-muted block text-[10px]">Reason Stated:</span>
                  <p className="text-text-main italic">{selectedReturn.reason}</p>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <span className="font-semibold text-text-main block">Available Actions:</span>

                {selectedReturn.status === 'Requested' && (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleStatusChange(selectedReturn.id, 'Approved')}
                      className="py-2 px-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-hover transition-colors cursor-pointer text-center"
                    >
                      Approve Return
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusChange(selectedReturn.id, 'Rejected')}
                      className="py-2 px-3 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-semibold transition-colors cursor-pointer text-center"
                    >
                      Decline Return
                    </button>
                  </div>
                )}

                {selectedReturn.status === 'Approved' && (
                  <button
                    type="button"
                    onClick={() => handleStatusChange(selectedReturn.id, 'Received')}
                    className="w-full py-2 px-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-hover transition-colors cursor-pointer text-center"
                  >
                    Mark Item Received at Workshop
                  </button>
                )}

                {selectedReturn.status === 'Received' && (
                  <button
                    type="button"
                    onClick={() => handleStatusChange(selectedReturn.id, 'Refunded')}
                    className="w-full py-2 px-3 rounded-xl bg-emerald-700 text-white font-semibold hover:bg-emerald-800 transition-colors cursor-pointer text-center"
                  >
                    Authorize Escrow Refund ({formatCurrency(selectedReturn.amount)})
                  </button>
                )}

                {selectedReturn.status === 'Refunded' && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-center font-semibold">
                    Refund successfully executed.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SellerReturnsPage;
