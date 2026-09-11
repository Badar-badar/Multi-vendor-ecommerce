import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShoppingCart,
  ArrowLeft,
  User,
  Store,
  MapPin,
  CreditCard,
  Truck,
  CheckCircle2,
  Clock,
  RotateCcw,
  Ban,
  FileText,
  AlertTriangle,
  DollarSign,
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { formatCurrency } from '../../utils/formatCurrency';
import { selectAdminOrders } from '../../features/admin/adminSelectors';
import { updateOrderStatusLocal, updateRefundStatusLocal } from '../../features/admin/adminSlice';

export const AdminOrderDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const orders = useSelector(selectAdminOrders);

  const order = orders.find((o) => o.id === id || o.orderNumber === id) || orders[0];

  const [fulfillmentStatus, setFulfillmentStatus] = useState(order?.fulfillmentStatus || 'Processing');
  const [paymentStatus, setPaymentStatus] = useState(order?.paymentStatus || 'Paid');
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [refundAmount, setRefundAmount] = useState(order?.total || 0);
  const [refundReason, setRefundReason] = useState('');

  if (!order) {
    return (
      <>
        <div className="p-8 text-center space-y-4">
          <p className="text-slate-500">Order record not found.</p>
          <Link to="/admin/orders">
            <Button variant="primary" size="sm">
              Return to Orders
            </Button>
          </Link>
        </div>
      </>
    );
  }

  const handleUpdateStatus = () => {
    dispatch(
      updateOrderStatusLocal({
        orderId: order.id,
        fulfillmentStatus,
        paymentStatus,
      })
    );
    toast.success('Order status updated successfully.');
  };

  const handleExecuteRefund = (e) => {
    e.preventDefault();
    if (!refundAmount || refundAmount <= 0) {
      toast.error('Please enter a valid refund amount');
      return;
    }
    dispatch(
      updateOrderStatusLocal({
        orderId: order.id,
        paymentStatus: 'Refunded',
        fulfillmentStatus: 'Cancelled',
      })
    );
    setPaymentStatus('Refunded');
    setFulfillmentStatus('Cancelled');
    setRefundModalOpen(false);
    toast.success(`Refund of ${formatCurrency(refundAmount)} executed back to customer.`);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <Link to="/admin/orders">
              <Button variant="ghost" size="sm" leftIcon={ArrowLeft}>
                Orders
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 font-mono">
                  {order.orderNumber || order.id}
                </h1>
                <Badge variant={order.fulfillmentStatus === 'Delivered' ? 'success' : 'info'} size="xs">
                  {order.fulfillmentStatus}
                </Badge>
                <Badge variant={order.paymentStatus === 'Paid' ? 'success' : 'danger'} size="xs">
                  {order.paymentStatus}
                </Badge>
              </div>
              <p className="text-xs text-slate-500">
                Placed on {order.date} · Associated Seller: <strong className="text-slate-800">{order.seller}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={RotateCcw}
              onClick={() => setRefundModalOpen(true)}
              className="text-rose-600 hover:bg-rose-50"
            >
              Issue Refund
            </Button>
          </div>
        </div>

        {/* Top Control Bar: Status Management */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700">Fulfillment:</span>
              <select
                value={fulfillmentStatus}
                onChange={(e) => setFulfillmentStatus(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 cursor-pointer"
              >
                <option value="Processing">Processing</option>
                <option value="In Transit">In Transit</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700">Payment:</span>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 cursor-pointer"
              >
                <option value="Paid">Paid (Escrow Secured)</option>
                <option value="Refunded">Refunded</option>
                <option value="Failed">Failed</option>
              </select>
            </div>
          </div>

          <Button variant="primary" size="xs" onClick={handleUpdateStatus}>
            Save Status Override
          </Button>
        </div>

        {/* Order Items & Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Items (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-serif font-bold text-slate-900 text-sm">
                  Line Items ({order.items?.length || order.itemsCount || 1})
                </h3>
                <span className="text-xs text-slate-500 font-mono">Currency: USD</span>
              </div>

              <div className="divide-y divide-slate-100">
                {(order.items || [
                  {
                    id: 'ITM-1',
                    name: '18k Solstice Choker with Pavé Diamonds',
                    price: 4850,
                    quantity: 1,
                    variant: 'Yellow Gold / 42cm',
                    sku: 'AUR-SOL-18K',
                    seller: order.seller,
                  },
                ]).map((item, idx) => (
                  <div key={idx} className="p-4 flex items-center justify-between gap-4 text-xs">
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900">{item.name}</p>
                      <p className="text-[11px] text-slate-500">
                        Variant: {item.variant || 'Default'} · SKU: <span className="font-mono">{item.sku}</span>
                      </p>
                      <span className="text-[10px] text-amber-800 font-semibold block mt-0.5">
                        Seller: {item.seller || order.seller}
                      </span>
                    </div>

                    <div className="text-right">
                      <p className="font-serif font-bold text-slate-900">
                        {formatCurrency(item.price)} × {item.quantity || 1}
                      </p>
                      <span className="text-[11px] text-slate-500 font-semibold">
                        Total: {formatCurrency(item.price * (item.quantity || 1))}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Financial Breakdown */}
              <div className="p-4 bg-slate-50/70 border-t border-slate-100 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>{formatCurrency(order.subtotal || order.total)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>White-Glove Insured Shipping</span>
                  <span className="text-emerald-700 font-semibold">Complimentary ($0.00)</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Estimated VAT / Luxury Duty</span>
                  <span>Included</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 text-slate-900 font-bold text-sm font-serif">
                  <span>Grand Total</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <h3 className="font-serif font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">
                Fulfillment Timeline & Escrow Events
              </h3>
              <div className="space-y-4">
                {(order.timeline || [
                  { status: 'Order Placed', timestamp: `${order.date} 14:10`, description: 'Order confirmed and authorized via Stripe.' },
                  { status: 'Payment Captured', timestamp: `${order.date} 14:10:15`, description: 'Funds secured in platform escrow.' },
                  { status: 'Atelier Processing', timestamp: `${order.date} 16:30`, description: 'Preparing tailored protective packaging.' },
                ]).map((t, idx) => (
                  <div key={idx} className="flex gap-3 text-xs">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-900 mt-1 shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-slate-900">{t.status}</strong>
                        <span className="text-[10px] text-slate-400">{t.timestamp}</span>
                      </div>
                      <p className="text-slate-500 mt-0.5">{t.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Customer & Shipping Details (1 col) */}
          <div className="space-y-6">
            {/* Customer Dossier */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-amber-800" />
                  <h3 className="font-serif font-bold text-slate-900 text-sm">Patron Details</h3>
                </div>
                <Link to={`/admin/users/${order.customerId || 'USR-1001'}`} className="text-amber-800 hover:underline text-[11px] font-semibold">
                  View Profile
                </Link>
              </div>

              <div className="space-y-2">
                <p className="font-bold text-slate-900 text-sm">{order.customerName}</p>
                <p className="text-slate-500">{order.customerEmail}</p>
                <p className="text-slate-500">{order.customerPhone || '+44 20 7946 0912'}</p>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 text-xs">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <MapPin className="w-4 h-4 text-amber-800" />
                <h3 className="font-serif font-bold text-slate-900 text-sm">Delivery Destination</h3>
              </div>

              <p className="text-slate-700 leading-relaxed">
                {typeof order.shippingAddress === 'string'
                  ? order.shippingAddress
                  : `${order.shippingAddress?.street || '14 Mayfair Gardens'}, ${order.shippingAddress?.city || 'London'} ${order.shippingAddress?.postal || 'W1K 6ZA'}, ${order.shippingAddress?.country || 'United Kingdom'}`}
              </p>
            </div>

            {/* Payment & Escrow Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 text-xs">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <CreditCard className="w-4 h-4 text-amber-800" />
                <h3 className="font-serif font-bold text-slate-900 text-sm">Payment Protocol</h3>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Method:</span>
                  <span className="font-semibold text-slate-800">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Escrow Security:</span>
                  <span className="font-bold text-emerald-700">Protected & Held</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Refund Modal */}
        {refundModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-serif font-bold text-slate-900 text-base">
                  Issue Order Refund
                </h3>
                <button
                  onClick={() => setRefundModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-900 cursor-pointer text-xs font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleExecuteRefund} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Refund Amount ($)
                  </label>
                  <input
                    type="number"
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(Number(e.target.value))}
                    max={order.total}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-serif font-bold text-slate-900"
                    required
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Maximum refundable: {formatCurrency(order.total)}
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Refund Reason *
                  </label>
                  <textarea
                    value={refundReason}
                    onChange={(e) => setRefundReason(e.target.value)}
                    placeholder="Enter reason for customer refund..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-900 h-20"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <Button variant="outline" size="sm" type="button" onClick={() => setRefundModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" type="submit" className="bg-rose-600 hover:bg-rose-700">
                    Execute Refund
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

export default AdminOrderDetailPage;
