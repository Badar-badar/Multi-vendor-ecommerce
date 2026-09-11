import { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  RotateCcw,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  Package,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  Eye,
  AlertCircle,
  FileText,
} from 'lucide-react';
import toast from 'react-hot-toast';
import AccountLayout from '../../components/account/AccountLayout';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import ConfirmModal from '../../components/common/ConfirmModal';
import { selectMyReturns } from '../../features/returns/returnSelectors';
import { cancelLocalReturn } from '../../features/returns/returnSlice';
import { selectOrders } from '../../features/orders/orderSelectors';
import { formatCurrency } from '../../utils/formatCurrency';
import ReturnRequestModal from '../../components/orders/ReturnRequestModal';

const STATUS_TABS = ['All', 'Under Review', 'Approved', 'Refunded', 'Cancelled'];

export const AccountReturnsPage = () => {
  const dispatch = useDispatch();
  const returns = useSelector(selectMyReturns);
  const orders = useSelector(selectOrders) || [];

  const [activeTab, setActiveTab] = useState('All');
  const [selectedReturnDetail, setSelectedReturnDetail] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [returnRequestOrder, setReturnRequestOrder] = useState(null);

  // Delivered orders that are eligible for a return request
  const deliveredOrders = useMemo(() => {
    return orders.filter((o) => o.status === 'Delivered');
  }, [orders]);

  const filteredReturns = useMemo(() => {
    if (activeTab === 'All') return returns;
    return returns.filter(
      (r) => r.status?.toLowerCase() === activeTab.toLowerCase()
    );
  }, [returns, activeTab]);

  const handleConfirmCancelReturn = () => {
    if (!cancelTarget) return;
    dispatch(cancelLocalReturn(cancelTarget.id));
    toast.success(`Return request #${cancelTarget.id} has been withdrawn.`);
    setCancelTarget(null);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Refunded':
      case 'Completed':
        return <Badge variant="success" size="xs">Refunded</Badge>;
      case 'Approved':
      case 'Pickup Scheduled':
      case 'Item Received':
        return <Badge variant="accent" size="xs">{status}</Badge>;
      case 'Under Review':
      case 'Requested':
        return <Badge variant="warning" size="xs">{status}</Badge>;
      case 'Rejected':
      case 'Cancelled':
        return <Badge variant="danger" size="xs">{status}</Badge>;
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
              Sovereign Returns & Concierge Exchanges ({returns.length})
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              Track atelier inspection status, manage complimentary courier pickups, and review escrow refunds.
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            leftIcon={Plus}
            onClick={() => {
              if (deliveredOrders.length > 0) {
                setReturnRequestOrder(deliveredOrders[0]);
              } else if (orders.length > 0) {
                setReturnRequestOrder(orders[0]);
              } else {
                toast.error('No delivered acquisitions eligible for return request.');
              }
            }}
          >
            Request New Return
          </Button>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {STATUS_TABS.map((tab) => {
            const isActive = activeTab === tab;
            const count =
              tab === 'All'
                ? returns.length
                : returns.filter((r) => r.status?.toLowerCase() === tab.toLowerCase()).length;

            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-surface text-text-muted border border-border hover:text-text-main hover:bg-surface-muted'
                }`}
              >
                <span>{tab}</span>
                <span className={`ml-1.5 text-[10px] ${isActive ? 'text-white/80' : 'text-text-subtle'}`}>
                  ({count})
                </span>
              </button>
            );
          })}
        </div>

        {/* Returns List */}
        {filteredReturns.length === 0 ? (
          <div className="bg-surface rounded-2xl border border-border p-12 text-center space-y-4">
            <div className="w-12 h-12 bg-surface-muted rounded-full flex items-center justify-center mx-auto text-text-muted">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-base text-text-main">
              No Return Requests Found
            </h3>
            <p className="text-xs text-text-muted max-w-sm mx-auto">
              You currently have no active or completed return requests under &ldquo;{activeTab}&rdquo;.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReturns.map((ret) => {
              const isCancellable = ret.status === 'Requested' || ret.status === 'Under Review';

              return (
                <div
                  key={ret.id}
                  className="bg-surface rounded-2xl border border-border overflow-hidden shadow-subtle p-5 space-y-4 hover:border-border-strong transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-border">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-text-main">
                          #{ret.id}
                        </span>
                        {getStatusBadge(ret.status)}
                        <span className="text-xs text-text-muted">
                          • Order: <strong className="text-text-main">{ret.orderNumber || ret.orderId}</strong>
                        </span>
                      </div>
                      <p className="text-[11px] text-text-muted">
                        Requested on {ret.requestDate} • Reason:{' '}
                        <strong className="text-text-main">{ret.reason}</strong>
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] text-text-muted block">Refund Valuation</span>
                      <span className="font-serif font-bold text-accent text-base">
                        {formatCurrency(ret.refundAmount || 0)}
                      </span>
                    </div>
                  </div>

                  {/* Return Items List */}
                  <div className="space-y-2">
                    {ret.items?.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image || 'https://images.unsplash.com/photo-1544441893-675973e31985?w=150'}
                            alt={item.name}
                            className="w-10 h-10 object-cover rounded-lg border border-border"
                          />
                          <div>
                            <p className="font-serif font-bold text-text-main">{item.name}</p>
                            <p className="text-[10px] text-text-muted">
                              Crafted by {item.brand || item.sellerName || 'Atelier Maison'} • Qty: {item.quantity || 1}
                            </p>
                          </div>
                        </div>
                        <span className="font-serif font-semibold text-text-main">
                          {formatCurrency(item.price || 0)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Seller Response Note if present */}
                  {ret.sellerResponse && (
                    <div className="p-3 bg-accent-light/40 border border-accent/20 rounded-xl text-xs text-accent-dark">
                      <strong className="block text-[10px] uppercase font-bold tracking-wider mb-0.5">
                        Atelier Curator Response:
                      </strong>
                      <p>{ret.sellerResponse}</p>
                    </div>
                  )}

                  {/* Footer Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-border text-xs">
                    <span className="text-[11px] text-text-muted">
                      Settlement Method: <strong>{ret.refundMethod || 'Original Payment'}</strong>
                    </span>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="xs"
                        leftIcon={Eye}
                        onClick={() => setSelectedReturnDetail(ret)}
                      >
                        Inspect Timeline
                      </Button>

                      {isCancellable && (
                        <button
                          type="button"
                          onClick={() => setCancelTarget(ret)}
                          className="px-2.5 py-1 text-xs text-rose-600 hover:bg-rose-50 rounded-lg font-semibold cursor-pointer"
                        >
                          Withdraw Request
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Detailed Timeline Inspection Modal */}
        {selectedReturnDetail && (
          <Modal
            isOpen={Boolean(selectedReturnDetail)}
            onClose={() => setSelectedReturnDetail(null)}
            title={`Return Inspection #${selectedReturnDetail.id}`}
            size="md"
          >
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-surface-muted rounded-xl border border-border flex justify-between items-center">
                <div>
                  <span className="text-[10px] uppercase font-bold text-text-muted block">Current Status</span>
                  <div className="mt-1">{getStatusBadge(selectedReturnDetail.status)}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-text-muted block">Refund Total</span>
                  <span className="font-serif font-bold text-accent text-sm">
                    {formatCurrency(selectedReturnDetail.refundAmount || 0)}
                  </span>
                </div>
              </div>

              {/* Reason & Notes */}
              <div className="space-y-1 p-3 rounded-xl border border-border bg-surface">
                <span className="text-[10px] uppercase font-bold text-text-muted block">Rationale & Patron Notes</span>
                <p className="font-bold text-text-main">{selectedReturnDetail.reason}</p>
                <p className="text-text-muted text-[11px] pt-1">{selectedReturnDetail.description}</p>
              </div>

              {/* Step Timeline */}
              <div className="space-y-3 pt-2">
                <span className="text-[10px] uppercase font-bold text-text-muted block">
                  Atelier Fulfillment Milestones
                </span>
                <div className="space-y-3">
                  {selectedReturnDetail.timeline?.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 mt-0.5 ${
                          step.completed
                            ? 'bg-accent text-white'
                            : 'bg-surface-muted text-text-muted border border-border'
                        }`}
                      >
                        {step.completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                      </div>
                      <div>
                        <p className={`font-semibold ${step.completed ? 'text-text-main' : 'text-text-muted'}`}>
                          {step.title}
                        </p>
                        <p className="text-[10px] text-text-muted">{step.description}</p>
                        <span className="font-mono text-[9px] text-text-subtle">{step.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-border">
                <Button variant="outline" size="sm" onClick={() => setSelectedReturnDetail(null)}>
                  Close
                </Button>
              </div>
            </div>
          </Modal>
        )}

        {/* New Return Request Modal Wizard */}
        <ReturnRequestModal
          isOpen={Boolean(returnRequestOrder)}
          onClose={() => setReturnRequestOrder(null)}
          order={returnRequestOrder}
        />

        {/* Withdraw Return Request Confirmation Modal */}
        <ConfirmModal
          isOpen={Boolean(cancelTarget)}
          onClose={() => setCancelTarget(null)}
          onConfirm={handleConfirmCancelReturn}
          title="Withdraw Return Request?"
          message={`Are you sure you wish to cancel return request #${cancelTarget?.id}? The acquisition will remain marked as delivered.`}
          confirmText="Withdraw Request"
          variant="danger"
        />
      </div>
    </AccountLayout>
  );
};

export default AccountReturnsPage;
