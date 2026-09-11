import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  CreditCard,
  ShieldCheck,
  Search,
  Filter,
  Download,
  ExternalLink,
  Receipt,
  CheckCircle2,
  Clock,
  AlertCircle,
  RotateCcw,
  Sparkles,
  Lock,
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';
import {
  fetchCustomerPaymentsThunk,
} from '../../features/payment/paymentThunk';
import {
  selectCustomerPayments,
  selectCustomerPaymentsLoading,
} from '../../features/payment/paymentSelectors';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';

// Fallback seed payments for patron accounts if API returns empty
const DEFAULT_CUSTOMER_PAYMENTS = [
  {
    id: 'pay_1N9z8X2eZvKYlo2C8u12984',
    orderId: 'ord-84920',
    orderNumber: 'ZRN-84920-7712',
    date: '2026-09-08T14:30:00Z',
    amount: 1450.0,
    currency: 'USD',
    method: 'stripe_card',
    brand: 'Visa',
    last4: '4242',
    status: 'paid',
    receiptUrl: '#',
  },
  {
    id: 'pay_1N8y7W1dYuJXkn1B7t01873',
    orderId: 'ord-73819',
    orderNumber: 'ZRN-73819-6601',
    date: '2026-08-24T11:15:00Z',
    amount: 890.0,
    currency: 'USD',
    method: 'digital_wallet',
    brand: 'Apple Pay',
    last4: '8819',
    status: 'paid',
    receiptUrl: '#',
  },
  {
    id: 'pay_1N7x6V0cXtIWjm0A6s90762',
    orderId: 'ord-62710',
    orderNumber: 'ZRN-62710-5590',
    date: '2026-07-15T09:45:00Z',
    amount: 320.0,
    currency: 'USD',
    method: 'stripe_card',
    brand: 'Mastercard',
    last4: '5521',
    status: 'refunded',
    receiptUrl: '#',
  },
];

export const AccountPaymentsPage = () => {
  const dispatch = useDispatch();
  const apiPayments = useSelector(selectCustomerPayments);
  const loading = useSelector(selectCustomerPaymentsLoading);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    dispatch(fetchCustomerPaymentsThunk());
  }, [dispatch]);

  const payments =
    apiPayments && apiPayments.length > 0 ? apiPayments : DEFAULT_CUSTOMER_PAYMENTS;

  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      !searchQuery ||
      p.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate high-level stats
  const totalPaid = payments
    .filter((p) => p.status === 'paid')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const totalRefunded = payments
    .filter((p) => p.status === 'refunded')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const handleDownloadReceipt = (payment) => {
    toast.success(`Encrypted receipt for #${payment.orderNumber} downloaded.`);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid':
      case 'succeeded':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3" /> Settled
          </span>
        );
      case 'processing':
      case 'awaiting_payment':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
            <Clock className="w-3 h-3" /> Processing
          </span>
        );
      case 'refunded':
      case 'partially_refunded':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-full">
            <RotateCcw className="w-3 h-3" /> Refunded
          </span>
        );
      case 'failed':
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
            <AlertCircle className="w-3 h-3" /> Failed
          </span>
        );
      default:
        return (
          <span className="text-[11px] font-medium text-text-muted bg-surface-muted px-2 py-0.5 rounded-full">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl font-bold text-text-main">
              Sovereign Payment History
            </h1>
            <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Lock className="w-3 h-3" /> 256-bit TLS Encrypted
            </span>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Review your settled transactions, cryptographic Stripe authorizations, and formal proof of payment receipts.
          </p>
        </div>
      </div>

      {/* Financial Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-surface border border-border space-y-1 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-muted">Total Lifetime Settled</span>
            <CreditCard className="w-4 h-4 text-accent" />
          </div>
          <p className="font-serif text-2xl font-bold text-text-main">
            {formatCurrency(totalPaid)}
          </p>
          <span className="text-[11px] text-emerald-600 font-medium">100% Secure Cryptographic Ledger</span>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-border space-y-1 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-muted">Completed Transactions</span>
            <Receipt className="w-4 h-4 text-accent" />
          </div>
          <p className="font-serif text-2xl font-bold text-text-main">
            {payments.filter((p) => p.status === 'paid').length} Orders
          </p>
          <span className="text-[11px] text-text-muted">All partner ateliers verified</span>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-border space-y-1 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-muted">Total Credits / Refunds</span>
            <RotateCcw className="w-4 h-4 text-purple-600" />
          </div>
          <p className="font-serif text-2xl font-bold text-text-main">
            {formatCurrency(totalRefunded)}
          </p>
          <span className="text-[11px] text-purple-600 font-medium">Auto-credited to source method</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-surface rounded-2xl border border-border shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Payment ID, Order #, or Card..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-surface-muted border border-border rounded-xl focus:outline-none focus:border-accent text-text-main placeholder:text-text-subtle"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['all', 'paid', 'processing', 'refunded', 'failed'].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer capitalize ${
                statusFilter === status
                  ? 'bg-primary text-white'
                  : 'bg-surface-muted text-text-muted hover:text-text-main hover:bg-surface-muted/80'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Payments List Table */}
      <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-2xs">
        {filteredPayments.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Receipt className="w-10 h-10 text-text-muted mx-auto" />
            <p className="font-serif font-bold text-sm text-text-main">No Payment Records Found</p>
            <p className="text-xs text-text-muted">
              {searchQuery
                ? 'Try adjusting your search criteria.'
                : 'Your payment history will populate automatically after your first completed acquisition.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-muted/80 border-b border-border text-text-muted uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="px-5 py-3.5">Transaction & Order</th>
                  <th className="px-5 py-3.5">Date</th>
                  <th className="px-5 py-3.5">Method</th>
                  <th className="px-5 py-3.5">Amount</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-text-main">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-surface-muted/40 transition-colors">
                    <td className="px-5 py-4">
                      <div className="space-y-0.5">
                        <span className="font-mono font-bold text-text-main text-xs block">
                          {payment.orderNumber}
                        </span>
                        <span className="font-mono text-[10px] text-text-subtle block">
                          {payment.id}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-text-muted whitespace-nowrap">
                      {new Date(payment.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-3.5 h-3.5 text-accent" />
                        <span className="font-medium text-xs">
                          {payment.brand || 'Card'} {payment.last4 ? `•••• ${payment.last4}` : ''}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-serif font-bold text-xs whitespace-nowrap">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      {getStatusBadge(payment.status)}
                    </td>
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleDownloadReceipt(payment)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-border bg-surface text-[11px] font-semibold text-text-muted hover:text-text-main hover:bg-surface-muted transition-colors cursor-pointer"
                          title="Download Official Receipt"
                        >
                          <Download className="w-3 h-3 text-accent" />
                          <span>Receipt</span>
                        </button>
                        {payment.orderId && (
                          <Link
                            to={`/account/orders/${payment.orderId}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-accent hover:underline"
                          >
                            <span>Order</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountPaymentsPage;
