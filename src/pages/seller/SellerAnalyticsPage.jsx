import { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  Award,
  ArrowUpRight,
  Download,
  Calendar,
  PieChart as PieIcon,
  Sparkles,
  Package,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { selectSellerAnalytics, selectSellerProducts } from '../../features/seller/sellerSelectors';
import { formatCurrency } from '../../utils/formatCurrency';
import Button from '../../components/common/Button';

export const SellerAnalyticsPage = () => {
  const analytics = useSelector(selectSellerAnalytics) || {};
  const products = useSelector(selectSellerProducts) || [];

  const [timeframe, setTimeframe] = useState('30d'); // '7d' | '30d' | '3m' | '12m'

  const chartData = useMemo(() => {
    switch (timeframe) {
      case '7d':
        return analytics.salesTrend7d || [];
      case '30d':
        return analytics.salesTrend30d || [];
      case '3m':
        return analytics.salesTrend3m || [];
      case '12m':
        return analytics.salesTrend12m || [];
      default:
        return [];
    }
  }, [timeframe, analytics]);

  const categoryBreakdown = analytics.categoryBreakdown || [
    { name: 'Outerwear', value: 45 },
    { name: 'Tailoring', value: 30 },
    { name: 'Eveningwear', value: 15 },
    { name: 'Leather Goods', value: 10 },
  ];

  const topProducts = [...products]
    .sort((a, b) => (b.revenue || 0) - (a.revenue || 0))
    .slice(0, 4);

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div>
            <h1 className="font-serif font-bold text-xl sm:text-2xl text-text-main">
              Atelier Sales & Growth Analytics
            </h1>
            <p className="text-xs text-text-muted">
              Telemetry on sales velocity, revenue trajectory, average order value, and category affinity.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Timeframe Selector */}
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

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-surface text-xs font-semibold text-text-main hover:bg-surface-muted transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {/* 6 Key Analytics Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-surface rounded-2xl border border-border space-y-1 shadow-subtle">
            <span className="text-[11px] font-semibold text-text-muted">Total Gross Revenue</span>
            <p className="font-serif text-2xl font-bold text-text-main">
              {formatCurrency(analytics.totalRevenue || 65490)}
            </p>
            <span className="text-[10px] text-emerald-600 font-bold">↑ +18.4% compared to prior cycle</span>
          </div>

          <div className="p-4 bg-surface rounded-2xl border border-border space-y-1 shadow-subtle">
            <span className="text-[11px] font-semibold text-text-muted">Average Order Value (AOV)</span>
            <p className="font-serif text-2xl font-bold text-text-main">
              {formatCurrency(analytics.averageOrderValue || 860)}
            </p>
            <span className="text-[10px] text-text-subtle">Across verified commissions</span>
          </div>

          <div className="p-4 bg-surface rounded-2xl border border-border space-y-1 shadow-subtle">
            <span className="text-[11px] font-semibold text-text-muted">Total Orders Dispatched</span>
            <p className="font-serif text-2xl font-bold text-text-main">
              {analytics.totalOrders || 142}
            </p>
            <span className="text-[10px] text-emerald-600 font-bold">100% on-time delivery rate</span>
          </div>

          <div className="p-4 bg-surface rounded-2xl border border-border space-y-1 shadow-subtle">
            <span className="text-[11px] font-semibold text-text-muted">Total Units Sold</span>
            <p className="font-serif text-2xl font-bold text-text-main">186 Pieces</p>
            <span className="text-[10px] text-text-subtle">Across 18 active listings</span>
          </div>

          <div className="p-4 bg-surface rounded-2xl border border-border space-y-1 shadow-subtle">
            <span className="text-[11px] font-semibold text-text-muted">Collector Patron Base</span>
            <p className="font-serif text-2xl font-bold text-text-main">
              {analytics.customersCount || 94} Patrons
            </p>
            <span className="text-[10px] text-accent font-bold">
              {analytics.repeatCustomerRate || 32.5}% repeat buyer affinity
            </span>
          </div>

          <div className="p-4 bg-surface rounded-2xl border border-border space-y-1 shadow-subtle">
            <span className="text-[11px] font-semibold text-text-muted">Conversion Rate</span>
            <p className="font-serif text-2xl font-bold text-text-main">
              {analytics.conversionRate || 3.8}%
            </p>
            <span className="text-[10px] text-emerald-600 font-bold">Top 5% of Sovereign Guild</span>
          </div>
        </div>

        {/* Revenue & Volume Chart */}
        <div className="bg-surface rounded-2xl border border-border p-6 shadow-subtle space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border">
            <div>
              <h2 className="font-serif font-bold text-base text-text-main">
                Revenue Trajectory & Order Volume ({timeframe})
              </h2>
              <p className="text-xs text-text-muted">
                Visualizing gross proceeds alongside order count over the selected window.
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-primary" />
                <span className="font-medium text-text-main">Revenue (USD)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-accent" />
                <span className="font-medium text-text-main">Order Count</span>
              </div>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="analyticsRevenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0F172A" stopOpacity={0.25} />
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
                    fontSize: '12px',
                  }}
                  formatter={(val, name) => [
                    name === 'revenue' ? formatCurrency(val) : `${val} Orders`,
                    name === 'revenue' ? 'Gross Revenue' : 'Order Volume',
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#0F172A"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#analyticsRevenueGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2-Column: Category Performance & Top Revenue Rankings */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Category Contribution (6 Cols) */}
          <div className="lg:col-span-6 bg-surface rounded-2xl border border-border p-6 shadow-subtle space-y-4">
            <div className="pb-3 border-b border-border">
              <h3 className="font-serif font-bold text-sm text-text-main">
                Revenue Distribution by Discipline
              </h3>
              <p className="text-xs text-text-muted">Proportional sales across atelier product categories.</p>
            </div>

            <div className="space-y-3">
              {categoryBreakdown.map((cat, idx) => (
                <div key={idx} className="space-y-1.5 text-xs">
                  <div className="flex justify-between font-medium">
                    <span className="text-text-main">{cat.name}</span>
                    <span className="font-bold text-text-main">{cat.value}%</span>
                  </div>
                  <div className="w-full bg-surface-muted h-2 rounded-full overflow-hidden border border-border">
                    <div
                      className="bg-primary h-full rounded-full transition-all duration-500"
                      style={{ width: `${cat.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Revenue Creations (6 Cols) */}
          <div className="lg:col-span-6 bg-surface rounded-2xl border border-border p-6 shadow-subtle space-y-4">
            <div className="pb-3 border-b border-border">
              <h3 className="font-serif font-bold text-sm text-text-main">
                Top Revenue Producing Creations
              </h3>
              <p className="text-xs text-text-muted">Leaderboard of highest grossing pieces.</p>
            </div>

            <div className="divide-y divide-border">
              {topProducts.map((p, idx) => (
                <div key={p.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-serif font-bold text-accent text-sm w-4">
                      #{idx + 1}
                    </span>
                    <img
                      src={p.images?.[0]}
                      alt=""
                      className="w-9 h-9 rounded-lg object-cover border border-border shrink-0"
                    />
                    <div className="min-w-0 max-w-[180px]">
                      <span className="font-serif font-bold text-text-main block truncate">
                        {p.name}
                      </span>
                      <span className="text-[11px] text-text-muted">
                        {p.salesCount || 1} units sold
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-bold text-text-main block">
                      {formatCurrency(p.revenue || p.price * (p.salesCount || 1))}
                    </span>
                    <span className="text-[10px] text-text-subtle font-mono">
                      Unit: {formatCurrency(p.price)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SellerAnalyticsPage;
