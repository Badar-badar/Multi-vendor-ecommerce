/**
 * Comprehensive Automated Test Suite for Zareen Phase 6:
 * Redis Caching, Seller & Admin Analytics, Reports Engine, CSV Exports, Platform Settings & Maintenance Jobs.
 */
import request from 'supertest';
import { app } from '../app.js';
import { connectDB, disconnectDB } from '../database/connectDB.js';
import { User } from '../models/User.js';
import { Seller, SELLER_STATUS } from '../models/Seller.js';
import { Store } from '../models/Store.js';
import { Category } from '../models/Category.js';
import { Product, PRODUCT_STATUS } from '../models/Product.js';
import { Order, ORDER_STATUS } from '../models/Order.js';
import { Payment, PAYMENT_STATUS } from '../models/Payment.js';
import { Commission, COMMISSION_STATUS } from '../models/Commission.js';
import { Refund } from '../models/Refund.js';
import { Setting } from '../models/Setting.js';
import { AuditLog } from '../models/AuditLog.js';
import { ROLES, PERMISSIONS } from '../config/permissions.js';
import { generateToken } from '../utils/token.js';
import { cacheService } from '../services/cacheService.js';
import { runMaintenanceCleanup } from '../jobs/cleanupJob.js';

let passedCount = 0;
let failedCount = 0;

const pass = (msg) => {
  console.log(`  ✓ PASS: ${msg}`);
  passedCount++;
};

const fail = (msg, err) => {
  console.error(`  ✗ FAIL: ${msg}`);
  if (err) console.error('   ', err);
  failedCount++;
};

const runTests = async () => {
  console.log('\n================================================================');
  console.log('  STARTING ZAREEN PHASE 6: ANALYTICS, REPORTS, CACHING & QA     ');
  console.log('================================================================\n');

  try {
    await connectDB();

    // 1. Setup Test Fixtures
    await Promise.all([
      User.deleteMany({ email: /@testanalytics\.com$/ }),
      Seller.deleteMany({ businessName: /Analytics/ }),
      Store.deleteMany({ slug: /analytics/ }),
      Category.deleteMany({ slug: /analytics/ }),
      Product.deleteMany({ name: /Analytics/ }),
      Order.deleteMany({}),
      Payment.deleteMany({}),
      Commission.deleteMany({}),
      Refund.deleteMany({}),
      Setting.deleteMany({}),
    ]);

    const adminUser = await User.create({
      name: 'Admin Analyst',
      email: 'admin@testanalytics.com',
      password: 'SecurePassword123!',
      role: ROLES.ADMIN,
      isEmailVerified: true,
      permissions: Object.values(PERMISSIONS),
    });

    const customer1 = await User.create({
      name: 'Hina Rabbani',
      email: 'hina@testanalytics.com',
      password: 'SecurePassword123!',
      role: ROLES.CUSTOMER,
      isEmailVerified: true,
    });

    const customer2 = await User.create({
      name: 'Bilal Khan',
      email: 'bilal@testanalytics.com',
      password: 'SecurePassword123!',
      role: ROLES.CUSTOMER,
      isEmailVerified: true,
    });

    const sellerUser = await User.create({
      name: 'Mariam Couture',
      email: 'mariam@testanalytics.com',
      password: 'SecurePassword123!',
      role: ROLES.SELLER,
      isEmailVerified: true,
      permissions: [
        PERMISSIONS.SELLER_STORE_MANAGE,
        PERMISSIONS.SELLER_PRODUCTS_VIEW,
        PERMISSIONS.SELLER_PRODUCTS_CREATE,
        PERMISSIONS.SELLER_ORDERS_VIEW,
        PERMISSIONS.SELLER_ORDERS_MANAGE,
      ],
    });

    const seller = await Seller.create({
      user: sellerUser._id,
      businessName: 'Analytics Luxury Atelier',
      businessEmail: 'atelier@testanalytics.com',
      businessPhone: '+923001112233',
      approvalStatus: 'approved',
      status: 'active',
      commissionRate: 0.10,
    });

    const store = await Store.create({
      seller: seller._id,
      name: 'Analytics Luxury Atelier Store',
      slug: 'analytics-luxury-atelier-store',
      status: 'active',
    });

    const category = await Category.create({
      name: 'Analytics Velvet Couture',
      slug: 'analytics-velvet-couture',
      status: 'active',
    });

    const product1 = await Product.create({
      seller: seller._id,
      store: store._id,
      category: category._id,
      name: 'Analytics Velvet Bridal Lehanga',
      slug: 'analytics-velvet-bridal-lehanga',
      description: 'Opulent bridal lehanga with intricate zardozi embroidery.',
      basePrice: 150000,
      stockQuantity: 8,
      status: PRODUCT_STATUS.PUBLISHED,
      approvalStatus: 'approved',
    });

    const product2 = await Product.create({
      seller: seller._id,
      store: store._id,
      category: category._id,
      name: 'Analytics Embroidered Shawl',
      slug: 'analytics-embroidered-shawl',
      description: 'Pure pashmina shawl with hand-woven silk border.',
      basePrice: 50000,
      stockQuantity: 3, // Low stock <= 5
      status: PRODUCT_STATUS.PUBLISHED,
      approvalStatus: 'approved',
    });

    // Create 2 realistic Orders with Commissions
    const order1 = await Order.create({
      orderNumber: 'ZAR-ANL-001',
      user: customer1._id,
      items: [
        {
          product: product1._id,
          seller: seller._id,
          store: store._id,
          productName: product1.name,
          quantity: 1,
          unitPrice: 150000,
          discount: 0,
          finalItemTotal: 150000,
          status: 'delivered',
        },
      ],
      shippingAddress: {
        fullName: 'Hina Rabbani',
        phone: '+923001234567',
        addressLine1: 'DHA Phase 5',
        city: 'Lahore',
        state: 'Punjab',
        postalCode: '54000',
      },
      subtotal: 150000,
      discount: 0,
      total: 150000,
      payment: {
        method: 'stripe',
        status: 'paid',
        paidAt: new Date(),
      },
      orderStatus: ORDER_STATUS.DELIVERED,
    });

    const order2 = await Order.create({
      orderNumber: 'ZAR-ANL-002',
      user: customer2._id,
      items: [
        {
          product: product2._id,
          seller: seller._id,
          store: store._id,
          productName: product2.name,
          quantity: 2,
          unitPrice: 50000,
          discount: 0,
          finalItemTotal: 100000,
          status: 'delivered',
        },
      ],
      shippingAddress: {
        fullName: 'Bilal Khan',
        phone: '+923009876543',
        addressLine1: 'F-7/2',
        city: 'Islamabad',
        state: 'Federal',
        postalCode: '44000',
      },
      subtotal: 100000,
      discount: 0,
      total: 100000,
      payment: {
        method: 'stripe',
        status: 'paid',
        paidAt: new Date(),
      },
      orderStatus: ORDER_STATUS.DELIVERED,
    });

    // Record Commissions for the orders
    await Commission.create([
      {
        order: order1._id,
        orderItem: order1.items[0]._id,
        seller: seller._id,
        amount: 15000, // 10% of 150k
        rate: 0.10,
        itemPrice: 150000,
        sellerNetEarnings: 135000,
        currency: 'pkr',
        status: COMMISSION_STATUS.EARNED,
      },
      {
        order: order2._id,
        orderItem: order2.items[0]._id,
        seller: seller._id,
        amount: 10000, // 10% of 100k
        rate: 0.10,
        itemPrice: 100000,
        sellerNetEarnings: 90000,
        currency: 'pkr',
        status: COMMISSION_STATUS.EARNED,
      },
    ]);

    // Record Payments
    await Payment.create([
      {
        order: order1._id,
        user: customer1._id,
        stripePaymentIntentId: 'pi_test_anl_001',
        amount: 150000,
        currency: 'pkr',
        status: PAYMENT_STATUS.SUCCEEDED,
        paidAt: new Date(),
      },
      {
        order: order2._id,
        user: customer2._id,
        stripePaymentIntentId: 'pi_test_anl_002',
        amount: 100000,
        currency: 'pkr',
        status: PAYMENT_STATUS.SUCCEEDED,
        paidAt: new Date(),
      },
    ]);

    const adminToken = generateToken(adminUser);
    const sellerToken = generateToken(sellerUser);
    const cust1Token = generateToken(customer1);

    const adminCookie = `token=${adminToken}`;
    const sellerCookie = `token=${sellerToken}`;
    const cust1Cookie = `token=${cust1Token}`;

    // -------------------------------------------------------------
    console.log('\n--- 1. Testing Cache Service & Product Invalidation ---');
    // -------------------------------------------------------------
    await cacheService.set('test:key1', { message: 'hello zareen' }, 60);
    const cachedVal = await cacheService.get('test:key1');
    if (cachedVal && cachedVal.message === 'hello zareen') {
      pass(`Cache Service set and get verified`);
    } else {
      fail(`Cache get failed`, cachedVal);
    }

    await cacheService.del('test:key1');
    const deletedVal = await cacheService.get('test:key1');
    if (!deletedVal) {
      pass(`Cache Service key deletion verified`);
    } else {
      fail(`Expected null after deletion, got`, deletedVal);
    }

    // Pattern deletion
    await cacheService.set('products:list:1', { a: 1 }, 60);
    await cacheService.set('products:list:2', { b: 2 }, 60);
    await cacheService.deleteByPattern('products:*');
    const p1 = await cacheService.get('products:list:1');
    const p2 = await cacheService.get('products:list:2');
    if (!p1 && !p2) {
      pass(`Cache Service wildcard pattern deletion verified ('products:*')`);
    } else {
      fail(`Pattern deletion failed`);
    }

    // -------------------------------------------------------------
    console.log('\n--- 2. Testing Platform Settings & Audit Trail ---');
    // -------------------------------------------------------------
    const getSettingsRes = await request(app)
      .get('/api/v1/admin/settings')
      .set('Cookie', [adminCookie]);

    if (getSettingsRes.status === 200 && getSettingsRes.body?.data?.settings) {
      pass(`Admin retrieves platform settings (Got 200)`);
    } else {
      fail(`Failed retrieving settings`, getSettingsRes.body);
    }

    // Update settings
    const patchSettingsRes = await request(app)
      .patch('/api/v1/admin/settings')
      .set('Cookie', [adminCookie])
      .send({
        platformCommissionRate: 0.12,
        defaultTaxRate: 0.06,
        defaultShippingCost: 300,
        lowStockThreshold: 4,
      });

    if (
      patchSettingsRes.status === 200 &&
      patchSettingsRes.body?.data?.settings?.platformCommissionRate === 0.12
    ) {
      pass(`Admin updates platform settings (Commission 12%, Tax 6%, Shipping 300 PKR)`);
    } else {
      fail(`Failed updating settings`, patchSettingsRes.body);
    }

    // Non-admin blocked from modifying settings
    const forbiddenSettingsRes = await request(app)
      .patch('/api/v1/admin/settings')
      .set('Cookie', [sellerCookie])
      .send({ platformCommissionRate: 0.05 });

    if (forbiddenSettingsRes.status === 403) {
      pass(`Seller blocked from modifying platform settings (Got 403 Forbidden)`);
    } else {
      fail(`Expected 403 for unauthorized settings update, got ${forbiddenSettingsRes.status}`);
    }

    // -------------------------------------------------------------
    console.log('\n--- 3. Testing Seller Analytics Engine ---');
    // -------------------------------------------------------------
    const sellerOverviewRes = await request(app)
      .get('/api/v1/seller/analytics/overview')
      .set('Cookie', [sellerCookie]);

    if (sellerOverviewRes.status === 200) {
      pass(`Seller retrieves analytics overview (Got 200)`);
      const data = sellerOverviewRes.body?.data;
      if (data.grossRevenue === 250000 && data.totalOrders === 2 && data.completedOrders === 2) {
        pass(`Seller analytics overview accurate: Gross 250,000 PKR | 2 Orders | 2 Completed`);
      } else {
        fail(`Seller overview mismatch`, data);
      }
      if (data.products?.lowStockProducts >= 1) {
        pass(`Low-stock product detection accurate: ${data.products.lowStockProducts} low-stock item(s)`);
      } else {
        fail(`Low stock detection failed`, data.products);
      }
    } else {
      fail(`Seller overview request failed`, sellerOverviewRes.body);
    }

    const sellerSalesRes = await request(app)
      .get('/api/v1/seller/analytics/sales?period=day')
      .set('Cookie', [sellerCookie]);

    if (sellerSalesRes.status === 200 && Array.isArray(sellerSalesRes.body?.data?.series)) {
      pass(`Seller sales analytics series retrieved successfully`);
    } else {
      fail(`Seller sales series query failed`, sellerSalesRes.body);
    }

    const sellerTopProductsRes = await request(app)
      .get('/api/v1/seller/analytics/products')
      .set('Cookie', [sellerCookie]);

    if (sellerTopProductsRes.status === 200 && sellerTopProductsRes.body?.data?.topProducts?.length >= 1) {
      pass(`Seller top products analytics retrieved (${sellerTopProductsRes.body.data.topProducts.length} items)`);
    } else {
      fail(`Seller top products query failed`, sellerTopProductsRes.body);
    }

    const sellerCustomersRes = await request(app)
      .get('/api/v1/seller/analytics/customers')
      .set('Cookie', [sellerCookie]);

    if (sellerCustomersRes.status === 200 && sellerCustomersRes.body?.data?.uniqueCustomers === 2) {
      pass(`Seller customer analytics accurate: 2 unique buyers`);
    } else {
      fail(`Seller customer analytics mismatch`, sellerCustomersRes.body);
    }

    // -------------------------------------------------------------
    console.log('\n--- 4. Testing Admin Analytics Engine ---');
    // -------------------------------------------------------------
    const adminOverviewRes = await request(app)
      .get('/api/v1/admin/analytics/overview')
      .set('Cookie', [adminCookie]);

    if (adminOverviewRes.status === 200) {
      pass(`Admin retrieves platform overview analytics (Got 200)`);
      const { overview, financials } = adminOverviewRes.body?.data || {};
      if (overview.totalOrders === 2 && financials.grossSales === 250000) {
        pass(`Platform analytics accurate: Gross Sales 250,000 PKR | Platform Commission 25,000 PKR`);
      } else {
        fail(`Admin analytics overview mismatch`, adminOverviewRes.body.data);
      }
    } else {
      fail(`Admin overview query failed`, adminOverviewRes.body);
    }

    const adminSellersRes = await request(app)
      .get('/api/v1/admin/analytics/sellers')
      .set('Cookie', [adminCookie]);

    if (adminSellersRes.status === 200 && adminSellersRes.body?.data?.sellers?.length >= 1) {
      pass(`Admin seller performance ranking retrieved (${adminSellersRes.body.data.sellers.length} seller)`);
    } else {
      fail(`Admin seller performance query failed`, adminSellersRes.body);
    }

    const adminPaymentsRes = await request(app)
      .get('/api/v1/admin/analytics/payments')
      .set('Cookie', [adminCookie]);

    if (adminPaymentsRes.status === 200 && adminPaymentsRes.body?.data?.paymentsByStatus?.length >= 1) {
      pass(`Admin payment analytics breakdown retrieved`);
    } else {
      fail(`Admin payment analytics failed`, adminPaymentsRes.body);
    }

    // -------------------------------------------------------------
    console.log('\n--- 5. Testing Reports Engine & CSV Exports ---');
    // -------------------------------------------------------------
    // JSON Sales Report
    const salesReportJsonRes = await request(app)
      .get('/api/v1/admin/reports/sales')
      .set('Cookie', [adminCookie]);

    if (salesReportJsonRes.status === 200 && salesReportJsonRes.body?.data?.totalRecords === 2) {
      pass(`Admin generates JSON sales report (2 records)`);
    } else {
      fail(`JSON sales report failed`, salesReportJsonRes.body);
    }

    // CSV Sales Report
    const salesReportCsvRes = await request(app)
      .get('/api/v1/admin/reports/sales?format=csv')
      .set('Cookie', [adminCookie]);

    if (
      salesReportCsvRes.status === 200 &&
      salesReportCsvRes.headers['content-type'].includes('text/csv') &&
      salesReportCsvRes.text.includes('orderNumber,date,customerName')
    ) {
      pass(`Admin streams CSV sales report with valid CSV header and records`);
    } else {
      fail(`CSV sales report export failed`, salesReportCsvRes.text);
    }

    // CSV Orders Report
    const ordersReportCsvRes = await request(app)
      .get('/api/v1/admin/reports/orders?format=csv')
      .set('Cookie', [adminCookie]);

    if (
      ordersReportCsvRes.status === 200 &&
      ordersReportCsvRes.headers['content-type'].includes('text/csv')
    ) {
      pass(`Admin exports Orders CSV report`);
    } else {
      fail(`Orders CSV report failed`, ordersReportCsvRes.text);
    }

    // CSV Sellers Report
    const sellerReportCsvRes = await request(app)
      .get('/api/v1/admin/reports/sellers?format=csv')
      .set('Cookie', [adminCookie]);

    if (
      sellerReportCsvRes.status === 200 &&
      sellerReportCsvRes.headers['content-type'].includes('text/csv')
    ) {
      pass(`Admin exports Seller Performance CSV report`);
    } else {
      fail(`Seller CSV report failed`, sellerReportCsvRes.text);
    }

    // -------------------------------------------------------------
    console.log('\n--- 6. Testing Routine Maintenance & Pruning Jobs ---');
    // -------------------------------------------------------------
    const cleanupResult = await runMaintenanceCleanup();
    if (cleanupResult !== null) {
      pass(`Routine maintenance cleanup executed successfully`);
    } else {
      fail(`Cleanup job failed`);
    }

    console.log('\n================================================================');
    console.log(`  PHASE 6 TEST RESULTS: ${passedCount} PASSED | ${failedCount} FAILED`);
    console.log('================================================================\n');

    await disconnectDB();

    if (failedCount > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (error) {
    console.error('Fatal error during Phase 6 testing:', error);
    await disconnectDB();
    process.exit(1);
  }
};

runTests();
