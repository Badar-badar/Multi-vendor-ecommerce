import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Package,
  Search,
  ArrowRight,
  Truck,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  FileText,
  ShoppingBag,
  Clock,
  XCircle,
  ShieldCheck,
  Printer,
  ChevronRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { selectOrders } from '../../features/orders/orderSelectors';
import { fetchMyOrders } from '../../features/orders/orderThunk';
import { cancelOrderAction } from '../../features/orders/orderSlice';
import { addToCart } from '../../features/cart/cartSlice';
import { formatCurrency } from '../../utils/formatCurrency';
import AccountLayout from '../../components/account/AccountLayout';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import ConfirmModal from '../../components/common/ConfirmModal';
import InvoiceModal from '../../components/orders/InvoiceModal';
import ReturnRequestModal from '../../components/orders/ReturnRequestModal';

const ALL_ORDER_STATUSES = [
  'All',
  'Pending',
  'Confirmed',
  'Processing',
  'Packed',
  'Shipped',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
  'Return Requested',
  'Returned',
  'Refund Requested',
  'Refunded',
];

export const AccountOrdersPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders) || [];

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [invoiceOrder, setInvoiceOrder] = useState(null);
  const [returnOrder, setReturnOrder] = useState(null);
  const [cancelOrderTarget, setCancelOrderTarget] = useState(null);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesFilter =
        activeFilter === 'All' ||
        order.status?.toLowerCase() === activeFilter.toLowerCase();

      const matchesSearch =
        !searchQuery.trim() ||
        order.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.items?.some((item) =>
          (item.name || item.product?.name)?.toLowerCase().includes(searchQuery.toLowerCase())
        );

      return matchesFilter && matchesSearch;
    });
  }, [orders, activeFilter, searchQuery]);

  const handleReorder = (order) => {
    if (!order.items || order.items.length === 0) return;
    order.items.forEach((item) => {
      dispatch(
        addToCart({
          product: {
            id: item.productId || item.id || `reord-${Date.now()}`,
            name: item.name || item.product?.name,
            price: item.price,
            originalPrice: item.originalPrice || item.price,
            images: [item.image || item.product?.images?.[0]],
            brand: item.brand,
            seller: item.seller,
          },
          quantity: item.quantity || 1,
          selectedVariant: item.selectedVariant,
        })
      );
    });
    toast.success(`Items from #${order.orderNumber || order.id} re-added to your shopping bag.`);
    navigate('/cart');
  };

  const handleConfirmCancel = () => {
    if (!cancelOrderTarget) return;
    dispatch(
      cancelOrderAction({
        orderId: cancelOrderTarget.id,
        reason: 'Cancelled by patron request before fulfillment dispatch.',
      })
    );
    toast.success(`Order #${cancelOrderTarget.orderNumber || cancelOrderTarget.id} has been cancelled.`);
    setCancelOrderTarget(null);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return <Badge variant="success" size="xs">Delivered</Badge>;
      case 'Shipped':
      case 'Out for Delivery':
      case 'In Transit':
        return <Badge variant="info" size="xs">{status}</Badge>;
      case 'Processing':
      case 'Packed':
      case 'Confirmed':
        return <Badge variant="accent" size="xs">{status}</Badge>;
      case 'Pending':
        return <Badge variant="warning" size="xs">Pending</Badge>;
      case 'Cancelled':
        return <Badge variant="danger" size="xs">Cancelled</Badge>;
      case 'Return Requested':
      case 'Returned':
        return <Badge variant="secondary" size="xs">{status}</Badge>;
      case 'Refund Requested':
      case 'Refunded':
        return <Badge variant="primary" size="xs">{status}</Badge>;
      default:
        return <Badge variant="default" size="xs">{status}</Badge>;
    }
  };

  return (
    <AccountLayout>
      <div className="space-y-6">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div>
            <h2 className="font-serif font-bold text-xl text-text-main">
              Commissioned Orders ({orders.length})
            </h2>
            <p className="text-xs text-text-muted">
              Inspect transit milestones, review artisan certificates, download invoices, and initiate returns.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search by order # or creation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-surface border border-border rounded-xl focus:outline-none focus:border-text-main"
            />
            <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {ALL_ORDER_STATUSES.map((filter) => {
            const isActive = activeFilter === filter;
            const count =
              filter === 'All'
                ? orders.length
                : orders.filter((o) => o.status?.toLowerCase() === filter.toLowerCase()).length;

            if (filter !== 'All' && count === 0 && !isActive) return null;

            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-surface text-text-muted border border-border hover:text-text-main hover:bg-surface-muted'
                }`}
              >
                <span>{filter}</span>
                <span className={`ml-1.5 text-[10px] ${isActive ? 'text-white/80' : 'text-text-subtle'}`}>
                  ({count})
                </span>
              </button>
            );
          })}
        </div>

        {/* Order Cards List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-surface rounded-2xl border border-border p-12 text-center space-y-4">
            <div className="w-12 h-12 bg-surface-muted rounded-full flex items-center justify-center mx-auto text-text-muted">
              <Package className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-base text-text-main">
              No matching orders found
            </h3>
            <p className="text-xs text-text-muted max-w-sm mx-auto">
              {searchQuery
                ? `No orders matching "${searchQuery}".`
                : `You currently have no orders in "${activeFilter}" status.`}
            </p>
            <Link to="/products">
              <Button variant="secondary" size="md">
                Discover Curations
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredOrders.map((order) => {
              const isDelivered = order.status === 'Delivered';
              const isCancellable = order.status === 'Pending' || order.status === 'Confirmed' || order.status === 'Processing';
              const isReturnEligible = isDelivered && order.status !== 'Return Requested' && order.status !== 'Returned';

              return (
                <div
                  key={order.id}
                  className="bg-surface rounded-2xl border border-border overflow-hidden shadow-subtle hover:border-border-strong transition-all"
                >
                  {/* Order Card Top Bar */}
                  <div className="bg-surface-muted/60 p-4 sm:px-6 border-b border-border flex flex-wrap items-center justify-between gap-4 text-xs">
                    <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                      <div>
                        <span className="text-text-muted block text-[11px]">Order Placed</span>
                        <span className="font-semibold text-text-main">{order.createdAt}</span>
                      </div>
                      <div>
                        <span className="text-text-muted block text-[11px]">Grand Total</span>
                        <span className="font-serif font-bold text-text-main">
                          {formatCurrency(order.total)}
                        </span>
                      </div>
                      <div>
                        <span className="text-text-muted block text-[11px]">Acquisition Registry #</span>
                        <span className="font-mono font-semibold text-text-main">
                          {order.orderNumber || order.id}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {getStatusBadge(order.status)}
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="p-4 sm:p-6 divide-y divide-border">
                    {order.items?.map((item, idx) => (
                      <div
                        key={idx}
                        className="py-3 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={item.image || item.product?.images?.[0] || 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=300&auto=format&fit=crop'}
                            alt={item.name || item.product?.name}
                            className="w-16 h-16 object-cover rounded-xl bg-surface-muted border border-border shrink-0"
                          />
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-bold text-accent uppercase tracking-wider block">
                              {item.brand || item.seller?.storeName || item.product?.seller?.storeName || 'Atelier Masterpiece'}
                            </span>
                            <h4 className="text-sm font-serif font-bold text-text-main">
                              {item.name || item.product?.name}
                            </h4>
                            <p className="text-[11px] text-text-muted">
                              Qty: {item.quantity || 1} • {formatCurrency(item.price)} each
                              {item.selectedVariant && ` • ${Object.values(item.selectedVariant).join(', ')}`}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="font-serif font-bold text-sm text-text-main block">
                            {formatCurrency((item.price || 0) * (item.quantity || 1))}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Card Footer Actions */}
                  <div className="bg-surface-muted/30 px-4 sm:px-6 py-3.5 border-t border-border flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-1.5 text-text-muted text-[11px]">
                      <Truck className="w-3.5 h-3.5 text-accent" />
                      <span>Courier: {order.courier || order.shippingMethodName || 'Sovereign White-Glove'}</span>
                      {order.deliveryEstimate && (
                        <span>• Est. {order.deliveryEstimate}</span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setInvoiceOrder(order)}
                        className="px-2.5 py-1.5 rounded-lg border border-border bg-surface text-text-muted hover:text-text-main hover:bg-surface-muted transition-colors flex items-center gap-1 text-xs cursor-pointer font-medium"
                        title="Print / View Invoice"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Invoice</span>
                      </button>

                      {isReturnEligible && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          leftIcon={RotateCcw}
                          onClick={() => setReturnOrder(order)}
                        >
                          Return / Exchange
                        </Button>
                      )}

                      {isCancellable && (
                        <button
                          type="button"
                          onClick={() => setCancelOrderTarget(order)}
                          className="px-2.5 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 text-xs font-semibold cursor-pointer"
                        >
                          Cancel Order
                        </button>
                      )}

                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => handleReorder(order)}
                        leftIcon={ShoppingBag}
                      >
                        Buy Again
                      </Button>

                      <Link to={`/account/orders/${order.id}`}>
                        <Button variant="primary" size="sm" rightIcon={ArrowRight}>
                          Track Order
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Invoice Modal */}
        <InvoiceModal
          isOpen={Boolean(invoiceOrder)}
          onClose={() => setInvoiceOrder(null)}
          order={invoiceOrder}
        />

        {/* Return Request Modal */}
        <ReturnRequestModal
          isOpen={Boolean(returnOrder)}
          onClose={() => setReturnOrder(null)}
          order={returnOrder}
        />

        {/* Cancel Confirmation Dialog */}
        <ConfirmModal
          isOpen={Boolean(cancelOrderTarget)}
          onClose={() => setCancelOrderTarget(null)}
          onConfirm={handleConfirmCancel}
          title="Cancel Sovereign Commission?"
          message={`Are you sure you wish to cancel order #${cancelOrderTarget?.orderNumber || cancelOrderTarget?.id}? Any reserved artisan inventory will be released and payment authorization voided.`}
          confirmText="Confirm Cancellation"
          variant="danger"
        />
      </div>
    </AccountLayout>
  );
};

export default AccountOrdersPage;
