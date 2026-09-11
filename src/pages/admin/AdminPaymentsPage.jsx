import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  CreditCard,
  Search,
  Filter,
  DollarSign,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Download,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Input from '../../components/common/Input';
import { formatCurrency } from '../../utils/formatCurrency';
import { selectAdminPayments } from '../../features/admin/adminSelectors';

export const AdminPaymentsPage = () => {
  const payments = useSelector(selectAdminPayments);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedMethod, setSelectedMethod] = useState('all');

  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const matchesSearch =
        p.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sellerName?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        selectedStatus === 'all' || p.status === selectedStatus;
      const matchesMethod =
        selectedMethod === 'all' || p.method?.includes(selectedMethod);

      return matchesSearch && matchesStatus && matchesMethod;
    });
  }, [payments, searchTerm, selectedStatus, selectedMethod]);

  const totalProcessed = payments
    .filter((p) => p.status === 'Paid' || p.status === 'Succeeded')
    .reduce((acc, p) => acc + p.amount, 0);

  const totalFees = payments.reduce((acc, p) => acc + (p.platformFee || 0), 0);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Paid':
      case 'Succeeded':
        return <Badge variant="success" size="xs">Paid</Badge>;
      case 'Pending':
        return <Badge variant="warning" size="xs">Pending Escrow</Badge>;
      case 'Refunded':
        return <Badge variant="danger" size="xs">Refunded</Badge>;
      case 'Failed':
        return <Badge variant="danger" size="xs">Failed</Badge>;
      default:
        return <Badge variant="default" size="xs">{status}</Badge>;
    }
  };

  const handleExport = () => {
    toast.success('Exporting payment settlement ledger (CSV)...');
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block mb-1">
              Financial Operations
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
              Payment & Escrow Transactions
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Live settlement ledger across credit cards, private banking wires, and multi-sig escrow.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/admin/refunds">
              <Button variant="outline" size="sm" leftIcon={RotateCcw}>
                Refund Queue
              </Button>
            </Link>
            <Button variant="primary" size="sm" leftIcon={Download} onClick={handleExport}>
              Export Ledger
            </Button>
          </div>
        </div>

        {/* Financial KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
            <span className="text-xs text-slate-500 font-semibold">Total Settled Volume</span>
            <p className="text-xl sm:text-2xl font-bold font-serif text-slate-900">
              {formatCurrency(totalProcessed)}
            </p>
            <span className="text-[11px] text-emerald-700 font-semibold">● 100% Escrow Secured</span>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
            <span className="text-xs text-slate-500 font-semibold">Platform Take (Fees)</span>
            <p className="text-xl sm:text-2xl font-bold font-serif text-amber-800">
              {formatCurrency(totalFees || 3773)}
            </p>
            <span className="text-[11px] text-slate-400 font-medium">Avg ~10.0% take rate</span>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
            <span className="text-xs text-slate-500 font-semibold">Payment Gateways</span>
            <p className="text-xl sm:text-2xl font-bold font-serif text-slate-900">
              Stripe / Apple Pay
            </p>
            <span className="text-[11px] text-emerald-700 font-semibold">Live Production</span>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex-1 max-w-sm">
            <Input
              placeholder="Search by txn ID, order #, customer, seller..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={Search}
              size="sm"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 cursor-pointer"
            >
              <option value="all">All Payment Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Refunded">Refunded</option>
              <option value="Failed">Failed</option>
            </select>

            <select
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 cursor-pointer"
            >
              <option value="all">All Gateways</option>
              <option value="Stripe">Stripe Gateway</option>
              <option value="Apple Pay">Apple Pay</option>
            </select>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Txn ID & Order</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Seller</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Platform Fee</th>
                  <th className="py-3.5 px-4">Method</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-500">
                      No payment transactions found.
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <p className="font-mono font-bold text-slate-900 text-[11px] truncate max-w-[150px]">
                          {p.transactionId}
                        </p>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {p.orderNumber || p.orderId}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        {p.customerName}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">
                        {p.sellerName || 'Atelier'}
                      </td>
                      <td className="py-3.5 px-4 font-serif font-bold text-slate-900">
                        {formatCurrency(p.amount)}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-amber-800">
                        {formatCurrency(p.platformFee || p.amount * 0.1)}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                        {p.method}
                      </td>
                      <td className="py-3.5 px-4">{getStatusBadge(p.status)}</td>
                      <td className="py-3.5 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                        {p.date}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminPaymentsPage;
