/**
 * Comprehensive Automated Test Suite for Zareen Phase 5:
 * Stripe Payments, Webhooks, Idempotency, Refunds, Multi-vendor Commissions, Notifications & Audit Logs.
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
import { Transaction, TRANSACTION_TYPE } from '../models/Transaction.js';
import { WebhookEvent, WEBHOOK_STATUS } from '../models/WebhookEvent.js';
import { Refund } from '../models/Refund.js';
import { Commission } from '../models/Commission.js';
import { Notification } from '../models/Notification.js';
import { AuditLog } from '../models/AuditLog.js';
import { ROLES, PERMISSIONS } from '../config/permissions.js';
import { generateToken } from '../utils/token.js';
import { emitToUser, emitToSeller, emitToAdmins } from '../utils/socket.js';

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
  console.log('  STARTING ZAREEN PHASE 5: STRIPE, REFUNDS, COMMISSIONS & REALTIME');
  console.log('================================================================\n');

  try {
    await connectDB();

    // 1. Clean Database collections for Phase 5 tests
    await Promise.all([
      User.deleteMany({ email: /@testpayment\.com$/ }),
      Seller.deleteMany({ businessName: /TestPayment/ }),
      Store.deleteMany({ slug: /testpayment/ }),
      Category.deleteMany({ slug: /test-pay/ }),
      Product.deleteMany({ name: /TestPayment/ }),
      Order.deleteMany({ orderNumber: /^ZAR-PAY-/ }),
      Payment.deleteMany({}),
      Transaction.deleteMany({}),
      WebhookEvent.deleteMany({}),
      Refund.deleteMany({}),
      Commission.deleteMany({}),
      Notification.deleteMany({}),
      AuditLog.deleteMany({}),
    ]);

    // 2. Setup Test Fixtures: Admin, Customer 1, Customer 2, Seller 1
    const adminUser = await User.create({
      name: 'Admin PayMaster',
      email: 'admin@testpayment.com',
      password: 'SecurePassword123!',
      role: ROLES.ADMIN,
      isEmailVerified: true,
      permissions: Object.values(PERMISSIONS),
    });

    const customer1 = await User.create({
      name: 'Ayla Khan',
      email: 'ayla@testpayment.com',
      password: 'SecurePassword123!',
      role: ROLES.CUSTOMER,
      isEmailVerified: true,
    });

    const customer2 = await User.create({
      name: 'Zara Ahmed',
      email: 'zara@testpayment.com',
      password: 'SecurePassword123!',
      role: ROLES.CUSTOMER,
      isEmailVerified: true,
    });

    const sellerUser = await User.create({
      name: 'Farhan Ali',
      email: 'seller@testpayment.com',
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
      businessName: 'TestPayment Atelier',
      businessEmail: 'atelier@testpayment.com',
      businessPhone: '+923007654321',
      status: SELLER_STATUS.APPROVED,
      commissionRate: 0.10,
    });

    const store = await Store.create({
      seller: seller._id,
      name: 'TestPayment Atelier Store',
      slug: 'testpayment-atelier-store',
      status: 'active',
    });

    const category = await Category.create({
      name: 'Test Pay Couture',
      slug: 'test-pay-couture',
      status: 'active',
    });

    const product = await Product.create({
      seller: seller._id,
      store: store._id,
      category: category._id,
      name: 'TestPayment Silk Sherwani',
      slug: 'testpayment-silk-sherwani',
      description: 'Exquisite silk sherwani handcrafted for regal elegance.',
      basePrice: 50000,
      stockQuantity: 10,
      status: PRODUCT_STATUS.ACTIVE,
    });

    // Create Test Order for Customer 1
    const order1 = await Order.create({
      orderNumber: 'ZAR-PAY-001',
      user: customer1._id,
      items: [
        {
          product: product._id,
          seller: seller._id,
          store: store._id,
          productName: product.name,
          quantity: 2,
          unitPrice: 50000,
          discount: 0,
          finalItemTotal: 100000,
          status: 'pending',
        },
      ],
      shippingAddress: {
        fullName: 'Ayla Khan',
        phone: '+923001234567',
        addressLine1: '42 Luxury Avenue',
        city: 'Lahore',
        state: 'Punjab',
        postalCode: '54000',
      },
      subtotal: 100000,
      discount: 0,
      tax: 0,
      shippingCost: 0,
      total: 100000,
      payment: {
        method: 'stripe',
        status: 'pending',
      },
      orderStatus: ORDER_STATUS.PENDING_PAYMENT,
    });

    // Obtain JWT tokens for each persona
    const adminToken = generateToken(adminUser);
    const cust1Token = generateToken(customer1);
    const cust2Token = generateToken(customer2);
    const sellerToken = generateToken(sellerUser);

    const adminCookie = `token=${adminToken}`;
    const cust1Cookie = `token=${cust1Token}`;
    const cust2Cookie = `token=${cust2Token}`;
    const sellerCookie = `token=${sellerToken}`;

    // -------------------------------------------------------------
    console.log('\n--- 1. Testing PaymentIntent Creation & Server-Side Total ---');
    // -------------------------------------------------------------
    const createIntentRes = await request(app)
      .post('/api/v1/payments/create-intent')
      .set('Cookie', [cust1Cookie])
      .send({ orderId: order1._id.toString() });

    if (createIntentRes.status === 200 && createIntentRes.body?.data?.clientSecret) {
      pass(`Create PaymentIntent returns 200 with clientSecret (Got ${createIntentRes.status})`);
      if (createIntentRes.body.data.amount === 100000) {
        pass(`Authoritative server-side order total applied: 100,000 PKR`);
      } else {
        fail(`Expected amount 100,000, got ${createIntentRes.body.data.amount}`);
      }
    } else {
      fail(`Failed creating payment intent`, createIntentRes.body);
    }

    // Payment Idempotency: repeating creation request returns existing/stable intent
    const duplicateIntentRes = await request(app)
      .post('/api/v1/payments/create-intent')
      .set('Cookie', [cust1Cookie])
      .send({ orderId: order1._id.toString() });

    if (
      duplicateIntentRes.status === 200 &&
      duplicateIntentRes.body?.data?.paymentIntentId === createIntentRes.body?.data?.paymentIntentId
    ) {
      pass(`Payment intent creation is idempotent: returned existing PaymentIntent ID`);
    } else {
      fail(`Payment intent idempotency check failed`, duplicateIntentRes.body);
    }

    // IDOR Protection: Customer 2 cannot create payment intent for Customer 1's order
    const idorIntentRes = await request(app)
      .post('/api/v1/payments/create-intent')
      .set('Cookie', [cust2Cookie])
      .send({ orderId: order1._id.toString() });

    if (idorIntentRes.status === 403) {
      pass(`IDOR Protection: Customer 2 blocked from initiating payment on Customer 1's order (Got 403)`);
    } else {
      fail(`Expected 403 Forbidden for IDOR payment intent, got ${idorIntentRes.status}`);
    }

    // -------------------------------------------------------------
    console.log('\n--- 2. Testing Stripe Webhooks & Idempotency ---');
    // -------------------------------------------------------------
    const paymentIntentId = createIntentRes.body.data.paymentIntentId;

    // Simulate Stripe payment_intent.succeeded webhook payload
    const mockWebhookPayload = {
      id: `evt_test_${Date.now()}`,
      type: 'payment_intent.succeeded',
      data: {
        object: {
          id: paymentIntentId,
          amount: 100000 * 100,
          currency: 'pkr',
          status: 'succeeded',
          metadata: {
            orderId: order1._id.toString(),
            orderNumber: order1.orderNumber,
          },
        },
      },
    };

    const webhookRes1 = await request(app)
      .post('/api/v1/payments/webhook')
      .send(mockWebhookPayload);

    if (webhookRes1.status === 200 && webhookRes1.body?.status === 'processed') {
      pass(`Stripe Webhook payment_intent.succeeded processed (Got 200)`);
    } else {
      fail(`Webhook processing failed`, webhookRes1.body);
    }

    // Verify DB states after webhook success
    const updatedPayment = await Payment.findOne({ stripePaymentIntentId: paymentIntentId });
    const updatedOrder = await Order.findById(order1._id);
    const createdTx = await Transaction.findOne({ order: order1._id, type: TRANSACTION_TYPE.PAYMENT });

    if (updatedPayment && updatedPayment.status === PAYMENT_STATUS.SUCCEEDED) {
      pass(`Payment status transitioned to 'succeeded'`);
    } else {
      fail(`Payment status not succeeded`, updatedPayment);
    }

    if (updatedOrder && updatedOrder.payment.status === 'paid' && updatedOrder.orderStatus === ORDER_STATUS.PROCESSING) {
      pass(`Order payment status updated to 'paid' and orderStatus to 'processing'`);
    } else {
      fail(`Order status not updated properly`, updatedOrder);
    }

    if (createdTx && createdTx.amount === 100000) {
      pass(`Authoritative payment transaction recorded in financial ledger (Amount: 100,000 PKR)`);
    } else {
      fail(`Transaction record missing or incorrect amount`, createdTx);
    }

    // Webhook Idempotency Check: send exact same webhook event again
    const webhookRes2 = await request(app)
      .post('/api/v1/payments/webhook')
      .send(mockWebhookPayload);

    if (webhookRes2.status === 200 && webhookRes2.body?.duplicate === true) {
      pass(`Webhook Idempotency: Duplicate event detected and acknowledged without reprocessing`);
    } else {
      fail(`Expected duplicate webhook acknowledgement, got`, webhookRes2.body);
    }

    // Verify no duplicate transactions were created
    const txCount = await Transaction.countDocuments({ order: order1._id, type: TRANSACTION_TYPE.PAYMENT });
    if (txCount === 1) {
      pass(`Zero duplicate transactions created upon webhook retry (Count: 1)`);
    } else {
      fail(`Duplicate transactions found! Count: ${txCount}`);
    }

    // -------------------------------------------------------------
    console.log('\n--- 3. Testing Marketplace Commissions Calculation ---');
    // -------------------------------------------------------------
    const commissions = await Commission.find({ order: order1._id });
    if (commissions.length === 1) {
      pass(`Marketplace commission created for order item (Count: 1)`);
      const comm = commissions[0];
      if (comm.amount === 10000 && comm.sellerNetEarnings === 90000) {
        pass(`Commission calculated authoritatively: 10% platform fee (10,000 PKR), Net to Seller: 90,000 PKR`);
      } else {
        fail(`Commission calculation mismatch. Amount: ${comm.amount}, Net: ${comm.sellerNetEarnings}`);
      }
    } else {
      fail(`Expected 1 commission entry, got ${commissions.length}`);
    }

    // -------------------------------------------------------------
    console.log('\n--- 4. Testing Seller & Admin Financial APIs ---');
    // -------------------------------------------------------------
    // Seller gets earnings
    const sellerEarningsRes = await request(app)
      .get('/api/v1/seller/earnings')
      .set('Cookie', [sellerCookie]);

    if (sellerEarningsRes.status === 200) {
      pass(`Seller retrieves earnings summary (Got 200)`);
      const data = sellerEarningsRes.body?.data;
      if (data.grossSales === 100000 && data.platformCommission === 10000 && data.netEarnings === 90000) {
        pass(`Seller earnings metrics match ledger: Gross 100,000 | Comm 10,000 | Net 90,000 PKR`);
      } else {
        fail(`Seller earnings metrics mismatch`, data);
      }
    } else {
      fail(`Seller earnings request failed`, sellerEarningsRes.body);
    }

    // Seller gets transactions
    const sellerTxRes = await request(app)
      .get('/api/v1/seller/transactions')
      .set('Cookie', [sellerCookie]);

    if (sellerTxRes.status === 200 && sellerTxRes.body?.data?.transactions?.length > 0) {
      pass(`Seller retrieves transaction ledger with ${sellerTxRes.body.data.transactions.length} record(s)`);
    } else {
      fail(`Failed retrieving seller transactions`, sellerTxRes.body);
    }

    // Admin gets all financial lists
    const adminPaymentsRes = await request(app)
      .get('/api/v1/admin/payments')
      .set('Cookie', [adminCookie]);

    if (adminPaymentsRes.status === 200 && adminPaymentsRes.body?.data?.payments?.length >= 1) {
      pass(`Admin retrieves global payments list (Got 200)`);
    } else {
      fail(`Admin payments query failed`, adminPaymentsRes.body);
    }

    const adminCommissionsRes = await request(app)
      .get('/api/v1/admin/commissions')
      .set('Cookie', [adminCookie]);

    if (adminCommissionsRes.status === 200 && adminCommissionsRes.body?.data?.commissions?.length >= 1) {
      pass(`Admin retrieves marketplace commissions overview (Got 200)`);
    } else {
      fail(`Admin commissions query failed`, adminCommissionsRes.body);
    }

    // -------------------------------------------------------------
    console.log('\n--- 5. Testing Refunds & Commission Reversals ---');
    // -------------------------------------------------------------
    // Partial Refund: Refund 40,000 PKR out of 100,000 PKR
    const partialRefundRes = await request(app)
      .post(`/api/v1/orders/${order1._id}/refund`)
      .set('Cookie', [cust1Cookie])
      .send({ amount: 40000, reason: 'Size adjustment discount' });

    if (partialRefundRes.status === 200 && partialRefundRes.body?.data?.refund) {
      pass(`Partial refund of 40,000 PKR processed successfully (Got 200)`);
    } else {
      fail(`Partial refund failed`, partialRefundRes.body);
    }

    // Verify payment record after partial refund
    const paymentAfterPartial = await Payment.findById(updatedPayment._id);
    if (
      paymentAfterPartial.status === PAYMENT_STATUS.PARTIALLY_REFUNDED &&
      paymentAfterPartial.amountRefunded === 40000
    ) {
      pass(`Payment status is 'partially_refunded' with amountRefunded: 40,000 PKR`);
    } else {
      fail(`Payment state incorrect after partial refund`, paymentAfterPartial);
    }

    // Excessive Refund: Attempting to refund 70,000 PKR when only 60,000 PKR remains
    const excessiveRefundRes = await request(app)
      .post(`/api/v1/orders/${order1._id}/refund`)
      .set('Cookie', [cust1Cookie])
      .send({ amount: 70000, reason: 'Excessive amount' });

    if (excessiveRefundRes.status === 400) {
      pass(`Excessive refund rejected with 400 Bad Request (Requested 70k > 60k remaining)`);
    } else {
      fail(`Expected 400 for excessive refund, got ${excessiveRefundRes.status}`);
    }

    // Complete Remaining Refund: Refund remaining 60,000 PKR
    const fullRefundRes = await request(app)
      .post(`/api/v1/admin/orders/${order1._id}/refund`)
      .set('Cookie', [adminCookie])
      .send({ amount: 60000, reason: 'Full final settlement' });

    if (fullRefundRes.status === 200) {
      pass(`Remaining 60,000 PKR refund processed by Admin (Got 200)`);
    } else {
      fail(`Final refund failed`, fullRefundRes.body);
    }

    const paymentAfterFull = await Payment.findById(updatedPayment._id);
    const orderAfterFull = await Order.findById(order1._id);

    if (paymentAfterFull.status === PAYMENT_STATUS.REFUNDED && paymentAfterFull.amountRefunded === 100000) {
      pass(`Payment fully refunded: status 'refunded', amountRefunded 100,000 PKR`);
    } else {
      fail(`Payment status incorrect after full refund`, paymentAfterFull);
    }

    if (orderAfterFull.payment.status === 'refunded' && orderAfterFull.orderStatus === ORDER_STATUS.REFUNDED) {
      pass(`Order payment.status is 'refunded' and orderStatus is 'refunded'`);
    } else {
      fail(`Order status incorrect after full refund`, orderAfterFull);
    }

    // Duplicate Refund Prevention: Requesting refund on already fully refunded order
    const duplicateRefundRes = await request(app)
      .post(`/api/v1/orders/${order1._id}/refund`)
      .set('Cookie', [cust1Cookie]);

    if (duplicateRefundRes.status === 400) {
      pass(`Duplicate refund prevented on fully refunded order (Got 400)`);
    } else {
      fail(`Expected 400 for duplicate refund, got ${duplicateRefundRes.status}`);
    }

    // -------------------------------------------------------------
    console.log('\n--- 6. Testing Notifications Engine ---');
    // -------------------------------------------------------------
    // Customer 1 retrieves notifications
    const notifListRes = await request(app)
      .get('/api/v1/notifications')
      .set('Cookie', [cust1Cookie]);

    if (notifListRes.status === 200 && notifListRes.body?.data?.notifications?.length >= 1) {
      pass(`Customer retrieves notifications list (Count: ${notifListRes.body.data.notifications.length})`);
    } else {
      fail(`Failed retrieving customer notifications`, notifListRes.body);
    }

    // Unread count
    const unreadCountRes = await request(app)
      .get('/api/v1/notifications/unread-count')
      .set('Cookie', [cust1Cookie]);

    if (unreadCountRes.status === 200 && unreadCountRes.body?.data?.unreadCount > 0) {
      pass(`Unread count endpoint returns active unread notifications (${unreadCountRes.body.data.unreadCount})`);
    } else {
      fail(`Failed getting unread count`, unreadCountRes.body);
    }

    // Mark single notification read
    const firstNotif = notifListRes.body.data.notifications[0];
    const markReadRes = await request(app)
      .patch(`/api/v1/notifications/${firstNotif._id}/read`)
      .set('Cookie', [cust1Cookie]);

    if (markReadRes.status === 200 && markReadRes.body?.data?.notification?.status === 'read') {
      pass(`Mark single notification read returns 200 and status 'read'`);
    } else {
      fail(`Failed marking notification read`, markReadRes.body);
    }

    // IDOR Protection on Notifications: Customer 2 cannot mark Customer 1's notification read
    const notifIdorRes = await request(app)
      .patch(`/api/v1/notifications/${firstNotif._id}/read`)
      .set('Cookie', [cust2Cookie]);

    if (notifIdorRes.status === 403) {
      pass(`IDOR Protection: Customer 2 blocked from marking Customer 1 notification as read (Got 403)`);
    } else {
      fail(`Expected 403 for notification IDOR, got ${notifIdorRes.status}`);
    }

    // Mark all as read
    const markAllRes = await request(app)
      .patch('/api/v1/notifications/read-all')
      .set('Cookie', [cust1Cookie]);

    if (markAllRes.status === 200) {
      pass(`Mark all notifications as read returns 200`);
    } else {
      fail(`Failed marking all notifications read`, markAllRes.body);
    }

    // -------------------------------------------------------------
    console.log('\n--- 7. Testing Socket.IO Real-time Engine & Room Emitters ---');
    // -------------------------------------------------------------
    try {
      emitToUser(customer1._id, 'test:ping', { msg: 'hello' });
      emitToSeller(seller._id, 'seller:ping', { msg: 'seller event' });
      emitToAdmins('admin:ping', { msg: 'admin event' });
      pass(`Socket.IO room emitters (user, seller, admin) executed without exceptions`);
    } catch (sockErr) {
      fail(`Socket.IO emitter failed: ${sockErr.message}`);
    }

    // -------------------------------------------------------------
    console.log('\n--- 8. Testing Audit Logging & Secret Sanitization ---');
    // -------------------------------------------------------------
    const auditLogs = await AuditLog.find({ action: { $in: ['payment.succeeded', 'refund.processed'] } });
    if (auditLogs.length >= 2) {
      pass(`Audit logs recorded for sensitive financial events (Count: ${auditLogs.length})`);
      
      // Ensure no passwords, card details, or secrets in audit logs
      const rawJson = JSON.stringify(auditLogs);
      const containsSecrets = /password|secretKey|webhookSecret|cardNumber|cvv/i.test(rawJson);
      if (!containsSecrets) {
        pass(`Audit logs strictly sanitized: zero passwords, tokens, raw cards, or webhook secrets`);
      } else {
        fail(`Audit log contains sensitive credentials!`, rawJson);
      }
    } else {
      fail(`Expected at least 2 audit logs, found ${auditLogs.length}`);
    }

    console.log('\n================================================================');
    console.log(`  PHASE 5 TEST RESULTS: ${passedCount} PASSED | ${failedCount} FAILED`);
    console.log('================================================================\n');

    await disconnectDB();

    if (failedCount > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (error) {
    console.error('Fatal error during Phase 5 testing:', error);
    await disconnectDB();
    process.exit(1);
  }
};

runTests();
