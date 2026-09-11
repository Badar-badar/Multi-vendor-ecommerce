import { createSlice } from '@reduxjs/toolkit';
import { fetchSellerAnalytics, fetchSellerProducts, fetchSellerProfile } from './sellerThunk';

const INITIAL_SELLER_PROFILE = {
  id: 'sel-1',
  storeName: 'Atelier Maison',
  ownerName: 'Jean-Luc Moreau',
  email: 'jeanluc@ateliermaison.fr',
  phone: '+33 1 42 68 55 00',
  category: 'Haute Couture & Fine Tailoring',
  description: 'Master French atelier specializing in hand-woven silk outerwear, tailored trench coats, and bespoke evening ensembles crafted in the heart of Paris.',
  story: 'Founded in 1984 on Rue Saint-Honoré, Atelier Maison honors centuries of French craftsmanship. Every garment passes through the hands of master artisans using organic Mulberry silks and hand-finished horn buttons.',
  address: '28 Place Vendôme, Suite 4',
  city: 'Paris',
  country: 'France',
  logo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
  banner: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop',
  verified: true,
  rating: 4.95,
  reviewCount: 84,
  joinedDate: 'March 2024',
  status: 'Approved', // 'Pending' | 'Approved' | 'Rejected'
};

const INITIAL_SELLER_PRODUCTS = [
  {
    id: 'prod-101',
    name: 'Hand-Woven Silk Trench Coat',
    slug: 'hand-woven-silk-trench-coat',
    brand: 'Atelier Maison',
    category: 'clothing',
    subcategory: 'Outerwear',
    sku: 'AM-TR-001',
    price: 840,
    compareAtPrice: 950,
    costPerItem: 320,
    stock: 8,
    reservedStock: 1,
    lowStockThreshold: 3,
    status: 'Active',
    images: [
      'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop',
    ],
    variants: [
      { name: 'Size', options: ['S', 'M', 'L', 'XL'] },
      { name: 'Color', options: ['Obsidian Black', 'Champagne Beige'] },
    ],
    specifications: [
      { name: 'Material', value: '100% Organic Mulberry Silk' },
      { name: 'Lining', value: 'Hand-Dyed Cupro' },
      { name: 'Buttons', value: 'Genuine Horn' },
      { name: 'Country of Origin', value: 'France' },
      { name: 'Care', value: 'Dry Clean Only' },
    ],
    shipping: {
      weight: '1.2',
      dimensions: '45 x 35 x 8 cm',
      handlingTime: '2',
    },
    salesCount: 38,
    revenue: 31920,
    rating: 4.9,
    updatedAt: '2026-08-28',
  },
  {
    id: 'prod-102',
    name: 'Double-Breasted Wool & Cashmere Blazer',
    slug: 'wool-cashmere-blazer',
    brand: 'Atelier Maison',
    category: 'clothing',
    subcategory: 'Tailoring',
    sku: 'AM-BL-002',
    price: 680,
    compareAtPrice: 750,
    costPerItem: 260,
    stock: 2, // Low stock
    reservedStock: 0,
    lowStockThreshold: 3,
    status: 'Active',
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop',
    ],
    variants: [
      { name: 'Size', options: ['38R', '40R', '42R'] },
      { name: 'Color', options: ['Midnight Navy', 'Charcoal'] },
    ],
    specifications: [
      { name: 'Material', value: '70% Merino Wool, 30% Mongolian Cashmere' },
      { name: 'Origin', value: 'France' },
    ],
    shipping: {
      weight: '1.5',
      dimensions: '50 x 40 x 10 cm',
      handlingTime: '3',
    },
    salesCount: 24,
    revenue: 16320,
    rating: 4.8,
    updatedAt: '2026-08-25',
  },
  {
    id: 'prod-103',
    name: 'Pleated Crepe Evening Gown',
    slug: 'pleated-crepe-evening-gown',
    brand: 'Atelier Maison',
    category: 'clothing',
    subcategory: 'Eveningwear',
    sku: 'AM-GW-003',
    price: 1150,
    compareAtPrice: 1300,
    costPerItem: 450,
    stock: 0, // Out of stock
    reservedStock: 0,
    lowStockThreshold: 2,
    status: 'Draft',
    images: [
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=600&auto=format&fit=crop',
    ],
    variants: [
      { name: 'Size', options: ['FR 36', 'FR 38', 'FR 40'] },
      { name: 'Color', options: ['Emerald Green', 'Royal Ruby'] },
    ],
    specifications: [
      { name: 'Material', value: 'Silk Georgette Crepe' },
      { name: 'Origin', value: 'France' },
    ],
    shipping: {
      weight: '0.9',
      dimensions: '40 x 30 x 6 cm',
      handlingTime: '4',
    },
    salesCount: 15,
    revenue: 17250,
    rating: 5.0,
    updatedAt: '2026-08-20',
  },
  {
    id: 'prod-104',
    name: 'Hand-Stitched Calfskin Weekender Bag',
    slug: 'calfskin-weekender-bag',
    brand: 'Atelier Maison',
    category: 'accessories',
    subcategory: 'Leather Goods',
    sku: 'AM-BG-004',
    price: 1420,
    compareAtPrice: 1600,
    costPerItem: 520,
    stock: 5,
    reservedStock: 1,
    lowStockThreshold: 2,
    status: 'Active',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop',
    ],
    variants: [
      { name: 'Color', options: ['Cognac Tan', 'Ebony Black'] },
    ],
    specifications: [
      { name: 'Leather', value: 'Full-Grain French Calfskin' },
      { name: 'Hardware', value: 'Solid Palladium-Plated Brass' },
    ],
    shipping: {
      weight: '2.4',
      dimensions: '55 x 35 x 25 cm',
      handlingTime: '2',
    },
    salesCount: 19,
    revenue: 26980,
    rating: 4.95,
    updatedAt: '2026-08-26',
  },
];

const INITIAL_SELLER_ORDERS = [
  {
    id: 'ZR-84920',
    orderNumber: 'ZRN-84920-7712',
    date: '2026-08-28',
    customer: {
      name: 'Sarah Jenkins',
      email: 'sarah.jenkins@example.com',
      city: 'New York, NY',
      country: 'United States',
      address: '740 Park Avenue, Penthouse 14B',
      phone: '+1 (555) 019-2834',
    },
    items: [
      {
        id: 'prod-101',
        name: 'Hand-Woven Silk Trench Coat',
        sku: 'AM-TR-001',
        price: 840,
        quantity: 1,
        variant: 'Size: M | Color: Obsidian Black',
        image: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=300&auto=format&fit=crop',
      },
    ],
    amount: 840,
    paymentStatus: 'Paid via Stripe',
    status: 'In Transit', // 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'In Transit' | 'Delivered' | 'Cancelled' | 'Return Requested'
    shippingMethod: 'Sovereign White-Glove Express',
    trackingNumber: 'TRK-ZRN-981240-US',
  },
  {
    id: 'ZR-84918',
    orderNumber: 'ZRN-84918-6621',
    date: '2026-08-27',
    customer: {
      name: 'Julian Sterling',
      email: 'julian.sterling@gmail.com',
      city: 'London',
      country: 'United Kingdom',
      address: '14 Kensington Palace Gardens',
      phone: '+44 20 7946 0912',
    },
    items: [
      {
        id: 'prod-102',
        name: 'Double-Breasted Wool & Cashmere Blazer',
        sku: 'AM-BL-002',
        price: 680,
        quantity: 1,
        variant: 'Size: 40R | Color: Midnight Navy',
        image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=300&auto=format&fit=crop',
      },
    ],
    amount: 680,
    paymentStatus: 'Paid via Apple Pay',
    status: 'Processing',
    shippingMethod: 'Standard Insured Courier',
    trackingNumber: null,
  },
  {
    id: 'ZR-84890',
    orderNumber: 'ZRN-84890-3320',
    date: '2026-08-25',
    customer: {
      name: 'Victoria Vance',
      email: 'victoria@vance.luxury',
      city: 'Geneva',
      country: 'Switzerland',
      address: '8 Quai du Mont-Blanc',
      phone: '+41 22 909 7000',
    },
    items: [
      {
        id: 'prod-101',
        name: 'Hand-Woven Silk Trench Coat',
        sku: 'AM-TR-001',
        price: 840,
        quantity: 2,
        variant: 'Size: S | Color: Champagne Beige',
        image: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=300&auto=format&fit=crop',
      },
    ],
    amount: 1680,
    paymentStatus: 'Paid via Stripe',
    status: 'Delivered',
    shippingMethod: 'Sovereign White-Glove Express',
    trackingNumber: 'TRK-ZRN-772190-CH',
  },
  {
    id: 'ZR-84860',
    orderNumber: 'ZRN-84860-1102',
    date: '2026-08-22',
    customer: {
      name: 'Alexandre DuPont',
      email: 'alex.dupont@paris.fr',
      city: 'Lyon',
      country: 'France',
      address: '12 Rue de la République',
      phone: '+33 4 72 10 30 30',
    },
    items: [
      {
        id: 'prod-104',
        name: 'Hand-Stitched Calfskin Weekender Bag',
        sku: 'AM-BG-004',
        price: 1420,
        quantity: 1,
        variant: 'Color: Cognac Tan',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=300&auto=format&fit=crop',
      },
    ],
    amount: 1420,
    paymentStatus: 'Paid via Stripe',
    status: 'Delivered',
    shippingMethod: 'Sovereign White-Glove Express',
    trackingNumber: 'TRK-ZRN-551029-FR',
  },
];

const INITIAL_SELLER_RETURNS = [
  {
    id: 'RET-1092',
    orderId: 'ZR-84890',
    orderNumber: 'ZRN-84890-3320',
    date: '2026-08-29',
    customer: {
      name: 'Victoria Vance',
      email: 'victoria@vance.luxury',
    },
    product: {
      id: 'prod-101',
      name: 'Hand-Woven Silk Trench Coat',
      sku: 'AM-TR-001',
      price: 840,
      quantity: 1,
      variant: 'Size: S | Color: Champagne Beige',
      image: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=300&auto=format&fit=crop',
    },
    reason: 'Size exchange requested - Needs Size M instead of S',
    status: 'Requested', // 'Requested' | 'Approved' | 'Rejected' | 'Received' | 'Refunded'
    amount: 840,
  },
  {
    id: 'RET-1088',
    orderId: 'ZR-84860',
    orderNumber: 'ZRN-84860-1102',
    date: '2026-08-24',
    customer: {
      name: 'Alexandre DuPont',
      email: 'alex.dupont@paris.fr',
    },
    product: {
      id: 'prod-104',
      name: 'Hand-Stitched Calfskin Weekender Bag',
      sku: 'AM-BG-004',
      price: 1420,
      quantity: 1,
      variant: 'Color: Cognac Tan',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=300&auto=format&fit=crop',
    },
    reason: 'Duplicate gift order - Client requested store credit voucher',
    status: 'Refunded',
    amount: 1420,
  },
];

const INITIAL_SELLER_NOTIFICATIONS = [
  {
    id: 'notif-1',
    category: 'Orders',
    title: 'New Sovereign Order Placed',
    message: 'Sarah Jenkins acquired 1x Hand-Woven Silk Trench Coat ($840.00).',
    timestamp: '15m ago',
    date: '2026-08-28',
    isRead: false,
    link: '/seller/orders/ZR-84920',
  },
  {
    id: 'notif-2',
    category: 'Inventory',
    title: 'Low Stock Alert Threshold Reached',
    message: 'Double-Breasted Wool & Cashmere Blazer has only 2 units remaining in atelier.',
    timestamp: '2h ago',
    date: '2026-08-28',
    isRead: false,
    link: '/seller/inventory',
  },
  {
    id: 'notif-3',
    category: 'Returns',
    title: 'Return Request Filed',
    message: 'Victoria Vance requested size adjustment for Order #ZRN-84890-3320.',
    timestamp: '5h ago',
    date: '2026-08-28',
    isRead: false,
    link: '/seller/returns',
  },
  {
    id: 'notif-4',
    category: 'Payments',
    title: 'Bi-Weekly Escrow Settlement Dispatched',
    message: 'A wire disbursement of $14,280.00 has been transferred to BNP Paribas account ending in ••8940.',
    timestamp: '1d ago',
    date: '2026-08-27',
    isRead: true,
    link: '/seller/analytics',
  },
  {
    id: 'notif-5',
    category: 'Store',
    title: 'Atelier Hallmarked Accreditation Renewed',
    message: 'Your sovereign artisan accreditation status is active through Q3 2027.',
    timestamp: '3d ago',
    date: '2026-08-25',
    isRead: true,
    link: '/seller/store',
  },
];

const INITIAL_SELLER_ANALYTICS = {
  totalRevenue: 65490,
  monthlyRevenue: 18450,
  growthRate: 18.4,
  totalOrders: 142,
  pendingFulfillment: 3,
  activeListings: 18,
  lowStockCount: 2,
  averageOrderValue: 860,
  customersCount: 94,
  repeatCustomerRate: 32.5,
  conversionRate: 3.8,
  salesTrend7d: [
    { period: 'Mon', revenue: 2400, orders: 3 },
    { period: 'Tue', revenue: 4100, orders: 5 },
    { period: 'Wed', revenue: 3200, orders: 4 },
    { period: 'Thu', revenue: 5800, orders: 7 },
    { period: 'Fri', revenue: 7200, orders: 9 },
    { period: 'Sat', revenue: 8900, orders: 11 },
    { period: 'Sun', revenue: 6400, orders: 8 },
  ],
  salesTrend30d: [
    { period: 'Week 1', revenue: 14200, orders: 18 },
    { period: 'Week 2', revenue: 16800, orders: 22 },
    { period: 'Week 3', revenue: 15400, orders: 19 },
    { period: 'Week 4', revenue: 19090, orders: 25 },
  ],
  salesTrend3m: [
    { period: 'June', revenue: 18400, orders: 26 },
    { period: 'July', revenue: 22800, orders: 31 },
    { period: 'August', revenue: 24290, orders: 35 },
  ],
  salesTrend12m: [
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
  ],
  categoryBreakdown: [
    { name: 'Outerwear', value: 45 },
    { name: 'Tailoring', value: 30 },
    { name: 'Eveningwear', value: 15 },
    { name: 'Leather Goods', value: 10 },
  ],
};

const initialState = {
  profile: INITIAL_SELLER_PROFILE,
  products: INITIAL_SELLER_PRODUCTS,
  orders: INITIAL_SELLER_ORDERS,
  returns: INITIAL_SELLER_RETURNS,
  notifications: INITIAL_SELLER_NOTIFICATIONS,
  analytics: INITIAL_SELLER_ANALYTICS,
  loading: false,
  error: null,
};

export const sellerSlice = createSlice({
  name: 'seller',
  initialState,
  reducers: {
    setSellerProfile: (state, action) => {
      state.profile = action.payload;
    },
    updateStoreProfile: (state, action) => {
      state.profile = { ...state.profile, ...action.payload };
    },
    addProduct: (state, action) => {
      const newProduct = {
        id: `prod-${Date.now()}`,
        salesCount: 0,
        revenue: 0,
        rating: 5.0,
        status: 'Active',
        updatedAt: new Date().toISOString().split('T')[0],
        ...action.payload,
      };
      state.products.unshift(newProduct);
    },
    updateProduct: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.products.findIndex((p) => p.id === id);
      if (index > -1) {
        state.products[index] = {
          ...state.products[index],
          ...updates,
          updatedAt: new Date().toISOString().split('T')[0],
        };
      }
    },
    deleteProduct: (state, action) => {
      const id = action.payload;
      state.products = state.products.filter((p) => p.id !== id);
    },
    updateInventoryStock: (state, action) => {
      const { id, stock, lowStockThreshold } = action.payload;
      const product = state.products.find((p) => p.id === id);
      if (product) {
        if (stock !== undefined) product.stock = Number(stock);
        if (lowStockThreshold !== undefined) product.lowStockThreshold = Number(lowStockThreshold);
        product.updatedAt = new Date().toISOString().split('T')[0];
      }
    },
    updateOrderStatus: (state, action) => {
      const { orderId, status, trackingNumber } = action.payload;
      const order = state.orders.find((o) => o.id === orderId || o.orderNumber === orderId);
      if (order) {
        order.status = status;
        if (trackingNumber) order.trackingNumber = trackingNumber;
      }
    },
    updateReturnStatus: (state, action) => {
      const { returnId, status } = action.payload;
      const ret = state.returns.find((r) => r.id === returnId);
      if (ret) {
        ret.status = status;
      }
    },
    markSellerNotificationRead: (state, action) => {
      const id = action.payload;
      const notif = state.notifications.find((n) => n.id === id);
      if (notif) notif.isRead = true;
    },
    markAllSellerNotificationsRead: (state) => {
      state.notifications.forEach((n) => {
        n.isRead = true;
      });
    },
    deleteSellerNotification: (state, action) => {
      const id = action.payload;
      state.notifications = state.notifications.filter((n) => n.id !== id);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSellerProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSellerProfile.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) state.profile = action.payload;
      })
      .addCase(fetchSellerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchSellerProducts.fulfilled, (state, action) => {
        if (action.payload && action.payload.length > 0) {
          state.products = action.payload;
        }
      })
      .addCase(fetchSellerAnalytics.fulfilled, (state, action) => {
        if (action.payload) {
          state.analytics = action.payload;
        }
      });
  },
});

export const {
  setSellerProfile,
  updateStoreProfile,
  addProduct,
  updateProduct,
  deleteProduct,
  updateInventoryStock,
  updateOrderStatus,
  updateReturnStatus,
  markSellerNotificationRead,
  markAllSellerNotificationsRead,
  deleteSellerNotification,
} = sellerSlice.actions;

export default sellerSlice.reducer;
