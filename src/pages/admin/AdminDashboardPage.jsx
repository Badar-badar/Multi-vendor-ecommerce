import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingCart,
  Users,
  Store,
  Package,
  Percent,
  Clock,
  UserCheck,
  TrendingUp,
  ArrowUpRight,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Eye,
  ExternalLink,
  ChevronRight,
  Download,
  Filter,
  Check,
  X,
  AlertCircle,
  RotateCcw,
  Sparkles,
  Plus,
  Tag,
  Star,
  Activity,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { formatCurrency } from '../../utils/formatCurrency';
import {
  selectAdminMetrics,
  selectAdminTimeframe,
  selectAdminSellers,
  selectAdminOrders,
  selectAdminProducts,
  selectAdminUsers,
  selectAdminRefunds,
} from '../../features/admin/adminSelectors';
import {
  setTimeframe,
  updateSellerStatusLocal,
} from '../../features/admin/adminSlice';
import {
  fetchAdminDashboard,
  fetchAdminSellers,
  fetchAdminProducts,
  fetchAdminOrders,
  fetchAdminRefunds,
} from '../../features/admin/adminThunk';

export const AdminDashboardPage = () => {
  const dispatch = useDispatch();
  const metrics = useSelector(selectAdminMetrics) || {};
  const activeTimeframe = useSelector(selectAdminTimeframe);
  const sellers = useSelector(selectAdminSellers) || [];
  const orders = useSelector(selectAdminOrders) || [];
  const products = useSelector(selectAdminProducts) || [];
  const users = useSelector(selectAdminUsers) || [];
  const refunds = useSelector(selectAdminRefunds) || [];

  useEffect(() => {
    dispatch(fetchAdminDashboard());
    dispatch(fetchAdminSellers());
    dispatch(fetchAdminProducts());
    dispatch(fetchAdminOrders());
    dispatch(fetchAdminRefunds());
  }, [dispatch]);

  const pendingSellers = useMemo(() => sellers.filter((s) => s.status === 'Pending'), [sellers]);
  const topSellers = useMemo(() => sellers.filter((s) => s.status === 'Approved').slice(0, 4), [sellers]);
  const pendingProducts = useMemo(
    () => products.filter((p) => p.status === 'Pending Approval' || p.status === 'Pending'),
    [products]
  );
  const pendingRefunds = useMemo(
    () => refunds.filter((r) => r.status === 'Requested'),
    [refunds]
  );
  const lowStockProducts = useMemo(
    () => products.filter((p) => p.stock <= (p.lowStockThreshold || 3)),
    [products]
  );

  const chartData = metrics?.timeframeData ? metrics.timeframeData[activeTimeframe] || [] : [];

  const handleApproveSeller = (sellerId) => {
    dispatch(updateSellerStatusLocal({ sellerId, status: 'Approved' }));
    toast.success('Seller application approved and accredited.');
  };

  const handleRejectSeller = (sellerId) => {
    dispatch(updateSellerStatusLocal({ sellerId, status: 'Rejected' }));
    toast.error('Seller application declined.');
  };

  const handleExport = () => {
    toast.success('Exporting Executive Marketplace Summary (CSV)...');
  };

  const getOrderStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Delivered':
        return 'success';
      case 'Processing':
      case 'In Transit':
        return 'info';
      case 'Pending':
        return 'warning';
      case 'Refunded':
      case 'Cancelled':
        return 'danger';
      default:
        return 'default';
    }
  };

  // 8 Key Executive KPIs
  const kpis = [
    {
      label: 'Total Revenue',
      value: formatCurrency(metrics.totalRevenue || 1845920),
      trend: '+24.6% vs Q2',
      isPositive: true,
      icon: DollarSign,
    },
    {
      label: 'Total Orders',
      value: (metrics.totalOrders || 4120).toLocaleString(),
      trend: '+18.2% YoY',
      isPositive: true,
      icon: ShoppingCart,
    },
    {
      label: 'Patron Customers',
      value: (metrics.totalCustomers || 12850).toLocaleString(),
      trend: '+14.8% growth',
      isPositive: true,
      icon: Users,
    },
    {
      label: 'Accredited Sellers',
      value: (metrics.totalSellers || 96).toString(),
      trend: `${sellers.filter((s) => s.status === 'Approved').length} Active`,
      isPositive: true,
      icon: Store,
    },
    {
      label: 'Catalog Creations',
      value: (metrics.totalProducts || 942).toString(),
      trend: `${products.filter((p) => p.status === 'Approved').length} Live`,
      isPositive: true,
      icon: Package,
    },
    {
      label: 'Platform Take Rate',
      value: formatCurrency(metrics.platformCommission || 184592),
      trend: 'Avg 10.0% Commission',
      isPositive: true,
      icon: Percent,
    },
    {
      label: 'Pending Dispatches',
      value: (metrics.pendingOrders || 38).toString(),
      trend: 'Awaiting shipping',
      isPositive: false,
      icon: Clock,
    },
    {
      label: 'Pending Disputes / Apps',
      value: (pendingSellers.length + pendingRefunds.length).toString(),
      trend: `${pendingSellers.length} Apps · ${pendingRefunds.length} Refunds`,
      isPositive: false,
      icon: ShieldAlert,
    },
  ];

  // Activity Feed Mock
  const activityFeed = [
    {
      id: 'ACT-1',
      type: 'seller',
      title: 'Seller Application Submitted',
      desc: 'Maison de Horlogerie submitted craft credentials and workshop photo.',
      time: '12m ago',
      link: '/admin/sellers',
    },
    {
      id: 'ACT-2',
      type: 'order',
      title: 'High-Value Order Booked',
      desc: 'Order #ZRN-2026-9821 placed for $8,050.00 via Stripe Escrow.',
      time: '45m ago',
      link: '/admin/orders',
    },
    {
      id: 'ACT-3',
      type: 'refund',
      title: 'Patron Refund Requested',
      desc: 'Return claim filed for Order #ZRN-2026-9804 ($4,200.00).',
      time: '2h ago',
      link: '/admin/refunds',
    },
    {
      id: 'ACT-4',
      type: 'product',
      title: 'Masterpiece Listed for Review',
      desc: 'Artisan Atelier Maison submitted "Royal Chronograph Automatic".',
      time: '3h ago',
      link: '/admin/products',
    },
  ];

  return (
    <>
      <div className="space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary block mb-1">
              Executive Governance
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-text-main">
              Admin Command Console
            </h1>
            <p className="text-xs text-text-muted mt-0.5">
              Real-time marketplace liquidity, multi-vendor compliance, and order fulfillment metrics.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Button
              variant="outline"
              size="sm"
              leftIcon={Download}
              onClick={handleExport}
            >
              Export Summary
            </Button>
            <Link to="/admin/reports">
              <Button variant="primary" size="sm" rightIcon={ArrowUpRight}>
                Executive Reports
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Actions Bar */}
        <div className="bg-surface text-text-main p-4 rounded-2xl border border-border shadow-subtle flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary shrink-0" />
            <span className="font-semibold text-text-main">Quick Administrative Actions:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/admin/products"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-muted hover:bg-primary-light text-text-main hover:text-primary font-medium border border-border/80 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Product Catalog
            </Link>
            <Link
              to="/admin/sellers"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-muted hover:bg-primary-light text-text-main hover:text-primary font-medium border border-border/80 transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5 text-primary" /> Review Sellers ({pendingSellers.length})
            </Link>
            <Link
              to="/admin/refunds"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-muted hover:bg-primary-light text-text-main hover:text-primary font-medium border border-border/80 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-error" /> Refund Claims ({pendingRefunds.length})
            </Link>
            <Link
              to="/admin/coupons"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-muted hover:bg-primary-light text-text-main hover:text-primary font-medium border border-border/80 transition-colors"
            >
              <Tag className="w-3.5 h-3.5" /> Coupons & Promos
            </Link>
          </div>
        </div>

        {/* 8 Executive KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <div
                key={idx}
                className="bg-surface p-4 sm:p-5 rounded-2xl border border-border shadow-xs hover:border-primary/40 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-text-muted">{kpi.label}</span>
                  <div className="w-8 h-8 rounded-xl bg-primary-light flex items-center justify-center text-primary">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xl sm:text-2xl font-bold font-serif text-text-main tracking-tight">
                    {kpi.value}
                  </p>
                  <p className="text-[11px] font-medium text-text-muted flex items-center gap-1">
                    {kpi.isPositive ? (
                      <span className="text-emerald-600 font-semibold">{kpi.trend}</span>
                    ) : (
                      <span className="text-primary font-semibold">{kpi.trend}</span>
                    )}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Revenue Overview Chart */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-serif font-bold text-slate-900">
                Marketplace Sales Velocity & Platform Revenue
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Gross volume (GMV) alongside platform commission take rate over time.
              </p>
            </div>

            {/* Timeframe Filters */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl gap-1">
              {[
                { id: '7d', label: '7D' },
                { id: '30d', label: '30D' },
                { id: '3m', label: '3M' },
                { id: '6m', label: '6M' },
                { id: '12m', label: '12M' },
              ].map((tf) => (
                <button
                  key={tf.id}
                  onClick={() => dispatch(setTimeframe(tf.id))}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    activeTimeframe === tf.id
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tf.label}
                </button>
              ))}
            </div>
          </div>

          <div className="h-72 sm:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0F172A" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#0F172A" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="comGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#B88746" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#B88746" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="label" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#94A3B8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(val, name) => [
                    name === 'orders' ? val : formatCurrency(val),
                    name === 'revenue' ? 'Gross GMV' : name === 'commission' ? 'Platform Take' : 'Orders',
                  ]}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                    fontSize: '12px',
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                  iconType="circle"
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Gross GMV"
                  stroke="#0F172A"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#revGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="commission"
                  name="Platform Take (10%)"
                  stroke="#B88746"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#comGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2-Column Grid: Pending Review Summary & Live Activity Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Pending Alerts & Moderation Hub (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-800" />
                <h3 className="text-base font-serif font-bold text-slate-900">
                  Moderation & Verification Queue
                </h3>
              </div>
              <span className="text-xs font-semibold text-slate-500">Action Required</span>
            </div>

            <div className="space-y-3 text-xs">
              {/* Pending Sellers Card */}
              <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200/60 flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-amber-950">Pending Seller Accreditation Dossiers</span>
                    <Badge variant="warning" size="xs">{pendingSellers.length}</Badge>
                  </div>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    {pendingSellers.length > 0
                      ? `${pendingSellers.length} artisan ateliers awaiting workshop & KYC verification.`
                      : 'All seller applications have been audited.'}
                  </p>
                </div>
                <Link to="/admin/sellers">
                  <Button variant="outline" size="xs" className="bg-white">
                    Audit Dossiers
                  </Button>
                </Link>
              </div>

              {/* Pending Refunds Card */}
              <div className="p-3.5 bg-rose-50/60 rounded-xl border border-rose-200/60 flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-rose-950">Patron Refund Claims</span>
                    <Badge variant="danger" size="xs">{pendingRefunds.length}</Badge>
                  </div>
                  <p className="text-[11px] text-rose-800 mt-0.5">
                    {pendingRefunds.length > 0
                      ? `${pendingRefunds.length} disputes awaiting platform arbitration.`
                      : 'No open refund dispute claims.'}
                  </p>
                </div>
                <Link to="/admin/refunds">
                  <Button variant="outline" size="xs" className="bg-white">
                    Arbitrate
                  </Button>
                </Link>
              </div>

              {/* Low Stock Alerts */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">Inventory Depletion Alerts</span>
                    <Badge variant="default" size="xs">{lowStockProducts.length}</Badge>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {lowStockProducts.length} creations currently at or below minimum threshold.
                  </p>
                </div>
                <Link to="/admin/products">
                  <Button variant="outline" size="xs" className="bg-white">
                    Inspect Catalog
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Compact Activity Feed (5 Cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-slate-700" />
                <h3 className="text-base font-serif font-bold text-slate-900">
                  Marketplace Activity Log
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">Real-time</span>
            </div>

            <div className="space-y-3.5 text-xs">
              {activityFeed.map((act) => (
                <div key={act.id} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{act.title}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{act.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{act.desc}</p>
                    <Link to={act.link} className="text-[10px] font-semibold text-amber-800 hover:underline inline-block pt-0.5">
                      View details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Orders Overview */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-serif font-bold text-slate-900">
                Recent Marketplace Orders
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time transactions across all accredited sellers.
              </p>
            </div>
            <Link to="/admin/orders">
              <Button variant="outline" size="xs" rightIcon={ChevronRight}>
                View All Orders ({orders.length})
              </Button>
            </Link>
          </div>

          {/* Desktop Orders Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-y border-slate-200">
                <tr>
                  <th className="py-3 px-3">Order ID</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Seller</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">Payment</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-3 font-semibold text-slate-900 font-mono">
                      {order.orderNumber || order.id}
                    </td>
                    <td className="py-3.5 px-3">
                      <p className="font-semibold text-slate-900">{order.customerName}</p>
                      <p className="text-[10px] text-slate-400">{order.customerEmail}</p>
                    </td>
                    <td className="py-3.5 px-3 text-slate-700 font-medium">
                      {order.seller}
                    </td>
                    <td className="py-3.5 px-3 font-serif font-bold text-slate-900">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="py-3.5 px-3 text-slate-500 text-[11px]">
                      {order.paymentMethod}
                    </td>
                    <td className="py-3.5 px-3">
                      <Badge variant={getOrderStatusBadgeVariant(order.fulfillmentStatus)} size="xs">
                        {order.fulfillmentStatus}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-3 text-slate-500 text-[11px] whitespace-nowrap">
                      {order.date}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <Link to={`/admin/orders/${order.id}`}>
                        <Button variant="ghost" size="xs">
                          Inspect
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Orders Responsive Card List */}
          <div className="md:hidden divide-y divide-slate-100">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="py-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-slate-900">
                    {order.orderNumber || order.id}
                  </span>
                  <Badge variant={getOrderStatusBadgeVariant(order.fulfillmentStatus)} size="xs">
                    {order.fulfillmentStatus}
                  </Badge>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Customer: <strong className="text-slate-900">{order.customerName}</strong></span>
                  <span className="font-serif font-bold text-slate-900">{formatCurrency(order.total)}</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Seller: {order.seller}</span>
                  <span>{order.date}</span>
                </div>
                <div className="pt-1">
                  <Link to={`/admin/orders/${order.id}`} className="block">
                    <Button variant="outline" size="xs" className="w-full">
                      Inspect Order
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboardPage;
