import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  TrendingUp,
  Store,
  Settings,
  ShieldCheck,
  Tag,
  Plus,
  BarChart3,
  Layers,
  Award,
  CreditCard,
  Percent,
  MessageSquare,
  Users,
  ShieldAlert,
} from 'lucide-react';
export const marketplaceNavigation = [
  { name: 'Home', path: '/' },
  { name: 'Collections', path: '/products' },
  { name: 'Categories', path: '/categories' },
  { name: 'Artisan Sellers', path: '/sellers' },
  { name: 'About Zareen', path: '/about' },
];

export const headerNavigation = marketplaceNavigation;

export const sellerNavigation = [
  {
    group: 'Overview',
    items: [
      { name: 'Dashboard', path: '/seller/dashboard', icon: LayoutDashboard, exact: true },
    ],
  },
  {
    group: 'Catalog',
    items: [
      { name: 'Creations & Products', path: '/seller/products', icon: Package },
      { name: 'Add New Listing', path: '/seller/products/create', icon: Plus },
    ],
  },
  {
    group: 'Orders',
    items: [
      { name: 'Fulfillment Orders', path: '/seller/orders', icon: ShoppingCart },
    ],
  },
  {
    group: 'Store',
    items: [
      { name: 'Atelier Public Store', path: '/seller/store', icon: Store },
      { name: 'Store Settings', path: '/seller/settings', icon: Settings },
    ],
  },
  {
    group: 'Analytics & Reputation',
    items: [
      { name: 'Sales Analytics', path: '/seller/analytics', icon: TrendingUp },
      { name: 'Patron Reviews', path: '/seller/reviews', icon: ShieldCheck },
      { name: 'Privilege Coupons', path: '/seller/coupons', icon: Tag },
    ],
  },
];

export const adminNavigation = [
  {
    group: 'Overview',
    items: [
      { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard, exact: true },
      { name: 'Executive Reports', path: '/admin/reports', icon: BarChart3 },
    ],
  },
  {
    group: 'Catalog',
    items: [
      { name: 'Products', path: '/admin/products', icon: Package },
      { name: 'Categories', path: '/admin/categories', icon: Layers },
      { name: 'Brands', path: '/admin/brands', icon: Award },
    ],
  },
  {
    group: 'Marketplace',
    items: [
      { name: 'Sellers', path: '/admin/sellers', icon: Store },
      { name: 'Customers & Users', path: '/admin/users', icon: Users },
      { name: 'Orders Oversight', path: '/admin/orders', icon: ShoppingCart },
    ],
  },
  {
    group: 'Finance',
    items: [
      { name: 'Payments & Escrow', path: '/admin/payments', icon: CreditCard },
      { name: 'Commissions', path: '/admin/commissions', icon: Percent },
    ],
  },
  {
    group: 'Marketing',
    items: [
      { name: 'VIP Coupons', path: '/admin/coupons', icon: Tag },
    ],
  },
  {
    group: 'Moderation',
    items: [
      { name: 'Review Moderation', path: '/admin/reviews', icon: MessageSquare },
    ],
  },
  {
    group: 'System',
    items: [
      { name: 'Audit Sentinel', path: '/admin/audit-logs', icon: ShieldAlert },
      { name: 'Platform Settings', path: '/admin/settings', icon: Settings },
    ],
  },
];

export const footerNavigation = {
  shop: [
    { name: 'Luxury Apparel', path: '/products?category=luxury-apparel' },
    { name: 'Fine Jewelry', path: '/products?category=fine-jewelry' },
    { name: 'Artisanal Home & Living', path: '/products?category=artisanal-home-living' },
    { name: 'Leather Goods', path: '/products?category=leather-goods' },
    { name: 'Niche Fragrance', path: '/products?category=niche-fragrance-beauty' },
    { name: 'New Arrivals', path: '/products?sort=newest' },
  ],
  support: [
    { name: 'Track Order', path: '/orders/track' },
    { name: 'Shipping & Delivery', path: '/shipping-policy' },
    { name: 'Returns & Exchanges', path: '/returns' },
    { name: 'Authenticity Guarantee', path: '/authenticity' },
    { name: 'Contact Concierge', path: '/contact' },
    { name: 'FAQs', path: '/faq' },
  ],
  company: [
    { name: 'Our Story', path: '/about' },
    { name: 'Artisan Community', path: '/sellers' },
    { name: 'Sustainability', path: '/sustainability' },
    { name: 'Press & Media', path: '/press' },
    { name: 'Trust & Security', path: '/security' },
    { name: 'Terms of Service', path: '/terms' },
  ],
  partners: [
    { name: 'Become a Seller', path: '/seller/register' },
    { name: 'Seller Portal', path: '/seller/dashboard' },
    { name: 'Admin Console', path: '/admin/dashboard' },
    { name: 'Affiliate Program', path: '/affiliates' },
  ],
};
