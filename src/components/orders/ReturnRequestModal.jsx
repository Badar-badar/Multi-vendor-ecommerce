import { useState } from 'react';
import {
  RotateCcw,
  CheckCircle2,
  Upload,
  X,
  AlertCircle,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  FileText,
  Image as ImageIcon,
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { addLocalReturn } from '../../features/returns/returnSlice';
import { requestReturnAction } from '../../features/orders/orderSlice';
import { formatCurrency } from '../../utils/formatCurrency';

const RETURN_REASONS = [
  'Bespoke Sizing / Fit discrepancy',
  'Artisan finishing irregularity or defect',
  'Creation does not match atelier specifications',
  'Private Gift exchange / Duplicate item',
  'Arrived past required event date',
  'Other concierge rationale',
];

export const ReturnRequestModal = ({ isOpen, onClose, order }) => {
  const dispatch = useDispatch();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedItemIds, setSelectedItemIds] = useState(
    order?.items?.[0] ? [order.items[0].id || 'item-1'] : []
  );
  const [selectedReason, setSelectedReason] = useState(RETURN_REASONS[0]);
  const [description, setDescription] = useState('');
  const [evidenceImages, setEvidenceImages] = useState([]);
  const [refundMethod, setRefundMethod] = useState('Original Payment Method');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!order) return null;

  const handleToggleItem = (itemId) => {
    setSelectedItemIds((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const fakeUrl = URL.createObjectURL(file);
      setEvidenceImages((prev) => [...prev, fakeUrl]);
      toast.success('Evidence photo attached.');
    }
  };

  const handleRemoveImage = (index) => {
    setEvidenceImages((prev) => prev.filter((_, i) => i !== index));
  };

  const selectedItems = order.items?.filter((item) =>
    selectedItemIds.includes(item.id)
  ) || [];

  const estimatedRefundTotal = selectedItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );

  const handleSubmit = async () => {
    if (selectedItemIds.length === 0) {
      toast.error('Please select at least one creation to return.');
      return;
    }
    if (!description.trim()) {
      toast.error('Please provide a brief explanation for the atelier curators.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API submission delay
      await new Promise((res) => setTimeout(res, 800));

      const returnPayload = {
        orderId: order.id,
        orderNumber: order.orderNumber,
        items: selectedItems,
        reason: selectedReason,
        description,
        images: evidenceImages,
        refundMethod,
        refundAmount: estimatedRefundTotal,
      };

      dispatch(addLocalReturn(returnPayload));
      dispatch(
        requestReturnAction({
          orderId: order.id,
          reason: selectedReason,
          refundMethod,
        })
      );

      toast.success('Sovereign return request submitted for atelier evaluation.');
      onClose();
    } catch {
      toast.error('Failed to submit return request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Initiate Sovereign Return / Exchange"
      size="lg"
    >
      <div className="space-y-5 text-xs text-slate-800">
        {/* Step Indicator Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-[11px]">
          <span className="font-semibold text-slate-500">
            Step {currentStep} of 4: {currentStep === 1 && 'Select Creations'}
            {currentStep === 2 && 'Reason & Details'}
            {currentStep === 3 && 'Evidence Upload'}
            {currentStep === 4 && 'Review & Authorization'}
          </span>
          <span className="font-mono text-slate-400">Order #{order.orderNumber || order.id}</span>
        </div>

        {/* Step 1: Select Creations */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <p className="text-slate-600">
              Select the eligible creations from your acquisition that you wish to return or exchange.
            </p>

            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {order.items?.map((item) => {
                const isSelected = selectedItemIds.includes(item.id);
                return (
                  <label
                    key={item.id}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-amber-900 bg-amber-50/40 ring-1 ring-amber-900/30'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleItem(item.id)}
                        className="rounded text-amber-800 focus:ring-amber-700 w-4 h-4"
                      />
                      <img
                        src={item.image || item.product?.images?.[0] || 'https://images.unsplash.com/photo-1544441893-675973e31985?w=200'}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg border border-slate-200"
                      />
                      <div>
                        <h4 className="font-serif font-bold text-slate-900 text-xs">{item.name || item.product?.name}</h4>
                        <p className="text-[10px] text-slate-500">
                          Crafted by {item.brand || item.seller?.storeName || 'Maison Atelier'} · Qty: {item.quantity || 1}
                        </p>
                      </div>
                    </div>

                    <span className="font-serif font-bold text-slate-900">
                      {formatCurrency((item.price || 0) * (item.quantity || 1))}
                    </span>
                  </label>
                );
              })}
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <span className="text-slate-600">Estimated Return Valuation:</span>
              <span className="font-serif font-bold text-slate-900 text-sm">
                {formatCurrency(estimatedRefundTotal)}
              </span>
            </div>
          </div>
        )}

        {/* Step 2: Reason & Description */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Primary Return Rationale *
              </label>
              <select
                value={selectedReason}
                onChange={(e) => setSelectedReason(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 text-xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-slate-900"
              >
                {RETURN_REASONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Curator Evaluation Notes *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please describe the fit discrepancy, defect, or rationale in detail for the master atelier..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs h-28 focus:outline-none focus:ring-1 focus:ring-slate-900"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Preferred Settlement Method
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRefundMethod('Original Payment Method')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    refundMethod === 'Original Payment Method'
                      ? 'border-amber-900 bg-amber-50/40 text-amber-950 font-bold'
                      : 'border-slate-200 bg-white text-slate-700'
                  }`}
                >
                  <span className="block text-xs font-serif font-bold">Original Payment Method</span>
                  <span className="text-[10px] text-slate-500 font-normal">Reversed to original card via Stripe/Apple Pay.</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRefundMethod('Zareen Sovereign Credit')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    refundMethod === 'Zareen Sovereign Credit'
                      ? 'border-amber-900 bg-amber-50/40 text-amber-950 font-bold'
                      : 'border-slate-200 bg-white text-slate-700'
                  }`}
                >
                  <span className="block text-xs font-serif font-bold">Zareen Atelier Credit (+5% VIP Bonus)</span>
                  <span className="text-[10px] text-slate-500 font-normal">Instant credit for your next bespoke commission.</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Evidence Photos Upload */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <p className="text-slate-600">
              Attach high-resolution photos of the packaging, seals, or specific areas of concern to expedite atelier approval.
            </p>

            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center space-y-2 hover:border-slate-400 transition-colors bg-slate-50/50">
              <Upload className="w-8 h-8 text-slate-400 mx-auto" />
              <div className="text-xs text-slate-700">
                <label className="font-bold text-amber-900 hover:underline cursor-pointer">
                  <span>Upload Inspection Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-[10px] text-slate-400 mt-1">PNG, JPG, or WEBP up to 10MB</p>
              </div>
            </div>

            {evidenceImages.length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Attached Evidence ({evidenceImages.length})
                </span>
                <div className="flex flex-wrap gap-3">
                  {evidenceImages.map((img, idx) => (
                    <div key={idx} className="relative group w-20 h-20 rounded-xl overflow-hidden border border-slate-200">
                      <img src={img} alt="Evidence" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1 right-1 p-1 bg-black/70 text-white rounded-full hover:bg-rose-600 transition-colors cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Review & Submit */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex justify-between border-b border-slate-200 pb-2 text-[11px]">
                <span className="text-slate-500">Creations to Return:</span>
                <span className="font-bold text-slate-900">{selectedItems.length} selected</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2 text-[11px]">
                <span className="text-slate-500">Return Reason:</span>
                <span className="font-bold text-slate-900 text-right">{selectedReason}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2 text-[11px]">
                <span className="text-slate-500">Refund Method:</span>
                <span className="font-bold text-slate-900">{refundMethod}</span>
              </div>
              <div className="flex justify-between text-xs pt-1">
                <span className="font-bold text-slate-900">Total Refund Estimated:</span>
                <span className="font-serif font-bold text-amber-900 text-base">
                  {formatCurrency(estimatedRefundTotal)}
                </span>
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                Upon atelier verification, our white-glove courier service will contact you for complimentary insured pickup.
              </span>
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          {currentStep > 1 ? (
            <Button
              variant="outline"
              size="sm"
              leftIcon={ChevronLeft}
              onClick={() => setCurrentStep((s) => s - 1)}
            >
              Previous
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
          )}

          {currentStep < 4 ? (
            <Button
              variant="primary"
              size="sm"
              rightIcon={ChevronRight}
              onClick={() => {
                if (currentStep === 1 && selectedItemIds.length === 0) {
                  toast.error('Please select at least one creation.');
                  return;
                }
                if (currentStep === 2 && !description.trim()) {
                  toast.error('Please provide a brief explanation note.');
                  return;
                }
                setCurrentStep((s) => s + 1);
              }}
            >
              Continue
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              loading={isSubmitting}
              rightIcon={CheckCircle2}
              onClick={handleSubmit}
            >
              Submit Return Request
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ReturnRequestModal;
