import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  RotateCcw,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Check,
  X,
  Eye,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Input from '../../components/common/Input';
import { formatCurrency } from '../../utils/formatCurrency';
import { selectAdminRefunds } from '../../features/admin/adminSelectors';
import { updateRefundStatusLocal } from '../../features/admin/adminSlice';

export const AdminRefundsPage = () => {
  const dispatch = useDispatch();
  const refunds = useSelector(selectAdminRefunds);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [inspectRefund, setInspectRefund] = useState(null);

  const filteredRefunds = useMemo(() => {
    return refunds.filter((r) => {
      const matchesSearch =
        r.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.sellerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.reason?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        selectedStatus === 'all' || r.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [refunds, searchTerm, selectedStatus]);

  const handleUpdateStatus = (refundId, nextStatus) => {
    dispatch(updateRefundStatusLocal({ refundId, status: nextStatus }));
    toast.success(`Refund request marked as ${nextStatus}.`);
    if (inspectRefund) setInspectRefund(null);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return <Badge variant="success" size="xs">Completed</Badge>;
      case 'Approved':
      case 'Processing':
        return <Badge variant="info" size="xs">{status}</Badge>;
      case 'Requested':
        return <Badge variant="warning" size="xs">Requested</Badge>;
      case 'Rejected':
        return <Badge variant="danger" size="xs">Rejected</Badge>;
      default:
        return <Badge variant="default" size="xs">{status}</Badge>;
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block mb-1">
              Financial Risk & Dispute Resolution
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
              Refund & Return Requests
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Arbitrate patron return claims, cancellation refunds, and luxury escrow restorations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">
              {filteredRefunds.length} Total Claims
            </span>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex-1 max-w-sm">
            <Input
              placeholder="Search by order, customer, seller, reason..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={Search}
              size="sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Claim Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="Requested">Requested (Action Required)</option>
              <option value="Approved">Approved</option>
              <option value="Processing">Processing</option>
              <option value="Completed">Completed</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Refunds Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Order & Claim ID</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Seller</th>
                  <th className="py-3.5 px-4">Refund Amount</th>
                  <th className="py-3.5 px-4">Reason</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRefunds.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-500">
                      No refund requests found.
                    </td>
                  </tr>
                ) : (
                  filteredRefunds.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono">
                        <p className="font-bold text-slate-900">{r.orderNumber}</p>
                        <span className="text-[10px] text-slate-400">{r.id}</span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        {r.customerName}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium">
                        {r.sellerName}
                      </td>
                      <td className="py-3.5 px-4 font-serif font-bold text-slate-900">
                        {formatCurrency(r.amount)}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 max-w-[200px] truncate" title={r.reason}>
                        {r.reason}
                      </td>
                      <td className="py-3.5 px-4">{getStatusBadge(r.status)}</td>
                      <td className="py-3.5 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                        {r.date}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setInspectRefund(r)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
                            title="Inspect Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {r.status === 'Requested' && (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(r.id, 'Approved')}
                                className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[11px] font-semibold hover:bg-emerald-100 cursor-pointer"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(r.id, 'Rejected')}
                                className="px-2 py-1 bg-rose-50 text-rose-700 rounded-lg text-[11px] font-semibold hover:bg-rose-100 cursor-pointer"
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {r.status === 'Approved' && (
                            <button
                              onClick={() => handleUpdateStatus(r.id, 'Completed')}
                              className="px-2 py-1 bg-slate-900 text-white rounded-lg text-[11px] font-semibold hover:bg-slate-800 cursor-pointer"
                            >
                              Complete Payout
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Inspect Modal */}
        {inspectRefund && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-150 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-serif font-bold text-slate-900 text-base">
                  Refund Dispute Case: {inspectRefund.id}
                </h3>
                <button
                  onClick={() => setInspectRefund(null)}
                  className="p-1 text-slate-400 hover:text-slate-900 cursor-pointer font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Order Number:</span>
                  <span className="font-mono font-bold text-slate-900">{inspectRefund.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Claimant Patron:</span>
                  <span className="font-bold text-slate-900">{inspectRefund.customerName} ({inspectRefund.customerEmail})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Fulfilling Seller:</span>
                  <span className="font-bold text-slate-900">{inspectRefund.sellerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Dispute Amount:</span>
                  <span className="font-serif font-bold text-slate-900 text-sm">
                    {formatCurrency(inspectRefund.amount)}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="font-bold text-slate-700 block">Stated Reason:</span>
                <p className="text-slate-600">{inspectRefund.reason}</p>
                {inspectRefund.notes && (
                  <p className="text-[11px] text-amber-800 pt-1 font-medium">
                    Sentinel Audit Note: {inspectRefund.notes}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <Button variant="outline" size="sm" onClick={() => setInspectRefund(null)}>
                  Close
                </Button>
                {inspectRefund.status === 'Requested' && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-rose-600 hover:bg-rose-50"
                      onClick={() => handleUpdateStatus(inspectRefund.id, 'Rejected')}
                    >
                      Reject Claim
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleUpdateStatus(inspectRefund.id, 'Approved')}
                    >
                      Approve Refund
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminRefundsPage;
