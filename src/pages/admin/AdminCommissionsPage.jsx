import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Percent,
  Search,
  Filter,
  DollarSign,
  ArrowUpRight,
  CreditCard,
  CheckCircle2,
  Clock,
  Download,
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Input from '../../components/common/Input';
import { formatCurrency } from '../../utils/formatCurrency';
import { selectAdminCommissions } from '../../features/admin/adminSelectors';
import { updateCommissionRateLocal } from '../../features/admin/adminSlice';

export const AdminCommissionsPage = () => {
  const dispatch = useDispatch();
  const commissions = useSelector(selectAdminCommissions);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredCommissions = useMemo(() => {
    return commissions.filter((c) => {
      const matchesSearch =
        c.storeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.sellerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.sellerId?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        selectedStatus === 'all' || c.payoutStatus === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [commissions, searchTerm, selectedStatus]);

  const totalGross = commissions.reduce((acc, c) => acc + (c.totalGrossSales || c.grossAmount || 0), 0);
  const totalRetained = commissions.reduce((acc, c) => acc + (c.platformEarnings || c.platformCommission || 0), 0);
  const totalPendingPayout = commissions.reduce((acc, c) => acc + (c.pendingPayout || 0), 0);

  const handleReleasePayout = (sellerName) => {
    toast.success(`Payout batch for ${sellerName} queued for bank transfer.`);
  };

  const handleExport = () => {
    toast.success('Exporting Commission & Payouts statement (CSV)...');
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block mb-1">
              Platform Take Rates & Payouts
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
              Seller Commissions & Escrow Payouts
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Platform commission ledger, merchant earnings splits, and scheduled disbursement cycles.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="primary" size="sm" leftIcon={Download} onClick={handleExport}>
              Export Statement
            </Button>
          </div>
        </div>

        {/* Financial Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
            <span className="text-xs text-slate-500 font-semibold">Total Gross GMV</span>
            <p className="text-xl sm:text-2xl font-bold font-serif text-slate-900">
              {formatCurrency(totalGross)}
            </p>
            <span className="text-[11px] text-slate-400">Total volume processed</span>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
            <span className="text-xs text-slate-500 font-semibold">Platform Retained Revenue</span>
            <p className="text-xl sm:text-2xl font-bold font-serif text-amber-800">
              {formatCurrency(totalRetained)}
            </p>
            <span className="text-[11px] text-emerald-700 font-semibold">Avg 8-12% Commission</span>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
            <span className="text-xs text-slate-500 font-semibold">Pending Seller Payouts</span>
            <p className="text-xl sm:text-2xl font-bold font-serif text-slate-900">
              {formatCurrency(totalPendingPayout)}
            </p>
            <span className="text-[11px] text-amber-800 font-semibold">Escrow hold active</span>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex-1 max-w-sm">
            <Input
              placeholder="Search by store name, seller ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={Search}
              size="sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Payout Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 cursor-pointer"
            >
              <option value="all">All Payout States</option>
              <option value="Eligible">Eligible for Payout</option>
              <option value="Processing">Processing</option>
              <option value="Hold">Hold / Escrow</option>
            </select>
          </div>
        </div>

        {/* Commissions Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Seller Maison</th>
                  <th className="py-3.5 px-4">Orders</th>
                  <th className="py-3.5 px-4">Gross Sales</th>
                  <th className="py-3.5 px-4">Take Rate</th>
                  <th className="py-3.5 px-4">Platform Retained</th>
                  <th className="py-3.5 px-4">Pending Payout</th>
                  <th className="py-3.5 px-4">Payout Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCommissions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-500">
                      No commission records found.
                    </td>
                  </tr>
                ) : (
                  filteredCommissions.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900">{c.storeName}</p>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {c.sellerId} · {c.sellerName}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {c.ordersCount || 0}
                      </td>
                      <td className="py-3.5 px-4 font-serif font-bold text-slate-900">
                        {formatCurrency(c.totalGrossSales || c.grossAmount || 0)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 font-bold border border-amber-200">
                          {c.commissionRate}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-serif font-bold text-amber-800">
                        {formatCurrency(c.platformEarnings || c.platformCommission || 0)}
                      </td>
                      <td className="py-3.5 px-4 font-serif font-bold text-slate-900">
                        {formatCurrency(c.pendingPayout || 0)}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge
                          variant={
                            c.payoutStatus === 'Eligible'
                              ? 'success'
                              : c.payoutStatus === 'Processing'
                              ? 'info'
                              : 'warning'
                          }
                          size="xs"
                        >
                          {c.payoutStatus}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {c.payoutStatus === 'Eligible' ? (
                          <button
                            onClick={() => handleReleasePayout(c.storeName)}
                            className="px-2.5 py-1 rounded-lg bg-slate-900 text-white font-semibold text-[11px] hover:bg-slate-800 cursor-pointer"
                          >
                            Disburse
                          </button>
                        ) : (
                          <Link to={`/admin/sellers/${c.sellerId}`}>
                            <Button variant="ghost" size="xs">
                              Manage
                            </Button>
                          </Link>
                        )}
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

export default AdminCommissionsPage;
