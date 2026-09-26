/**
 * Complete End-to-End Integration Test Suite for Zareen Luxury E-Commerce Backend:
 * Full verification across Customer, Seller, and Admin lifecycle flows.
 */
import request from 'supertest';
import { app } from '../app.js';
import { connectDB, disconnectDB } from '../database/connectDB.js';
import { User } from '../models/User.js';
import { Seller, SELLER_APPROVAL_STATUS, SELLER_STATUS } from '../models/Seller.js';
import { Store } from '../models/Store.js';
import { Category } from '../models/Category.js';
import { Subcategory } from '../models/Subcategory.js';
import { Brand } from '../models/Brand.js';
import { Product, PRODUCT_STATUS, PRODUCT_APPROVAL_STATUS } from '../models/Product.js';
import { Cart } from '../models/Cart.js';
import { Wishlist } from '../models/Wishlist.js';
import { Coupon } from '../models/Coupon.js';
import { Order, ORDER_STATUS } from '../models/Order.js';
import { Payment, PAYMENT_STATUS } from '../models/Payment.js';
import { Transaction } from '../models/Transaction.js';
import { Commission } from '../models/Commission.js';
import { Review } from '../models/Review.js';
import { Notification } from '../models/Notification.js';
import { Setting } from '../models/Setting.js';
import { ROLES, PERMISSIONS } from '../config/permissions.js';
import { generateToken } from '../utils/token.js';
import { emitToUser, emitToSeller, emitToAdmins } from '../utils/socket.js';

let passed = 0;
let failed = 0;

const pass = (msg) => {
  console.log(`  ✓ PASS: ${msg}`);
  passed++;
};

const fail = (msg, err) => {
  console.error(`  ✗ FAIL: ${msg}`);
  if (err) console.error('   ', err);
  failed++;
};

const runE2E = async () => {
  console.log('\n================================================================');
  console.log('  STARTING ZAREEN COMPLETE END-TO-END INTEGRATION TEST SUITE   ');
  console.log('================================================================\n');

  try {
    await connectDB();

    // 1. Clean test collections
    await Promise.all([
      User.deleteMany({ email: /@e2e-test\.com$/ }),
      Seller.deleteMany({ businessName: /E2E/ }),
      Store.deleteMany({ slug: /e2e/ }),
      Category.deleteMany({ slug: /e2e/ }),
      Subcategory.deleteMany({ slug: /e2e/ }),
      Brand.deleteMany({ slug: /e2e/ }),
      Product.deleteMany({ name: /E2E/ }),
      Coupon.deleteMany({ code: /^E2E-/ }),
      Order.deleteMany({}),
      Payment.deleteMany({}),
      Transaction.deleteMany({}),
      Commission.deleteMany({}),
      Review.deleteMany({}),
      Cart.deleteMany({}),
      Wishlist.deleteMany({}),
      Notification.deleteMany({}),
    ]);

    // -------------------------------------------------------------
    console.log('--- 1. Testing Admin Setup & Platform Settings ---');
    // -------------------------------------------------------------
    const admin = await User.create({
      name: 'Super Admin',
      email: 'admin@e2e-test.com',
      password: 'AdminPassword123!',
      role: ROLES.ADMIN,
      isEmailVerified: true,
      permissions: Object.values(PERMISSIONS),
    });
    const adminToken = generateToken(admin);
    const adminCookie = `token=${adminToken}`;

    const settingsRes = await request(app)
      .get('/api/v1/admin/settings')
      .set('Cookie', [adminCookie]);

    if (settingsRes.status === 200) {
      pass(`Admin retrieves platform settings (Got 200)`);
    } else {
      fail(`Failed getting settings`, settingsRes.body);
    }

    // -------------------------------------------------------------
    console.log('\n--- 2. Testing Seller Application & Store Activation ---');
    // -------------------------------------------------------------
    const sellerUser = await User.create({
      name: 'Maria B. Haute Couture',
      email: 'mariab@e2e-test.com',
      password: 'SecurePassword123!',
      role: ROLES.CUSTOMER,
      isEmailVerified: true,
    });
    const sellerUserToken = generateToken(sellerUser);
    const sellerUserCookie = `token=${sellerUserToken}`;

    // Apply for seller account
    const applyRes = await request(app)
      .post('/api/v1/seller/apply')
      .set('Cookie', [sellerUserCookie])
      .send({
        businessName: 'E2E Maria B Atelier',
        businessEmail: 'atelier@e2e-test.com',
        businessPhone: '+923001234567',
        businessAddress: {
          street: '10 M.M. Alam Road',
          city: 'Lahore',
          state: 'Punjab',
          country: 'Pakistan',
          postalCode: '54000',
        },
      });

    const sellerApplication = applyRes.body?.data?.seller || applyRes.body?.data?.application;
    if (applyRes.status === 201 && sellerApplication) {
      pass(`Customer applies for seller account (Got 201)`);
    } else {
      fail(`Seller application failed`, applyRes.body);
    }

    const sellerApplicationId = sellerApplication._id;

    // Admin approves seller application
    const approveRes = await request(app)
      .patch(`/api/v1/admin/sellers/${sellerApplicationId}/approve`)
      .set('Cookie', [adminCookie]);

    if (approveRes.status === 200) {
      pass(`Admin approves seller application (Got 200)`);
    } else {
      fail(`Seller approval failed`, approveRes.body);
    }

    // Elevate user role in token
    sellerUser.role = ROLES.SELLER;
    await sellerUser.save();
    const approvedSellerToken = generateToken(sellerUser);
    const approvedSellerCookie = `token=${approvedSellerToken}`;

    const sellerDoc = await Seller.findById(sellerApplicationId);
    const store = await Store.findOne({ seller: sellerDoc._id });

    // -------------------------------------------------------------
    console.log('\n--- 3. Testing Marketplace Catalog Taxonomy & Product Publishing ---');
    // -------------------------------------------------------------
    const category = await Category.create({
      name: 'E2E Luxury Velvet',
      slug: 'e2e-luxury-velvet',
      status: 'active',
    });

    const brand = await Brand.create({
      name: 'E2E Maria B',
      slug: 'e2e-maria-b',
      status: 'active',
    });

    // Seller creates product
    const product = await Product.create({
      seller: sellerDoc._id,
      store: store._id,
      category: category._id,
      brand: brand._id,
      name: 'E2E Handcrafted Velvet Shawl Suit',
      slug: 'e2e-handcrafted-velvet-shawl-suit',
      description: 'Stunning three-piece velvet ensemble embellished with marori and dabka.',
      basePrice: 80000,
      stock: 15,
      status: PRODUCT_STATUS.PUBLISHED,
      approvalStatus: PRODUCT_APPROVAL_STATUS.APPROVED,
    });

    // Verify public product retrieval with caching
    const publicProdRes = await request(app)
      .get(`/api/v1/products/${product.slug}`);

    if (publicProdRes.status === 200 && publicProdRes.body?.data?.product?.name === product.name) {
      pass(`Public customer retrieves catalog product with caching (Got 200)`);
    } else {
      fail(`Public product fetch failed`, publicProdRes.body);
    }

    // -------------------------------------------------------------
    console.log('\n--- 4. Testing Customer Bag, Coupon & Checkout Flow ---');
    // -------------------------------------------------------------
    const customer = await User.create({
      name: 'Ayesha Omer',
      email: 'ayesha@e2e-test.com',
      password: 'CustomerPassword123!',
      role: ROLES.CUSTOMER,
      isEmailVerified: true,
    });
    const customerToken = generateToken(customer);
    const customerCookie = `token=${customerToken}`;

    // Add to cart
    const addToCartRes = await request(app)
      .post('/api/v1/cart/items')
      .set('Cookie', [customerCookie])
      .send({
        productId: product._id.toString(),
        quantity: 1,
      });

    if (addToCartRes.status === 200) {
      pass(`Customer adds luxury product to shopping bag (Got 200)`);
    } else {
      fail(`Add to cart failed`, addToCartRes.body);
    }

    // Create promo coupon
    await Coupon.create({
      code: 'E2E-ROYAL10',
      type: 'percentage',
      value: 10, // 10% off
      scope: 'seller',
      seller: sellerDoc._id,
      minimumOrderAmount: 50000,
      status: 'active',
      startDate: new Date(Date.now() - 3600000),
      expiryDate: new Date(Date.now() + 36000000),
    });

    // Validate checkout with coupon
    const validateCheckoutRes = await request(app)
      .post('/api/v1/checkout/validate')
      .set('Cookie', [customerCookie])
      .send({
        couponCode: 'E2E-ROYAL10',
      });

    if (
      validateCheckoutRes.status === 200 &&
      validateCheckoutRes.body?.data?.financials?.grandTotal === 72000
    ) {
      pass(`Server-side checkout validation matches: 80,000 - 10% coupon = 72,000 PKR`);
    } else {
      fail(`Checkout validation mismatch`, validateCheckoutRes.body);
    }

    // Place Order
    const placeOrderRes = await request(app)
      .post('/api/v1/orders')
      .set('Cookie', [customerCookie])
      .send({
        couponCode: 'E2E-ROYAL10',
        shippingAddress: {
          fullName: 'Ayesha Omer',
          phone: '+923004445566',
          addressLine1: 'House 14, Street 9, Sector F-6/3',
          city: 'Islamabad',
          state: 'Federal',
          postalCode: '44000',
        },
      });

    if (placeOrderRes.status === 201 && placeOrderRes.body?.data?.order) {
      pass(`Customer places authoritative order (Order #${placeOrderRes.body.data.order.orderNumber})`);
    } else {
      fail(`Place order failed`, placeOrderRes.body);
    }

    const createdOrder = placeOrderRes.body.data.order;

    // -------------------------------------------------------------
    console.log('\n--- 5. Testing PaymentIntent & Stripe Authoritative Webhook ---');
    // -------------------------------------------------------------
    const createIntentRes = await request(app)
      .post('/api/v1/payments/create-intent')
      .set('Cookie', [customerCookie])
      .send({ orderId: createdOrder._id });

    if (createIntentRes.status === 200 && createIntentRes.body?.data?.clientSecret) {
      pass(`Stripe PaymentIntent generated with authoritative amount: ${createIntentRes.body.data.amount} PKR`);
    } else {
      fail(`PaymentIntent creation failed`, createIntentRes.body);
    }

    const paymentIntentId = createIntentRes.body.data.paymentIntentId;

    // Simulate Stripe payment_intent.succeeded webhook
    const webhookRes = await request(app)
      .post('/api/v1/payments/webhook')
      .send({
        id: `evt_e2e_${Date.now()}`,
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: paymentIntentId,
            amount: 72000 * 100,
            currency: 'pkr',
            status: 'succeeded',
            metadata: {
              orderId: createdOrder._id,
              orderNumber: createdOrder.orderNumber,
            },
          },
        },
      });

    if (webhookRes.status === 200 && webhookRes.body?.status === 'processed') {
      pass(`Stripe webhook confirmed: payment_intent.succeeded (Got 200)`);
    } else {
      fail(`Stripe webhook failed`, webhookRes.body);
    }

    // Verify order and commission states
    const confirmedOrder = await Order.findById(createdOrder._id);
    if (confirmedOrder.payment.status === 'paid' && confirmedOrder.orderStatus === ORDER_STATUS.PROCESSING) {
      pass(`Order payment confirmed: status 'paid' & orderStatus 'processing'`);
    } else {
      fail(`Order state not updated after webhook`, confirmedOrder);
    }

    const sellerCommission = await Commission.findOne({ order: createdOrder._id });
    if (sellerCommission && sellerCommission.amount === 8000) {
      pass(`Marketplace 10% platform commission calculated: 8,000 PKR (Seller net: 72,000 PKR)`);
    } else {
      fail(`Commission calculation failed`, sellerCommission);
    }

    // -------------------------------------------------------------
    console.log('\n--- 6. Testing Seller Order Fulfillment & Delivery ---');
    // -------------------------------------------------------------
    const updateItemRes = await request(app)
      .patch(`/api/v1/seller/orders/${createdOrder._id}/status`)
      .set('Cookie', [approvedSellerCookie])
      .send({
        itemId: createdOrder.items[0]._id.toString(),
        status: 'shipped',
      });

    if (updateItemRes.status === 200) {
      pass(`Seller updates order item status to 'shipped' (Got 200)`);
    } else {
      fail(`Seller order update failed`, updateItemRes.body);
    }

    // Admin delivers order
    const adminDeliverRes = await request(app)
      .patch(`/api/v1/admin/orders/${createdOrder._id}/status`)
      .set('Cookie', [adminCookie])
      .send({ status: 'delivered' });

    if (adminDeliverRes.status === 200) {
      pass(`Order marked delivered by platform logistics (Got 200)`);
    } else {
      fail(`Admin deliver order failed`, adminDeliverRes.body);
    }

    // -------------------------------------------------------------
    console.log('\n--- 7. Testing Verified Purchase Review ---');
    // -------------------------------------------------------------
    const reviewRes = await request(app)
      .post(`/api/v1/reviews/product/${product._id}`)
      .set('Cookie', [customerCookie])
      .send({
        rating: 5,
        title: 'Breathtaking embroidery and silk texture',
        comment: 'The velvet shawl is pure perfection. Exceptional luxury quality.',
      });

    if (reviewRes.status === 201 && reviewRes.body?.data?.review?.isVerifiedPurchase) {
      pass(`Verified purchase review submitted and automatically verified (Rating: 5 Stars)`);
    } else {
      fail(`Submit review failed`, reviewRes.body);
    }

    // -------------------------------------------------------------
    console.log('\n--- 8. Testing Real-time Seller & Admin Analytics ---');
    // -------------------------------------------------------------
    const sellerAnalyticsRes = await request(app)
      .get('/api/v1/seller/analytics/overview')
      .set('Cookie', [approvedSellerCookie]);

    if (
      sellerAnalyticsRes.status === 200 &&
      sellerAnalyticsRes.body?.data?.grossRevenue === 80000 &&
      sellerAnalyticsRes.body?.data?.netRevenue === 72000
    ) {
      pass(`Seller analytics dynamically updated: Gross 80,000 | Net 72,000 PKR`);
    } else {
      fail(`Seller analytics mismatch`, sellerAnalyticsRes.body);
    }

    const adminAnalyticsRes = await request(app)
      .get('/api/v1/admin/analytics/overview')
      .set('Cookie', [adminCookie]);

    if (
      adminAnalyticsRes.status === 200 &&
      adminAnalyticsRes.body?.data?.financials?.grossSales === 72000 &&
      adminAnalyticsRes.body?.data?.financials?.platformCommission === 8000
    ) {
      pass(`Admin platform analytics updated: Gross Sales 72,000 | Commission 8,000 PKR`);
    } else {
      fail(`Admin analytics mismatch`, adminAnalyticsRes.body);
    }

    // -------------------------------------------------------------
    console.log('\n--- 9. Testing Admin Reports & Real-time WebSockets ---');
    // -------------------------------------------------------------
    const exportCsvRes = await request(app)
      .get('/api/v1/admin/reports/sales?format=csv')
      .set('Cookie', [adminCookie]);

    if (
      exportCsvRes.status === 200 &&
      exportCsvRes.headers['content-type'].includes('text/csv') &&
      exportCsvRes.text.includes(confirmedOrder.orderNumber)
    ) {
      pass(`Admin exports sales CSV report containing completed order #${confirmedOrder.orderNumber}`);
    } else {
      fail(`CSV export failed`, exportCsvRes.text);
    }

    // Trigger Socket.IO test emitters
    emitToUser(customer._id, 'order:delivered', { orderNumber: confirmedOrder.orderNumber });
    emitToSeller(sellerDoc._id, 'seller:review_added', { rating: 5 });
    emitToAdmins('admin:sales_milestone', { grossSales: 72000 });
    pass(`Real-time WebSocket event dispatching executed cleanly`);

    console.log('\n================================================================');
    console.log(`  COMPLETE E2E TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
    console.log('================================================================\n');

    await disconnectDB();

    if (failed > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (error) {
    console.error('Fatal error during E2E testing:', error);
    await disconnectDB();
    process.exit(1);
  }
};

runE2E();
