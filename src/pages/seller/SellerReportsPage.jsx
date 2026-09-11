import { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  FileText,
  Download,
  Calendar,
  Filter,
  Search,
  DollarSign,
  Package,
  ShoppingCart,
  Boxes,
  Printer,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  selectSellerProducts,
  selectSellerOrders,
  selectSellerAnalytics,
} from '../../features/seller/sellerSelectors';
import { formatCurrency } from '../../utils/formatCurrency';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

export const SellerReportsPage = () => {
  const products = useSelector(selectSellerProducts) || [];
  const orders = useSelector(selectSellerOrders) || [];
  const analytics = useSelector(selectSellerAnalytics) || {};

  const [reportType, setReportType] = useState('sales'); // 'sales' | 'orders' | 'products' | 'inventory'
  const [dateRange, setDateRange] = useState('30d');
  const [searchTerm, setSearchTerm] = useState('');

  const handleExport = (format) => {
    toast.success(`Generating ${reportType.toUpperCase()} report in ${format.toUpperCase()} format...`);
  };

  return (
    <>
      <div className="space-y-6 animate-in fade-in duration-200">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-accent block mb-1">
              Business Intelligence
            </span>
            <h1 className="font-serif font-bold text-xl sm:text-2xl text-text-main">
              Atelier Reports & Auditing
            </h1>
            <p className="text-xs text-text-muted">
              Generate certified commercial reports, inventory valuation statements, and sales tax summaries.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-surface text-xs font-semibold text-text-muted hover:text-text-main transition-colors shadow-2xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={Download}
              onClick={() => handleExport('csv')}
            >
              Export CSV
            </Button>
          </div>
        </div>

        {/* Report Type Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: 'sales', label: 'Commercial Sales Report', icon: DollarSign },
            { id: 'orders', label: 'Dispatched Orders Audit', icon: ShoppingCart },
            { id: 'products', label: 'Creations Velocity', icon: Package },
            { id: 'inventory', label: 'Inventory Valuation', icon: Boxes },
          ].map((tab) => {
            const isSelected = reportType === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setReportType(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-surface hover:bg-surface-muted border border-border text-text-muted hover:text-text-main'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-surface rounded-2xl border border-border shadow-2xs">
          <div className="flex-1 max-w-sm">
            <input
              type="text"
              placeholder="Search in active report..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-surface-muted border border-border rounded-xl focus:outline-none focus:border-primary text-text-main"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-text-muted font-medium">Time Period:</span>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-1.5 bg-surface-muted border border-border rounded-xl text-xs font-semibold text-text-main cursor-pointer"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">This Quarter (90 Days)</option>
              <option value="ytd">Year to Date (2026)</option>
            </select>
          </div>
        </div>

        {/* Report Content Table based on Selected Type */}
        <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-subtle">
          {reportType === 'sales' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-surface-muted/60 border-b border-border text-text-muted uppercase text-[10px] font-semibold tracking-wider">
                    <th className="py-3 px-4">Period / Date</th>
                    <th className="py-3 px-4">Gross Revenue</th>
                    <th className="py-3 px-4">Commissions Deducted</th>
                    <th className="py-3 px-4">Net Payout Accrued</th>
                    <th className="py-3 px-4">Transactions</th>
                    <th className="py-3 px-4 text-right">Avg Order Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    { period: 'Sep 01 – Sep 08, 2026', gross: 14200, com: 1420, net: 12780, tx: 18, aov: 788 },
                    { period: 'Aug 24 – Aug 31, 2026', gross: 16800, com: 1680, net: 15120, tx: 22, aov: 763 },
                    { period: 'Aug 17 – Aug 23, 2026', gross: 15400, com: 1540, net: 13860, tx: 19, aov: 810 },
                    { period: 'Aug 10 – Aug 16, 2026', gross: 19090, com: 1909, net: 17181, tx: 25, aov: 763 },
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-surface-muted/40 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-text-main">{row.period}</td>
                      <td className="py-3.5 px-4 font-serif font-bold text-text-main">{formatCurrency(row.gross)}</td>
                      <td className="py-3.5 px-4 font-semibold text-amber-800">-{formatCurrency(row.com)}</td>
                      <td className="py-3.5 px-4 font-serif font-bold text-emerald-600">{formatCurrency(row.net)}</td>
                      <td className="py-3.5 px-4">{row.tx} orders</td>
                      <td className="py-3.5 px-4 text-right font-medium text-text-muted">{formatCurrency(row.aov)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {reportType === 'orders' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-surface-muted/60 border-b border-border text-text-muted uppercase text-[10px] font-semibold tracking-wider">
                    <th className="py-3 px-4">Order Registry #</th>
                    <th className="py-3 px-4">Patron Recipient</th>
                    <th className="py-3 px-4">Item Count</th>
                    <th className="py-3 px-4">Order Value</th>
                    <th className="py-3 px-4">Dispatch Status</th>
                    <th className="py-3 px-4 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-surface-muted/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-text-main">{ord.orderNumber}</td>
                      <td className="py-3.5 px-4 font-medium text-text-main">{ord.customerName}</td>
                      <td className="py-3.5 px-4 text-text-muted">{ord.items?.length || 1} pieces</td>
                      <td className="py-3.5 px-4 font-serif font-bold text-text-main">{formatCurrency(ord.totalAmount || ord.total)}</td>
                      <td className="py-3.5 px-4">
                        <Badge variant={ord.status === 'Delivered' ? 'success' : 'warning'} size="xs">
                          {ord.status}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right text-text-muted">{ord.createdAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {reportType === 'products' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-surface-muted/60 border-b border-border text-text-muted uppercase text-[10px] font-semibold tracking-wider">
                    <th className="py-3 px-4">Creation Name</th>
                    <th className="py-3 px-4">SKU</th>
                    <th className="py-3 px-4">Units Sold</th>
                    <th className="py-3 px-4">Total Revenue</th>
                    <th className="py-3 px-4">Rating</th>
                    <th className="py-3 px-4 text-right">Stock Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {products.map((prod) => (
                    <tr key={prod.id} className="hover:bg-surface-muted/40 transition-colors">
                      <td className="py-3.5 px-4 font-serif font-bold text-text-main">{prod.name}</td>
                      <td className="py-3.5 px-4 font-mono text-text-subtle">{prod.sku}</td>
                      <td className="py-3.5 px-4 font-semibold text-text-main">{prod.salesCount || 0} units</td>
                      <td className="py-3.5 px-4 font-serif font-bold text-accent">
                        {formatCurrency(prod.revenue || prod.price * (prod.salesCount || 0))}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-amber-500">★ {prod.rating || '5.0'}</td>
                      <td className="py-3.5 px-4 text-right font-bold text-text-main">{prod.stock} in atelier</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {reportType === 'inventory' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-surface-muted/60 border-b border-border text-text-muted uppercase text-[10px] font-semibold tracking-wider">
                    <th className="py-3 px-4">Creation & SKU</th>
                    <th className="py-3 px-4">Retail Unit Price</th>
                    <th className="py-3 px-4">Stock on Hand</th>
                    <th className="py-3 px-4">Gross Valuation</th>
                    <th className="py-3 px-4">Inventory Status</th>
                    <th className="py-3 px-4 text-right">Threshold Alert</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {products.map((prod) => {
                    const isLow = prod.stock > 0 && prod.stock <= (prod.lowStockThreshold || 3);
                    const isOut = prod.stock === 0;
                    return (
                      <tr key={prod.id} className="hover:bg-surface-muted/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <p className="font-serif font-bold text-text-main">{prod.name}</p>
                          <span className="font-mono text-[10px] text-text-subtle">{prod.sku}</span>
                        </td>
                        <td className="py-3.5 px-4 font-serif text-text-main">{formatCurrency(prod.price)}</td>
                        <td className="py-3.5 px-4 font-bold text-text-main">{prod.stock} units</td>
                        <td className="py-3.5 px-4 font-serif font-bold text-emerald-600">
                          {formatCurrency(prod.stock * prod.price)}
                        </td>
                        <td className="py-3.5 px-4">
                          <Badge variant={isOut ? 'error' : isLow ? 'warning' : 'success'} size="xs">
                            {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'Optimal'}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-4 text-right text-text-muted">
                          Limit: {prod.lowStockThreshold || 3} units
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SellerReportsPage;
