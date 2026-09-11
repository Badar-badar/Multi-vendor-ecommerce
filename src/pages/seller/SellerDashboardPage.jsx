import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  DollarSign,
  Package,
  ShoppingCart,
  TrendingUp,
  Plus,
  Users,
  AlertTriangle,
  ArrowRight,
  Eye,
  CheckCircle2,
  Calendar,
  Sparkles,
  Boxes,
  Clock,
  ArrowUpRight,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import {
  selectSellerProfile,
  selectSellerProducts,
  selectSellerOrders,
  selectSellerAnalytics,
} from '../../features/seller/sellerSelectors';
import { formatCurrency } from '../../utils/formatCurrency';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

export const SellerDashboardPage = () => {
  const profile = useSelector(selectSellerProfile) || {};
  const products = useSelector(selectSellerProducts) || [];
  const orders = useSelector(selectSellerOrders) || [];
  const analytics = useSelector(selectSellerAnalytics) || {};

  const [timeframe, setTimeframe] = useState('7d'); // '7d' | '30d' | '3m' | '12m'

  // Dynamic Chart Data mapping based on selected timeframe
  const chartData = useMemo(() => {
    switch (timeframe) {
      case '7d':
        return analytics.salesTrend7d || [
          { period: 'Mon', revenue: 2400, orders: 3 },
          { period: 'Tue', revenue: 4100, orders: 5 },
          { period: 'Wed', revenue: 3200, orders: 4 },
          { period: 'Thu', revenue: 5800, orders: 7 },
          { period: 'Fri', revenue: 7200, orders: 9 },
          { period: 'Sat', revenue: 8900, orders: 11 },
          { period: 'Sun', revenue: 6400, orders: 8 },
        ];
      case '30d':
        return analytics.salesTrend30d || [
          { period: 'Week 1', revenue: 14200, orders: 18 },
          { period: 'Week 2', revenue: 16800, orders: 22 },
          { period: 'Week 3', revenue: 15400, orders: 19 },
          { period: 'Week 4', revenue: 19090, orders: 25 },
        ];
      case '3m':
        return analytics.salesTrend3m || [
          { period: 'June', revenue: 18400, orders: 26 },
          { period: 'July', revenue: 22800, orders: 31 },
          { period: 'August', revenue: 24290, orders: 35 },
        ];
      case '12m':
        return analytics.salesTrend12m || [
          { period: 'Sep', revenue: 9800, orders: 12 },
          { period: 'Oct', revenue: 11200, orders: 14 },
          { period: 'Nov', revenue: 14500, orders: 18 },
          { period: 'Dec', revenue: 26800, orders: 34 },
          { period: 'Jan', revenue: 12400, orders: 16 },
          { period: 'Feb', revenue: 14100, orders: 17 },
          { period: 'Mar', revenue: 16200, orders: 20 },
          { period: 'Apr', revenue: 17500, orders: 22 },
          { period: 'May', revenue: 18200, orders: 24 },
          { period: 'Jun', revenue: 19400, orders: 25 },
          { period: 'Jul', revenue: 21800, orders: 29 },
          { period: 'Aug', revenue: 24290, orders: 35 },
        ];
      default:
        return [];
    }
  }, [timeframe, analytics]);

  const pendingOrders = orders.filter(
    (o) => o.status === 'Pending' || o.status === 'Processing' || o.status === 'Confirmed'
  );

  const lowStockItems = products.filter(
    (p) => p.stock <= (p.lowStockThreshold || 3)
  );

  const outOfStockItems = products.filter((p) => p.stock === 0);

  const topProducts = [...products]
    .sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0))
    .slice(0, 4);

  const statCards = [
    {
      label: 'Total Revenue',
      value: formatCurrency(analytics.totalRevenue || 65490),
      trend: `+${analytics.growthRate || 18.4}%`,
      trendPositive: true,
      subtext: 'vs. previous cycle',
      icon: DollarSign,
    },
    {
      label: 'Total Orders',
      value: analytics.totalOrders || 142,
      trend: '+12.5%',
      trendPositive: true,
      subtext: 'verified dispatches',
      icon: ShoppingCart,
    },
    {
      label: 'Active Products',
      value: products.filter((p) => p.status === 'Active').length || 18,
      trend: `${products.length} total`,
      trendPositive: true,
      subtext: 'live in marketplace',
      icon: Package,
    },
    {
      label: 'Patron Customers',
      value: analytics.customersCount || 94,
      trend: `${analytics.repeatCustomerRate || 32.5}% repeat`,
      trendPositive: true,
      subtext: 'high-net-worth buyers',
      icon: Users,
    },
    {
      label: 'Pending Orders',
      value: pendingOrders.length,
      trend: pendingOrders.length > 0 ? 'Action Required' : 'All Clear',
      trendPositive: pendingOrders.length === 0,
      subtext: 'awaiting fulfillment',
      icon: Clock,
      alert: pendingOrders.length > 0,
    },
    {
      label: 'Low Stock Alerts',
      value: lowStockItems.length,
      trend: outOfStockItems.length > 0 ? `${outOfStockItems.length} out of stock` : 'Stable inventory',
      trendPositive: lowStockItems.length === 0,
      subtext: 'at/below alert limit',
      icon: Boxes,
      alert: lowStockItems.length > 0,
    },
  ];

  return (
    <>
      <div className="space-y-6">
        {/* Top Header: Title, Store, Range Selector & Quick Actions */}
        <div className="bg-surface rounded-2xl border border-border p-6 sm:p-7 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-accent flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Studio Operational Console
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text-main">
              {profile.storeName || 'Atelier Maison'}
            </h1>
            <p className="text-xs text-text-muted">
              Live business telemetry for sales velocity, commission escrow, and inventory health.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Timeframe Range Selector */}
            <div className="flex items-center p-1 bg-surface-muted border border-border rounded-xl">
              {[
                { id: '7d', label: '7 Days' },
                { id: '30d', label: '30 Days' },
                { id: '3m', label: '3 Months' },
                { id: '12m', label: '12 Months' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTimeframe(t.id)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    timeframe === t.id
                      ? 'bg-primary text-white shadow-xs'
                      : 'text-text-muted hover:text-text-main'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Action CTA */}
            <Link to="/seller/products/create">
              <Button variant="primary" size="sm" leftIcon={Plus}>
                New Product
              </Button>
            </Link>
          </div>
        </div>

        {/* 6 Statistics Cards (Minimal, Consistent Visual Treatment) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {statCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="bg-surface rounded-2xl border border-border p-5 space-y-3 shadow-subtle hover:border-border-strong transition-all"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-text-muted">
                  <span>{card.label}</span>
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      card.alert
                        ? 'bg-amber-50 text-amber-600 border border-amber-200'
                        : 'bg-surface-muted text-text-main border border-border'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="font-serif text-2xl font-bold text-text-main tracking-tight">
                    {card.value}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs">
                    <span
                      className={`font-semibold ${
                        card.trendPositive ? 'text-emerald-600' : 'text-amber-600'
                      }`}
                    >
                      {card.trend}
                    </span>
                    <span className="text-text-subtle">• {card.subtext}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sales Overview Chart (Revenue & Orders) */}
        <div className="bg-surface rounded-2xl border border-border p-6 shadow-subtle space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border">
            <div>
              <h2 className="font-serif font-bold text-base text-text-main">
                Sales & Revenue Velocity
              </h2>
              <p className="text-xs text-text-muted">
                Gross sales volume in USD across the active {timeframe} window.
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-primary" />
                <span className="font-medium text-text-main">Revenue ($)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-accent" />
                <span className="font-medium text-text-main">Order Count</span>
              </div>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="sellerRevenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0F172A" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#0F172A" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E2E8F0',
                    borderRadius: '0.75rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    fontSize: '12px',
                  }}
                  formatter={(val, name) => [
                    name === 'revenue' ? formatCurrency(val) : `${val} Orders`,
                    name === 'revenue' ? 'Gross Revenue' : 'Dispatches',
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#0F172A"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#sellerRevenueGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2-Column Grid: Top Products (7 Cols) & Inventory Alerts (5 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Top Products Table */}
          <div className="lg:col-span-7 bg-surface rounded-2xl border border-border p-6 shadow-subtle space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h3 className="font-serif font-bold text-sm text-text-main">
                  Top Performing Creations
                </h3>
                <p className="text-xs text-text-muted">Ranked by overall sales volume.</p>
              </div>
              <Link to="/seller/products" className="text-xs font-semibold text-accent hover:underline">
                View All Catalog →
              </Link>
            </div>

            <div className="divide-y divide-border">
              {topProducts.map((p) => (
                <div key={p.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={p.images?.[0]}
                      alt={p.name}
                      className="w-10 h-10 rounded-xl object-cover border border-border shrink-0"
                    />
                    <div className="min-w-0">
                      <Link
                        to={`/seller/products/${p.id}/edit`}
                        className="font-serif font-bold text-text-main hover:text-accent transition-colors block truncate"
                      >
                        {p.name}
                      </Link>
                      <span className="text-[11px] text-text-subtle font-mono">
                        SKU: {p.sku} • {p.salesCount || 0} sold
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-bold text-text-main block">
                      {formatCurrency(p.revenue || p.price * (p.salesCount || 1))}
                    </span>
                    <span
                      className={`text-[10px] font-semibold ${
                        p.stock <= (p.lowStockThreshold || 3) ? 'text-amber-600' : 'text-emerald-600'
                      }`}
                    >
                      {p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Inventory Alerts Card */}
          <div className="lg:col-span-5 bg-surface rounded-2xl border border-border p-6 shadow-subtle space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Boxes className="w-4 h-4 text-accent" />
                <h3 className="font-serif font-bold text-sm text-text-main">
                  Inventory Alerts ({lowStockItems.length})
                </h3>
              </div>
              <Link to="/seller/inventory" className="text-xs font-semibold text-accent hover:underline">
                Manage Inventory →
              </Link>
            </div>

            <div className="space-y-3">
              {lowStockItems.length > 0 ? (
                lowStockItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-surface-muted rounded-xl border border-border flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0">
                      <span className="font-bold text-text-main block truncate">{item.name}</span>
                      <span className="text-[11px] text-text-muted font-mono">SKU: {item.sku}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          item.stock === 0
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {item.stock === 0 ? 'Out of Stock' : `${item.stock} left`}
                      </span>
                      <Link
                        to="/seller/inventory"
                        className="px-2 py-1 rounded bg-surface border border-border hover:bg-surface-muted text-text-main font-semibold text-[11px]"
                      >
                        Restock
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-text-muted space-y-1">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                  <p>All atelier listings meet or exceed stock threshold.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Orders Overview Table */}
        <div className="bg-surface rounded-2xl border border-border p-6 shadow-subtle space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div>
              <h3 className="font-serif font-bold text-sm text-text-main">
                Recent Fulfillment Orders
              </h3>
              <p className="text-xs text-text-muted">Live dispatch and customer acquisition queue.</p>
            </div>
            <Link to="/seller/orders" className="text-xs font-semibold text-accent hover:underline">
              View All Orders ({orders.length}) →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-text-muted text-[11px] uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Order ID</th>
                  <th className="pb-3 font-semibold">Customer</th>
                  <th className="pb-3 font-semibold">Creation</th>
                  <th className="pb-3 font-semibold">Amount</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.slice(0, 4).map((ord) => (
                  <tr key={ord.id} className="hover:bg-surface-muted/40 transition-colors">
                    <td className="py-3.5 font-mono font-bold text-text-main">
                      {ord.orderNumber || ord.id}
                    </td>
                    <td className="py-3.5">
                      <span className="font-semibold text-text-main block">{ord.customer?.name}</span>
                      <span className="text-[11px] text-text-muted">{ord.customer?.city}</span>
                    </td>
                    <td className="py-3.5 max-w-[200px] truncate text-text-main">
                      {ord.items?.[0]?.name}
                      {ord.items?.length > 1 && ` +${ord.items.length - 1} more`}
                    </td>
                    <td className="py-3.5 font-serif font-bold text-text-main">
                      {formatCurrency(ord.amount)}
                    </td>
                    <td className="py-3.5">
                      <Badge
                        variant={
                          ord.status === 'Delivered'
                            ? 'success'
                            : ord.status === 'Cancelled'
                            ? 'error'
                            : ord.status === 'Processing'
                            ? 'warning'
                            : 'primary'
                        }
                        size="xs"
                      >
                        {ord.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 text-text-muted font-mono text-[11px]">
                      {ord.date}
                    </td>
                    <td className="py-3.5 text-right">
                      <Link
                        to={`/seller/orders/${ord.id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
                      >
                        Inspect <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default SellerDashboardPage;
