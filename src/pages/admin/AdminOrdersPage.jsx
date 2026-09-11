import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingCart,
  Search,
  Filter,
  Eye,
  CreditCard,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  Calendar,
  ExternalLink,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Input from '../../components/common/Input';
import { formatCurrency } from '../../utils/formatCurrency';
import { selectAdminOrders, selectAdminSellers } from '../../features/admin/adminSelectors';

export const AdminOrdersPage = () => {
  const orders = useSelector(selectAdminOrders);
  const sellers = useSelector(selectAdminSellers);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState('all');
  const [selectedSeller, setSelectedSeller] = useState('all');

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        o.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        selectedStatus === 'all' || o.fulfillmentStatus === selectedStatus;
      const matchesPayment =
        selectedPayment === 'all' || o.paymentStatus === selectedPayment;
      const matchesSeller =
        selectedSeller === 'all' || o.seller === selectedSeller;

      return matchesSearch && matchesStatus && matchesPayment && matchesSeller;
    });
  }, [orders, searchTerm, selectedStatus, selectedPayment, selectedSeller]);

  const getOrderStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return <Badge variant="success" size="xs">Delivered</Badge>;
      case 'Processing':
        return <Badge variant="info" size="xs">Processing</Badge>;
      case 'In Transit':
        return <Badge variant="info" size="xs">In Transit</Badge>;
      case 'Pending':
        return <Badge variant="warning" size="xs">Pending</Badge>;
      case 'Cancelled':
      case 'Refunded':
        return <Badge variant="danger" size="xs">{status}</Badge>;
      default:
        return <Badge variant="default" size="xs">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status) => {
    switch (status) {
      case 'Paid':
        return <span className="text-[11px] font-bold text-emerald-700">● Paid</span>;
      case 'Refunded':
        return <span className="text-[11px] font-bold text-rose-600">● Refunded</span>;
      case 'Pending':
        return <span className="text-[11px] font-bold text-amber-600">● Escrow</span>;
      default:
        return <span className="text-[11px] font-medium text-slate-500">{status}</span>;
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block mb-1">
              Order Fulfillment Oversight
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
              Marketplace Order Oversight
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Monitor multi-vendor transactions, fulfillment tracking, and dispute statuses.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">
              {filteredOrders.length} Orders
            </span>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Input
              placeholder="Search by order #, customer, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={Search}
              size="sm"
            />

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 cursor-pointer"
            >
              <option value="all">All Fulfillment Statuses</option>
              <option value="Processing">Processing</option>
              <option value="In Transit">In Transit</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            <select
              value={selectedPayment}
              onChange={(e) => setSelectedPayment(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 cursor-pointer"
            >
              <option value="all">All Payment Statuses</option>
              <option value="Paid">Paid (Escrow Held)</option>
              <option value="Refunded">Refunded</option>
            </select>

            <select
              value={selectedSeller}
              onChange={(e) => setSelectedSeller(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 cursor-pointer"
            >
              <option value="all">All Sellers</option>
              {sellers.map((s) => (
                <option key={s.id} value={s.storeName}>
                  {s.storeName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          {/* Desktop */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Order ID</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Seller Maison</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4">Fulfillment</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-500">
                      No orders found matching your filters.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {order.orderNumber || order.id}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900">{order.customerName}</p>
                        <p className="text-[10px] text-slate-400">{order.customerEmail}</p>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        {order.seller}
                      </td>
                      <td className="py-3.5 px-4 font-serif font-bold text-slate-900">
                        {formatCurrency(order.total)}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          {getPaymentStatusBadge(order.paymentStatus)}
                          <p className="text-[10px] text-slate-400">{order.paymentMethod}</p>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        {getOrderStatusBadge(order.fulfillmentStatus)}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                        {order.date}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link to={`/admin/orders/${order.id}`}>
                          <Button variant="outline" size="xs" leftIcon={Eye}>
                            Inspect
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Responsive Cards */}
          <div className="lg:hidden divide-y divide-slate-100 p-4 space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="pt-3 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-slate-900">
                    {order.orderNumber || order.id}
                  </span>
                  {getOrderStatusBadge(order.fulfillmentStatus)}
                </div>

                <div className="flex justify-between text-xs text-slate-600">
                  <span>Customer: <strong className="text-slate-900">{order.customerName}</strong></span>
                  <span className="font-serif font-bold text-slate-900">{formatCurrency(order.total)}</span>
                </div>

                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Seller: {order.seller}</span>
                  <span>{order.date}</span>
                </div>

                <div className="pt-1">
                  <Link to={`/admin/orders/${order.id}`} className="block">
                    <Button variant="outline" size="xs" className="w-full">
                      Inspect Full Order
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminOrdersPage;
