import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  ShoppingCart,
  Search,
  Truck,
  ArrowRight,
  Package,
  CheckCircle2,
  Clock,
  Printer,
  ChevronRight,
  ShieldCheck,
  X,
  RotateCcw,
  FileText,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { selectSellerOrders } from '../../features/seller/sellerSelectors';
import { updateOrderStatus } from '../../features/seller/sellerSlice';
import { fetchSellerOrders } from '../../features/seller/sellerThunk';
import { formatCurrency } from '../../utils/formatCurrency';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

const STATUS_FILTERS = [
  'All',
  'Pending',
  'Confirmed',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled',
  'Return Requested',
];

export const SellerOrdersPage = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectSellerOrders) || [];

  useEffect(() => {
    dispatch(fetchSellerOrders());
  }, [dispatch]);

  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusUpdateTarget, setStatusUpdateTarget] = useState(null);
  const [newStatus, setNewStatus] = useState('Processing');
  const [newTrackingNumber, setNewTrackingNumber] = useState('');

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const orderStatus = order.status?.toLowerCase() || '';
      const tabKey = activeTab.toLowerCase();

      let matchesTab = activeTab === 'All';
      if (activeTab === 'Shipped') {
        matchesTab = orderStatus === 'shipped' || orderStatus === 'in transit';
      } else if (!matchesTab) {
        matchesTab = orderStatus === tabKey;
      }

      const matchesSearch =
        !searchQuery.trim() ||
        order.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.items?.some((i) => i.name?.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesTab && matchesSearch;
    });
  }, [orders, activeTab, searchQuery]);

  const handleOpenStatusModal = (ord) => {
    setStatusUpdateTarget(ord);
    setNewStatus(ord.status || 'Processing');
    setNewTrackingNumber(ord.trackingNumber || '');
  };

  const handleSaveStatus = (e) => {
    e.preventDefault();
    if (!statusUpdateTarget) return;

    dispatch(
      updateOrderStatus({
        orderId: statusUpdateTarget.id,
        status: newStatus,
        trackingNumber: newTrackingNumber.trim() || undefined,
      })
    );
    toast.success(`Order #${statusUpdateTarget.orderNumber || statusUpdateTarget.id} status updated to ${newStatus}.`);
    setStatusUpdateTarget(null);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div>
            <h1 className="font-serif font-bold text-xl sm:text-2xl text-text-main">
              Fulfillment Orders ({orders.length})
            </h1>
            <p className="text-xs text-text-muted">
              Process customer acquisitions, assign insured waybill tracking, and update dispatch status.
            </p>
          </div>
        </div>

        {/* Filters Toolbar: Tabs + Search */}
        <div className="space-y-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {STATUS_FILTERS.map((tab) => {
              const isSelected = activeTab === tab;
              const count =
                tab === 'All'
                  ? orders.length
                  : tab === 'Shipped'
                  ? orders.filter(
                      (o) =>
                        o.status?.toLowerCase() === 'shipped' ||
                        o.status?.toLowerCase() === 'in transit'
                    ).length
                  : orders.filter((o) => o.status?.toLowerCase() === tab.toLowerCase()).length;

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

          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search by order #, customer name, email, or creation item..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-surface border border-border rounded-xl focus:outline-none focus:border-primary text-text-main"
            />
            <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Desktop Table Presentation */}
        <div className="hidden md:block bg-surface rounded-2xl border border-border overflow-hidden shadow-subtle">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-surface-muted/60 border-b border-border text-text-muted text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold">Order Reference</th>
                <th className="py-3 px-4 font-semibold">Customer & Destination</th>
                <th className="py-3 px-4 font-semibold">Creation Items</th>
                <th className="py-3 px-4 font-semibold text-center">Qty</th>
                <th className="py-3 px-4 font-semibold">Gross Amount</th>
                <th className="py-3 px-4 font-semibold">Payment</th>
                <th className="py-3 px-4 font-semibold">Fulfillment Status</th>
                <th className="py-3 px-4 font-semibold">Date</th>
                <th className="py-3 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((ord) => {
                  const totalQty = (ord.items || []).reduce((s, i) => s + (i.quantity || 1), 0);

                  return (
                    <tr key={ord.id} className="hover:bg-surface-muted/40 transition-colors">
                      {/* Order Number */}
                      <td className="py-3.5 px-4">
                        <Link
                          to={`/seller/orders/${ord.id}`}
                          className="font-mono font-bold text-text-main hover:text-accent transition-colors block"
                        >
                          {ord.orderNumber || ord.id}
                        </Link>
                        {ord.trackingNumber && (
                          <span className="text-[10px] font-mono text-accent block">
                            {ord.trackingNumber}
                          </span>
                        )}
                      </td>

                      {/* Customer */}
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-text-main block">
                          {ord.customer?.name}
                        </span>
                        <span className="text-[11px] text-text-muted block">
                          {ord.customer?.city}, {ord.customer?.country}
                        </span>
                      </td>

                      {/* Products */}
                      <td className="py-3.5 px-4 max-w-[220px]">
                        <div className="flex items-center gap-2">
                          {ord.items?.[0]?.image && (
                            <img
                              src={ord.items[0].image}
                              alt=""
                              className="w-8 h-8 rounded-lg object-cover border border-border shrink-0"
                            />
                          )}
                          <div className="min-w-0">
                            <span className="text-text-main font-medium block truncate">
                              {ord.items?.[0]?.name}
                            </span>
                            {ord.items?.length > 1 && (
                              <span className="text-[10px] text-text-subtle">
                                +{ord.items.length - 1} additional item(s)
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Quantity */}
                      <td className="py-3.5 px-4 text-center font-bold text-text-main">
                        {totalQty}
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-4 font-serif font-bold text-text-main">
                        {formatCurrency(ord.amount)}
                      </td>

                      {/* Payment */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          {ord.paymentStatus || 'Paid & Escrow'}
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleOpenStatusModal(ord)}
                          className="cursor-pointer group text-left"
                          title="Click to update fulfillment state"
                        >
                          <Badge
                            variant={
                              ord.status === 'Delivered'
                                ? 'success'
                                : ord.status === 'Cancelled'
                                ? 'error'
                                : ord.status === 'Processing'
                                ? 'warning'
                                : 'primary'
                            }
                            size="xs"
                          >
                            {ord.status}
                          </Badge>
                          <span className="text-[9px] text-accent opacity-0 group-hover:opacity-100 transition-opacity block underline">
                            Change
                          </span>
                        </button>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-text-muted font-mono text-[11px]">
                        {ord.date}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          to={`/seller/orders/${ord.id}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
                        >
                          Inspect <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-xs text-text-muted">
                    No fulfillment orders matched your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Responsive Cards Presentation */}
        <div className="md:hidden space-y-3">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((ord) => (
              <div
                key={ord.id}
                className="p-4 bg-surface rounded-2xl border border-border space-y-3 shadow-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link
                      to={`/seller/orders/${ord.id}`}
                      className="font-mono font-bold text-sm text-text-main hover:text-accent"
                    >
                      {ord.orderNumber || ord.id}
                    </Link>
                    <span className="text-xs text-text-muted block">{ord.customer?.name}</span>
                  </div>

                  <Badge
                    variant={
                      ord.status === 'Delivered'
                        ? 'success'
                        : ord.status === 'Cancelled'
                        ? 'error'
                        : ord.status === 'Processing'
                        ? 'warning'
                        : 'primary'
                    }
                    size="xs"
                  >
                    {ord.status}
                  </Badge>
                </div>

                <div className="text-xs text-text-main py-1 border-y border-border/80 flex items-center justify-between">
                  <span className="truncate max-w-[200px]">{ord.items?.[0]?.name}</span>
                  <span className="font-serif font-bold">{formatCurrency(ord.amount)}</span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-text-muted">
                  <span>Date: {ord.date}</span>
                  <span>{ord.shippingMethod || 'White-Glove Express'}</span>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <Link
                    to={`/seller/orders/${ord.id}`}
                    className="flex-1 py-1.5 px-3 rounded-lg bg-primary text-white text-xs font-semibold text-center hover:bg-primary-hover shadow-xs"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => handleOpenStatusModal(ord)}
                    className="flex-1 py-1.5 px-3 rounded-lg border border-border text-text-main text-xs font-semibold hover:bg-surface-muted"
                  >
                    Update Status
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-xs text-text-muted bg-surface rounded-2xl border border-border">
              No orders found in this status.
            </div>
          )}
        </div>

        {/* Modal: Update Order Fulfillment Status */}
        {statusUpdateTarget && (
          <div className="fixed inset-0 z-50 bg-primary/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-surface rounded-2xl border border-border p-6 max-w-md w-full shadow-elevated space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="font-serif font-bold text-sm text-text-main">
                  Update Fulfillment State
                </h3>
                <button
                  onClick={() => setStatusUpdateTarget(null)}
                  className="p-1 text-text-muted hover:text-text-main"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3 bg-surface-muted rounded-xl text-xs space-y-0.5">
                <span className="font-mono font-bold text-text-main block">
                  {statusUpdateTarget.orderNumber || statusUpdateTarget.id}
                </span>
                <span className="text-text-muted block">
                  Customer: {statusUpdateTarget.customer?.name} ({statusUpdateTarget.customer?.city})
                </span>
              </div>

              <form onSubmit={handleSaveStatus} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-text-main block mb-1">
                    Fulfillment Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-surface-muted border border-border rounded-xl focus:outline-none focus:border-primary text-text-main cursor-pointer"
                  >
                    <option value="Pending">Pending Review</option>
                    <option value="Confirmed">Maison Confirmed</option>
                    <option value="Processing">Bespoke Processing & Hand-finishing</option>
                    <option value="Shipped">Dispatched with Insured Courier</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                {(newStatus === 'Shipped' || newStatus === 'In Transit') && (
                  <div>
                    <label className="text-xs font-semibold text-text-main block mb-1">
                      Courier Waybill / Tracking Reference #
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. DHL-ZRN-981024-FR"
                      value={newTrackingNumber}
                      onChange={(e) => setNewTrackingNumber(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-surface-muted border border-border rounded-xl focus:outline-none focus:border-primary font-mono text-text-main"
                      required
                    />
                  </div>
                )}

                <div className="flex items-center gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    fullWidth
                    onClick={() => setStatusUpdateTarget(null)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm" fullWidth>
                    Save Status
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

export default SellerOrdersPage;
