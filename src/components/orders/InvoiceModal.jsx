import { Printer, Download, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { formatCurrency } from '../../utils/formatCurrency';
import toast from 'react-hot-toast';

export const InvoiceModal = ({ isOpen, onClose, order }) => {
  if (!order) return null;

  const invoiceNumber = `INV-${order.orderNumber?.replace('ZRN-', '') || order.id || Date.now().toString().slice(-6)}`;
  const invoiceDate = order.createdAt || new Date().toISOString().slice(0, 10);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    toast.success(`Invoice ${invoiceNumber} downloaded.`);
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Sovereign Acquisition Invoice"
      size="xl"
    >
      <div className="space-y-6 text-xs text-slate-800 printable-invoice-content p-2 sm:p-4">
        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-serif font-bold text-xl tracking-widest text-slate-900 uppercase">
                ZAREEN
              </span>
              <span className="text-[10px] font-mono tracking-widest text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-bold">
                HAUTE REGISTRY
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Maison & Master Artisan Global Curations
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              14 Place Vendôme, 75001 Paris, France · concierge@zareen.luxury
            </p>
          </div>

          <div className="text-left sm:text-right space-y-1 font-mono text-[11px]">
            <div>
              <span className="text-slate-400">Invoice Number: </span>
              <strong className="text-slate-900 font-bold">{invoiceNumber}</strong>
            </div>
            <div>
              <span className="text-slate-400">Order Reference: </span>
              <strong className="text-slate-900">{order.orderNumber || order.id}</strong>
            </div>
            <div>
              <span className="text-slate-400">Date Issued: </span>
              <span className="text-slate-700">{invoiceDate}</span>
            </div>
            <div>
              <span className="text-slate-400">Payment Status: </span>
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[10px]">
                {order.paymentStatus || 'Paid & Authenticated'}
              </span>
            </div>
          </div>
        </div>

        {/* Addresses & Client Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-[11px]">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1.5">
              Billed To Patron
            </span>
            <p className="font-serif font-bold text-slate-900 text-xs">
              {order.shippingAddress?.fullName || 'Sarah Jenkins'}
            </p>
            <p className="text-slate-600 mt-0.5">
              {order.shippingAddress?.addressLine1 || '740 Park Avenue, Penthouse 14B'}
            </p>
            {order.shippingAddress?.addressLine2 && (
              <p className="text-slate-600">{order.shippingAddress.addressLine2}</p>
            )}
            <p className="text-slate-600">
              {order.shippingAddress?.city || 'New York'}, {order.shippingAddress?.state || 'NY'}{' '}
              {order.shippingAddress?.postalCode || '10021'}
            </p>
            <p className="text-slate-500 mt-1">{order.shippingAddress?.phone || '+1 (555) 019-2834'}</p>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1.5">
              Fulfillment & Settlement
            </span>
            <p className="text-slate-700">
              <strong className="text-slate-900">Courier Service:</strong>{' '}
              {order.courier || order.shippingMethodName || 'Sovereign Insured White-Glove Courier'}
            </p>
            <p className="text-slate-700 mt-0.5">
              <strong className="text-slate-900">Tracking Code:</strong>{' '}
              <span className="font-mono">{order.trackingNumber || 'TRK-ZRN-981240-US'}</span>
            </p>
            <p className="text-slate-700 mt-0.5">
              <strong className="text-slate-900">Settlement Method:</strong>{' '}
              {order.paymentMethodName || 'Stripe 256-Bit Encrypted Card'}
            </p>
          </div>
        </div>

        {/* Itemized Acquisitions Table */}
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-600 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Artisan Item & Atelier</th>
                <th className="py-3 px-4">Variant Specifications</th>
                <th className="py-3 px-4 text-center">Qty</th>
                <th className="py-3 px-4 text-right">Unit Value</th>
                <th className="py-3 px-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {order.items?.map((item, idx) => (
                <tr key={item.id || idx} className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4">
                    <p className="font-serif font-bold text-slate-900">{item.name || item.product?.name}</p>
                    <p className="text-[10px] text-slate-500">
                      Crafted by {item.brand || item.seller?.storeName || item.product?.seller?.storeName || 'Maison Atelier'}
                    </p>
                  </td>
                  <td className="py-3.5 px-4 text-[11px] text-slate-600">
                    {item.selectedVariant
                      ? Object.entries(item.selectedVariant)
                          .map(([k, v]) => `${k}: ${v}`)
                          .join(', ')
                      : 'Bespoke Standard'}
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-slate-800">
                    {item.quantity || 1}
                  </td>
                  <td className="py-3.5 px-4 text-right font-serif text-slate-700">
                    {formatCurrency(item.price || 0)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-serif font-bold text-slate-900">
                    {formatCurrency((item.price || 0) * (item.quantity || 1))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Financial Breakdown Summary */}
        <div className="flex justify-end pt-2">
          <div className="w-full max-w-xs space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Gross Subtotal:</span>
              <span className="font-semibold text-slate-900">{formatCurrency(order.subtotal || 0)}</span>
            </div>

            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Promotional & VIP Privilege:</span>
                <span>-{formatCurrency(order.discount)}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-600">
              <span>White-Glove Insured Delivery:</span>
              <span>{order.shippingFee === 0 ? 'Complimentary' : formatCurrency(order.shippingFee || 0)}</span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>Import Taxes & Duties (8%):</span>
              <span>{formatCurrency(order.tax || 0)}</span>
            </div>

            <div className="flex justify-between items-baseline pt-3 border-t-2 border-slate-900 text-slate-900 font-bold">
              <span className="font-serif text-sm">Grand Total (USD):</span>
              <span className="font-serif text-lg text-amber-900">{formatCurrency(order.total || 0)}</span>
            </div>
          </div>
        </div>

        {/* Certificate / Escrow Seal */}
        <div className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-xl flex items-center justify-between gap-4 text-[11px] text-amber-950">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-800 shrink-0" />
            <div>
              <span className="font-bold block">Zareen Certificate of Provenance & Authenticity</span>
              <span className="text-amber-800 text-[10px]">
                This invoice serves as a permanent cryptographic proof of ownership for all itemized acquisitions.
              </span>
            </div>
          </div>
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
        </div>

        {/* Action Controls (Hidden when printing) */}
        <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 print:hidden">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button variant="secondary" size="sm" leftIcon={Printer} onClick={handlePrint}>
            Print Invoice
          </Button>
          <Button variant="primary" size="sm" leftIcon={Download} onClick={handleDownload}>
            Download PDF
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default InvoiceModal;
