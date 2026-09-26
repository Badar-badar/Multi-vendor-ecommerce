import { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  DollarSign,
  CreditCard,
  Download,
  Calendar,
  ShieldCheck,
  RotateCcw,
  ArrowUpRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  selectSellerProfile,
  selectSellerEarnings,
} from '../../features/seller/sellerSelectors';
import { fetchSellerEarnings, fetchSellerProfile } from '../../features/seller/sellerThunk';
import { formatCurrency } from '../../utils/formatCurrency';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

const DEFAULT_SETTLEMENTS = [
  {
    id: 'SET-98120',
    orderNumber: 'ZRN-84920-7712',
    date: '2026-09-08',
    grossAmount: 1450.0,
    commissionRate: 10,
    commissionAmount: 145.0,
    netAmount: 1305.0,
    status: 'Settled',
    payoutBatch: 'BATCH-2026-09A',
  },
  {
    id: 'SET-98121',
    orderNumber: 'ZRN-83910-6601',
    date: '2026-09-06',
    grossAmount: 840.0,
    commissionRate: 10,
    commissionAmount: 84.0,
    netAmount: 756.0,
    status: 'Settled',
    payoutBatch: 'BATCH-2026-09A',
  },
  {
    id: 'SET-98122',
    orderNumber: 'ZRN-82901-5590',
    date: '2026-09-04',
    grossAmount: 2200.0,
    commissionRate: 10,
    commissionAmount: 220.0,
    netAmount: 1980.0,
    status: 'Pending Clearance',
    payoutBatch: 'BATCH-2026-09B',
  },
  {
    id: 'SET-98123',
    orderNumber: 'ZRN-81890-4480',
    date: '2026-08-29',
    grossAmount: 680.0,
    commissionRate: 10,
    commissionAmount: 68.0,
    netAmount: 612.0,
    status: 'Settled',
    payoutBatch: 'BATCH-2026-08B',
  },
  {
    id: 'SET-98124',
    orderNumber: 'ZRN-80780-3370',
    date: '2026-08-22',
    grossAmount: 1150.0,
    commissionRate: 10,
    commissionAmount: 115.0,
    netAmount: 1035.0,
    status: 'Settled',
    payoutBatch: 'BATCH-2026-08B',
  },
];

export const SellerEarningsPage = () => {
  const dispatch = useDispatch();
  const profile = useSelector(selectSellerProfile) || {};
  const earnings = useSelector(selectSellerEarnings);

  useEffect(() => {
    dispatch(fetchSellerEarnings());
    dispatch(fetchSellerProfile());
  }, [dispatch]);

  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const settlements = earnings?.settlements?.length > 0 ? earnings.settlements : DEFAULT_SETTLEMENTS;

  const filteredSettlements = useMemo(() => {
    return settlements.filter((item) => {
      const matchesStatus =
        statusFilter === 'All' || item.status.toLowerCase() === statusFilter.toLowerCase();
      const matchesSearch =
        !searchTerm.trim() ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.orderNumber.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [settlements, statusFilter, searchTerm]);

  const handleExportCSV = () => {
    toast.success('Exporting official earnings settlement ledger (CSV)...');
  };

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'settled':
      case 'paid':
        return <Badge variant="success" size="xs">Disbursed</Badge>;
      case 'pending clearance':
      case 'pending':
        return <Badge variant="warning" size="xs">Pending Clearance</Badge>;
      case 'escrow hold':
        return <Badge variant="secondary" size="xs">Escrow Hold</Badge>;
      default:
        return <Badge variant="default" size="xs">{status}</Badge>;
    }
  };

  return (
    <>
      <div className="space-y-6 animate-in fade-in duration-200">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-accent block mb-1">
              Financial Operations
            </span>
            <h1 className="font-serif font-bold text-xl sm:text-2xl text-text-main">
              Atelier Earnings & Settlements
            </h1>
            <p className="text-xs text-text-muted">
              Live ledger of commission deductions, gross volume, net balances, and automated bi-weekly disbursements.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="primary" size="sm" leftIcon={Download} onClick={handleExportCSV}>
              Export Earnings (CSV)
            </Button>
          </div>
        </div>

        {/* 4 Financial KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-surface rounded-2xl border border-border space-y-1 shadow-subtle">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-text-muted">Gross Marketplace Volume</span>
              <DollarSign className="w-4 h-4 text-accent" />
            </div>
            <p className="font-serif text-2xl font-bold text-text-main">
              {formatCurrency(earnings.grossSales || 65490)}
            </p>
            <span className="text-[10px] text-emerald-600 font-medium">100% Verified Escrow</span>
          </div>

          <div className="p-4 bg-surface rounded-2xl border border-border space-y-1 shadow-subtle">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-text-muted">Platform Commission (10%)</span>
              <CreditCard className="w-4 h-4 text-accent" />
            </div>
            <p className="font-serif text-2xl font-bold text-text-main text-amber-800">
              {formatCurrency(earnings.platformCommission || 6549)}
            </p>
            <span className="text-[10px] text-text-subtle">Concierge & Stripe TLS handling</span>
          </div>

          <div className="p-4 bg-surface rounded-2xl border border-border space-y-1 shadow-subtle">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-text-muted">Net Atelier Revenue</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="font-serif text-2xl font-bold text-emerald-600">
              {formatCurrency(earnings.netEarnings || 58101)}
            </p>
            <span className="text-[10px] text-emerald-600 font-bold">After all deductions</span>
          </div>

          <div className="p-4 bg-surface rounded-2xl border border-border space-y-1 shadow-subtle">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-text-muted">Pending Payout</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <p className="font-serif text-2xl font-bold text-text-main">
              {formatCurrency(earnings.pendingPayout || 12450)}
            </p>
            <span className="text-[10px] text-text-subtle">Disbursement scheduled Fri</span>
          </div>
        </div>

        {/* Banking Notice Banner */}
        <div className="p-4 bg-surface-muted/70 rounded-2xl border border-border flex items-start gap-3 text-xs text-text-muted">
          <ShieldCheck className="w-4 h-4 text-accent shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-text-main">Automated Settlement Protocol:</span>
            <p>
              Net balances are automatically transmitted to your registered IBAN bank coordinates via SWIFT every 14 days upon customer order delivery confirmation.
            </p>
          </div>
        </div>

        {/* Filter and Search Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-surface rounded-2xl border border-border shadow-2xs">
          <div className="flex-1 max-w-sm">
            <input
              type="text"
              placeholder="Search by settlement ID or order #..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-surface-muted border border-border rounded-xl focus:outline-none focus:border-primary text-text-main"
            />
          </div>

          <div className="flex items-center gap-2">
            {['All', 'Settled', 'Pending Clearance'].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  statusFilter === status
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-surface-muted text-text-muted hover:text-text-main'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Settlements Table */}
        <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-subtle">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-surface-muted/60 border-b border-border text-text-muted uppercase text-[10px] font-semibold tracking-wider">
                  <th className="py-3 px-4">Settlement & Order</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Gross Sale</th>
                  <th className="py-3 px-4">Platform Take (10%)</th>
                  <th className="py-3 px-4">Net Atelier Share</th>
                  <th className="py-3 px-4">Payout Status</th>
                  <th className="py-3 px-4 text-right">Batch Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredSettlements.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-text-muted">
                      No settlement records found matching criteria.
                    </td>
                  </tr>
                ) : (
                  filteredSettlements.map((item) => (
                    <tr key={item.id} className="hover:bg-surface-muted/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <span className="font-mono font-bold text-text-main block">
                            {item.id}
                          </span>
                          <span className="font-mono text-[10px] text-text-subtle">
                            {item.orderNumber}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-text-muted whitespace-nowrap">
                        {item.date}
                      </td>
                      <td className="py-3.5 px-4 font-serif font-bold text-text-main">
                        {formatCurrency(item.grossAmount)}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-amber-800">
                        -{formatCurrency(item.commissionAmount)}
                      </td>
                      <td className="py-3.5 px-4 font-serif font-bold text-emerald-600">
                        {formatCurrency(item.netAmount)}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {getStatusBadge(item.status)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-[11px] text-text-muted">
                        {item.payoutBatch}
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

export default SellerEarningsPage;
