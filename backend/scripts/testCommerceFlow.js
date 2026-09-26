import request from 'supertest';
import app from '../app.js';
import { connectDB, disconnectDB } from '../database/connectDB.js';
import { User } from '../models/User.js';
import { Seller, SELLER_APPROVAL_STATUS } from '../models/Seller.js';
import { Store } from '../models/Store.js';
import { Category } from '../models/Category.js';
import { Brand } from '../models/Brand.js';
import { Product, PRODUCT_APPROVAL_STATUS, PRODUCT_STATUS } from '../models/Product.js';
import { ProductVariant } from '../models/ProductVariant.js';
import { Address } from '../models/Address.js';
import { Cart } from '../models/Cart.js';
import { Wishlist } from '../models/Wishlist.js';
import { Coupon, COUPON_TYPE, COUPON_SCOPE } from '../models/Coupon.js';
import { Order, ORDER_STATUS, ITEM_STATUS } from '../models/Order.js';
import { Review, REVIEW_STATUS } from '../models/Review.js';
import { ROLES, getDefaultPermissions } from '../config/permissions.js';

/**
 * ZAREEN Phase 4: Cart, Wishlist, Checkout, Orders, Reviews & Promotions Test Suite
 */
const runTests = async () => {
  console.log('\n================================================================');
  console.log('  STARTING ZAREEN PHASE 4 COMMERCE, ORDERS & PROMOTIONS SUITE   ');
  console.log('================================================================\n');

  await connectDB();

  let passed = 0;
  let failed = 0;

  const assert = (condition, description) => {
    if (condition) {
      console.log(`  ✓ PASS: ${description}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${description}`);
      failed++;
    }
  };

  try {
    // 0. Clean test records
    await User.deleteMany({ email: /@commerce-test\.com$/i });
    await Category.deleteMany({ slug: /^comm-test-/ });
    await Brand.deleteMany({ slug: /^comm-test-/ });
    await Product.deleteMany({ slug: /^comm-test-/ });
    await ProductVariant.deleteMany({ sku: /^COMM-/ });
    await Store.deleteMany({ $or: [{ slug: /^comm-test-/ }, { slug: 'gul-ahmed-atelier' }, { name: /Gul Ahmed/i }] });
    await Seller.deleteMany({ businessEmail: /@commerce-test\.com$/i });
    await Coupon.deleteMany({ code: /^COMM-/ });
    await Order.deleteMany({ orderNumber: /^ZAR-/ });
    await Review.deleteMany({});
    await Address.deleteMany({});
    await Cart.deleteMany({});
    await Wishlist.deleteMany({});

    // 1. Setup Admin
    let admin = await User.findOne({ email: 'admin@zareen.com' });
    if (!admin) {
      admin = new User({
        name: 'Zareen Admin',
        email: 'admin@zareen.com',
        password: 'Admin@Zareen2025!',
        role: ROLES.ADMIN,
        permissions: getDefaultPermissions(ROLES.ADMIN),
        emailVerifiedAt: new Date(),
      });
      await admin.save();
    }
    const adminLoginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@zareen.com', password: 'Admin@Zareen2025!' });
    const adminCookie = adminLoginRes.headers['set-cookie'][0].split(';')[0];

    // 2. Setup Seller 1 User & Store
    const seller1User = new User({
      name: 'Gul Ahmed Luxury Atelier',
      email: 'seller1@commerce-test.com',
      password: 'Password123!',
      role: ROLES.SELLER,
      permissions: getDefaultPermissions(ROLES.SELLER),
      emailVerifiedAt: new Date(),
    });
    await seller1User.save();

    const seller1 = new Seller({
      user: seller1User._id,
      businessName: 'Comm Test Gul Ahmed Atelier',
      businessEmail: 'seller1@commerce-test.com',
      businessPhone: '+92 300 9991111',
      approvalStatus: SELLER_APPROVAL_STATUS.APPROVED,
    });
    await seller1.save();

    const seller1Store = new Store({
      seller: seller1._id,
      name: 'Comm Test Gul Ahmed Atelier',
      slug: 'comm-test-gul-ahmed-atelier',
      status: 'active',
    });
    await seller1Store.save();

    seller1.store = seller1Store._id;
    await seller1.save();

    const seller1LoginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'seller1@commerce-test.com', password: 'Password123!' });
    const seller1Cookie = seller1LoginRes.headers['set-cookie'][0].split(';')[0];

    // 3. Setup Customer 1 (Shopper)
    const cust1User = new User({
      name: 'Hina Mansoor',
      email: 'hina@commerce-test.com',
      password: 'Password123!',
      role: ROLES.CUSTOMER,
      permissions: getDefaultPermissions(ROLES.CUSTOMER),
      emailVerifiedAt: new Date(),
    });
    await cust1User.save();
    const cust1LoginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'hina@commerce-test.com', password: 'Password123!' });
    const cust1Cookie = cust1LoginRes.headers['set-cookie'][0].split(';')[0];

    // 4. Setup Customer 2 (Shopper 2 for IDOR tests)
    const cust2User = new User({
      name: 'Mehwish Ali',
      email: 'mehwish@commerce-test.com',
      password: 'Password123!',
      role: ROLES.CUSTOMER,
      permissions: getDefaultPermissions(ROLES.CUSTOMER),
      emailVerifiedAt: new Date(),
    });
    await cust2User.save();
    const cust2LoginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'mehwish@commerce-test.com', password: 'Password123!' });
    const cust2Cookie = cust2LoginRes.headers['set-cookie'][0].split(';')[0];

    // 5. Seed Category, Brand, Product 1 (Simple) and Product 2 (Variant-based)
    const testCat = new Category({
      name: 'Comm Test Luxury Pret',
      slug: 'comm-test-luxury-pret',
      status: 'active',
    });
    await testCat.save();

    const testBrand = new Brand({
      name: 'Comm Test Zareen Couture',
      slug: 'comm-test-zareen-couture',
      status: 'active',
    });
    await testBrand.save();

    const product1 = new Product({
      seller: seller1._id,
      store: seller1Store._id,
      category: testCat._id,
      brand: testBrand._id,
      name: 'Comm Test Embroidered Raw Silk Kaftan',
      slug: 'comm-test-embroidered-raw-silk-kaftan',
      description: 'Handcrafted pure raw silk kaftan with resham embroidery.',
      basePrice: 45000,
      compareAtPrice: 50000,
      discount: 10, // 10% discount -> 40,500
      stock: 10,
      sku: 'COMM-KAF-001',
      approvalStatus: PRODUCT_APPROVAL_STATUS.APPROVED,
      status: PRODUCT_STATUS.PUBLISHED,
    });
    await product1.save();

    const product2 = new Product({
      seller: seller1._id,
      store: seller1Store._id,
      category: testCat._id,
      brand: testBrand._id,
      name: 'Comm Test Chiffon Anarkali Suit',
      slug: 'comm-test-chiffon-anarkali-suit',
      description: 'Zari bordered chiffon anarkali with silk trouser.',
      hasVariants: true,
      basePrice: 60000,
      stock: 8,
      approvalStatus: PRODUCT_APPROVAL_STATUS.APPROVED,
      status: PRODUCT_STATUS.PUBLISHED,
    });
    await product2.save();

    const variantM = new ProductVariant({
      product: product2._id,
      sku: 'COMM-ANAR-M',
      attributes: { size: 'M', color: 'Ivory' },
      price: 60000,
      stock: 5,
      status: 'active',
    });
    await variantM.save();

    const variantL = new ProductVariant({
      product: product2._id,
      sku: 'COMM-ANAR-L',
      attributes: { size: 'L', color: 'Ivory' },
      price: 62000,
      stock: 3,
      status: 'active',
    });
    await variantL.save();

    // ==========================================
    // 1. ADDRESS BOOK TESTS
    // ==========================================
    console.log('\n--- 1. Testing Address Book ---');

    // 1.1 Create Address
    const addAddrRes = await request(app)
      .post('/api/v1/users/me/addresses')
      .set('Cookie', cust1Cookie)
      .send({
        fullName: 'Hina Mansoor',
        phone: '+92 321 4445555',
        addressLine1: 'House 42, Street 8, DHA Phase 5',
        city: 'Lahore',
        state: 'Punjab',
        postalCode: '54000',
        country: 'Pakistan',
        isDefault: true,
      });
    assert(addAddrRes.status === 201, `Create address returns 201 (Got ${addAddrRes.status})`);
    const addr1Id = addAddrRes.body.data.address._id;
    assert(addAddrRes.body.data.address.isDefault === true, 'First address defaults to isDefault: true');

    // 1.2 Create Second Address
    const addAddr2Res = await request(app)
      .post('/api/v1/users/me/addresses')
      .set('Cookie', cust1Cookie)
      .send({
        fullName: 'Hina Mansoor Office',
        phone: '+92 321 4445555',
        addressLine1: 'Gulberg Corporate Center, 4th Floor',
        city: 'Lahore',
        state: 'Punjab',
        postalCode: '54660',
      });
    const addr2Id = addAddr2Res.body.data.address._id;
    assert(addAddr2Res.body.data.address.isDefault === false, 'Second address isDefault is false');

    // 1.3 Make Address 2 Default
    const makeDefaultRes = await request(app)
      .patch(`/api/v1/users/me/addresses/${addr2Id}/default`)
      .set('Cookie', cust1Cookie);
    assert(makeDefaultRes.status === 200, 'Make address default returns 200');
    assert(makeDefaultRes.body.data.address.isDefault === true, 'Address 2 is now default');

    // 1.4 IDOR Address Protection: Customer 2 cannot access or delete Customer 1's address
    const idorAddrRes = await request(app)
      .delete(`/api/v1/users/me/addresses/${addr1Id}`)
      .set('Cookie', cust2Cookie);
    assert(idorAddrRes.status === 403, `IDOR protection: Customer 2 blocked from deleting Customer 1 address (Got ${idorAddrRes.status})`);

    // ==========================================
    // 2. SHOPPING BAG / CART TESTS
    // ==========================================
    console.log('\n--- 2. Testing Shopping Bag / Cart ---');

    // 2.1 Add Simple Product to Cart
    const addCart1Res = await request(app)
      .post('/api/v1/cart/items')
      .set('Cookie', cust1Cookie)
      .send({
        productId: product1._id,
        quantity: 2,
      });
    assert(addCart1Res.status === 200, `Add to cart returns 200 (Got ${addCart1Res.status})`);
    assert(addCart1Res.body.data.cart.items.length === 1, 'Cart has 1 item');
    assert(addCart1Res.body.data.cart.itemCount === 2, 'Total quantity in bag is 2');
    const cartItem1Id = addCart1Res.body.data.cart.items[0]._id;

    // 2.2 Add Variant Product to Cart
    const addCart2Res = await request(app)
      .post('/api/v1/cart/items')
      .set('Cookie', cust1Cookie)
      .send({
        productId: product2._id,
        variantId: variantM._id,
        quantity: 1,
      });
    assert(addCart2Res.status === 200, 'Add variant product to cart returns 200');
    assert(addCart2Res.body.data.cart.items.length === 2, 'Cart now has 2 distinct items');

    // 2.3 Exceed Stock validation (Product 1 has 10 stock, current in cart 2, trying to add 15 more)
    const exceedStockRes = await request(app)
      .post('/api/v1/cart/items')
      .set('Cookie', cust1Cookie)
      .send({
        productId: product1._id,
        quantity: 15,
      });
    assert(exceedStockRes.status === 400 || exceedStockRes.status === 422, 'Exceeding available stock rejected with 400/422');

    // 2.4 Update Item Quantity
    const updateQtyRes = await request(app)
      .patch(`/api/v1/cart/items/${cartItem1Id}`)
      .set('Cookie', cust1Cookie)
      .send({ quantity: 1 });
    assert(updateQtyRes.status === 200, 'Update cart quantity returns 200');
    assert(updateQtyRes.body.data.cart.itemCount === 2, 'Cart total count updated to 2 (1 simple + 1 variant)');

    // ==========================================
    // 3. WISHLIST & RECENTLY VIEWED TESTS
    // ==========================================
    console.log('\n--- 3. Testing Wishlist & Recently Viewed ---');

    // 3.1 Add to Wishlist
    const addWishRes = await request(app)
      .post(`/api/v1/wishlist/${product1._id}`)
      .set('Cookie', cust1Cookie);
    assert(addWishRes.status === 201 || addWishRes.status === 200, 'Add to wishlist returns 201/200');

    // 3.2 Duplicate Wishlist Prevention (Idempotent)
    const dupWishRes = await request(app)
      .post(`/api/v1/wishlist/${product1._id}`)
      .set('Cookie', cust1Cookie);
    assert(dupWishRes.status === 200 || dupWishRes.status === 201, 'Duplicate wishlist is safely idempotent');

    // 3.3 Record Recently Viewed
    const recordViewRes = await request(app)
      .post(`/api/v1/users/me/recently-viewed/${product1._id}`)
      .set('Cookie', cust1Cookie);
    assert(recordViewRes.status === 200, 'Record product view returns 200');

    const getViewRes = await request(app)
      .get('/api/v1/users/me/recently-viewed')
      .set('Cookie', cust1Cookie);
    assert(getViewRes.status === 200, 'Get recently viewed returns 200');
    assert(getViewRes.body.data.products.length >= 1, 'Viewing history contains product');

    // ==========================================
    // 4. COUPON & PROMOTIONS TESTS
    // ==========================================
    console.log('\n--- 4. Testing Coupon Engine ---');

    // 4.1 Admin Creates Platform Coupon (10% off, min order 50,000)
    const createPlatCoupon = await request(app)
      .post('/api/v1/admin/coupons')
      .set('Cookie', adminCookie)
      .send({
        code: 'COMM-ROYAL10',
        description: '10% Platform Welcome Discount',
        type: COUPON_TYPE.PERCENTAGE,
        value: 10,
        scope: COUPON_SCOPE.PLATFORM,
        minimumOrderAmount: 50000,
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });
    assert(createPlatCoupon.status === 201, `Admin create platform coupon returns 201 (Got ${createPlatCoupon.status})`);

    // 4.2 Seller 1 Creates Atelier Coupon (Fixed 5,000 off, min 30,000)
    const createSellerCoupon = await request(app)
      .post('/api/v1/seller/coupons')
      .set('Cookie', seller1Cookie)
      .send({
        code: 'COMM-ATELIER5K',
        description: 'PKR 5,000 Atelier voucher',
        type: COUPON_TYPE.FIXED,
        value: 5000,
        minimumOrderAmount: 30000,
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });
    assert(createSellerCoupon.status === 201, `Seller create coupon returns 201 (Got ${createSellerCoupon.status})`);

    // 4.3 Expired Coupon Test
    const expiredCoupon = new Coupon({
      code: 'COMM-EXPIRED',
      type: COUPON_TYPE.FIXED,
      value: 1000,
      scope: COUPON_SCOPE.PLATFORM,
      expiryDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
    });
    await expiredCoupon.save();

    // ==========================================
    // 5. CHECKOUT VALIDATION ENGINE
    // ==========================================
    console.log('\n--- 5. Testing Authoritative Checkout Validation ---');

    // 5.1 Validate Checkout with Valid Coupon
    // In Cart: Product 1 (45k - 10% disc = 40.5k) + Product 2 Variant M (60k) = 100.5k effective subtotal
    // Coupon COMM-ROYAL10 gives 10% of 100.5k = 10,050 off
    // Shipping: subtotal > 25,000 -> Free Standard Shipping (0)
    // Grand Total = 100,500 - 10,050 = 90,450
    const checkoutValRes = await request(app)
      .post('/api/v1/checkout/validate')
      .set('Cookie', cust1Cookie)
      .send({
        addressId: addr2Id,
        shippingMethod: 'standard',
        couponCode: 'COMM-ROYAL10',
      });
    assert(checkoutValRes.status === 200, `Checkout calculation returns 200 (Got ${checkoutValRes.status})`);
    assert(checkoutValRes.body.data.financials.subtotal === 105000, 'Subtotal is 105,000');
    assert(checkoutValRes.body.data.financials.productDiscount === 4500, 'Product discount is 4,500');
    assert(checkoutValRes.body.data.financials.couponDiscount === 10050, 'Coupon discount is 10,050');
    assert(checkoutValRes.body.data.financials.grandTotal === 90450, 'Grand total matches backend calculation: 90,450');

    // 5.2 Expired Coupon in Checkout is rejected
    const badCouponCheckout = await request(app)
      .post('/api/v1/checkout/validate')
      .set('Cookie', cust1Cookie)
      .send({
        addressId: addr2Id,
        couponCode: 'COMM-EXPIRED',
      });
    assert(badCouponCheckout.status === 400, `Expired coupon rejected with 400 (Got ${badCouponCheckout.status})`);

    // ==========================================
    // 6. ORDER CREATION & INVENTORY DEDUCTION
    // ==========================================
    console.log('\n--- 6. Testing Order Creation & Atomic Stock Deduction ---');

    const p1InitialStock = product1.stock; // 10
    const vMInitialStock = variantM.stock; // 5

    // 6.1 Place Order
    const placeOrderRes = await request(app)
      .post('/api/v1/orders')
      .set('Cookie', cust1Cookie)
      .send({
        addressId: addr2Id,
        shippingMethod: 'standard',
        couponCode: 'COMM-ROYAL10',
        paymentMethod: 'cod',
      });
    assert(placeOrderRes.status === 201, `Place order returns 201 Created (Got ${placeOrderRes.status})`);
    const createdOrder = placeOrderRes.body.data.order;
    const orderId = createdOrder._id;
    const orderNumber = createdOrder.orderNumber;
    assert(orderNumber.startsWith('ZAR-'), `Order number format matches luxury standard: ${orderNumber}`);
    assert(createdOrder.total === 90450, 'Order total matches authoritative calculation');

    // 6.2 Check Inventory Deduction
    const p1AfterOrder = await Product.findById(product1._id);
    const vMAfterOrder = await ProductVariant.findById(variantM._id);
    assert(p1AfterOrder.stock === p1InitialStock - 1, `Product 1 stock deducted by 1 (was ${p1InitialStock}, now ${p1AfterOrder.stock})`);
    assert(vMAfterOrder.stock === vMInitialStock - 1, `Variant M stock deducted by 1 (was ${vMInitialStock}, now ${vMAfterOrder.stock})`);

    // 6.3 Cart must be cleared after order
    const cartAfterOrder = await request(app).get('/api/v1/cart').set('Cookie', cust1Cookie);
    assert(cartAfterOrder.body.data.cart.items.length === 0, 'Shopping bag emptied after successful order');

    // 6.4 Customer views order details
    const getOrderRes = await request(app).get(`/api/v1/orders/${orderId}`).set('Cookie', cust1Cookie);
    assert(getOrderRes.status === 200, 'Customer gets order details');
    assert(getOrderRes.body.data.order.orderNumber === orderNumber, 'Order number matches');

    // 6.5 IDOR Order Protection: Customer 2 cannot access Customer 1's order
    const idorOrderRes = await request(app).get(`/api/v1/orders/${orderId}`).set('Cookie', cust2Cookie);
    assert(idorOrderRes.status === 403, `IDOR protection: Customer 2 blocked from viewing Customer 1 order (Got ${idorOrderRes.status})`);

    // ==========================================
    // 7. SELLER SUBORDERS & FULFILLMENT
    // ==========================================
    console.log('\n--- 7. Testing Seller Suborders & Item Fulfillment ---');

    // 7.1 Seller views incoming orders
    const sellerOrdersRes = await request(app).get('/api/v1/seller/orders').set('Cookie', seller1Cookie);
    assert(sellerOrdersRes.status === 200, `Seller gets orders list (Got ${sellerOrdersRes.status})`);
    assert(sellerOrdersRes.body.data.items.length >= 1, 'Seller orders list has placed order');

    const sellerOrderItemId = createdOrder.items[0]._id;

    // 7.2 Seller updates order item status to 'shipped'
    const updateItemRes = await request(app)
      .patch(`/api/v1/seller/orders/${orderId}/status`)
      .set('Cookie', seller1Cookie)
      .send({ itemId: sellerOrderItemId, status: ITEM_STATUS.SHIPPED });
    assert(updateItemRes.status === 200, 'Seller updates item status to shipped');

    // 7.3 Admin updates overall order status to 'delivered'
    const adminDeliveredRes = await request(app)
      .patch(`/api/v1/admin/orders/${orderId}/status`)
      .set('Cookie', adminCookie)
      .send({ status: ORDER_STATUS.DELIVERED });
    assert(adminDeliveredRes.status === 200, 'Admin marks order delivered');

    // ==========================================
    // 8. VERIFIED PURCHASE REVIEWS
    // ==========================================
    console.log('\n--- 8. Testing Verified Purchase Reviews & Rating Aggregation ---');

    // 8.1 Customer 1 (Verified Purchaser) Submits Review for Product 1
    const reviewRes = await request(app)
      .post(`/api/v1/reviews/product/${product1._id}`)
      .set('Cookie', cust1Cookie)
      .send({
        rating: 5,
        title: 'Bespoke Perfection',
        comment: 'The resham embroidery and pure silk drape exceed all expectations. Magnificent craftsmanship.',
      });
    assert(reviewRes.status === 201, `Verified purchase review created (Got ${reviewRes.status})`);
    assert(reviewRes.body.data.review.isVerifiedPurchase === true, 'Review marked as isVerifiedPurchase: true');

    // 8.2 Customer 2 (Non-Purchaser) Attempt to review Product 1 -> 403 Forbidden
    const fakeReviewRes = await request(app)
      .post(`/api/v1/reviews/product/${product1._id}`)
      .set('Cookie', cust2Cookie)
      .send({
        rating: 5,
        comment: 'Attempting to post unverified fake review.',
      });
    assert(fakeReviewRes.status === 403, `Non-purchaser blocked from submitting review with 403 (Got ${fakeReviewRes.status})`);

    // 8.3 Duplicate review prevention for same order
    const dupReviewRes = await request(app)
      .post(`/api/v1/reviews/product/${product1._id}`)
      .set('Cookie', cust1Cookie)
      .send({
        rating: 4,
        comment: 'Duplicate review attempt.',
      });
    assert(dupReviewRes.status === 409, `Duplicate review on same purchase blocked with 409 (Got ${dupReviewRes.status})`);

    // 8.4 Verify Product Rating Aggregation
    const p1Updated = await Product.findById(product1._id);
    assert(p1Updated.ratingAverage === 5, `Product ratingAverage recalculated to 5 (Got ${p1Updated.ratingAverage})`);
    assert(p1Updated.ratingCount === 1, `Product ratingCount is 1 (Got ${p1Updated.ratingCount})`);

    // 8.5 Public reviews listing
    const publicReviewsRes = await request(app).get(`/api/v1/reviews/product/${product1._id}`);
    assert(publicReviewsRes.status === 200, 'Public product reviews list returns 200');
    assert(publicReviewsRes.body.data.items.length === 1, 'Product has 1 public approved review');

    // ==========================================
    // 9. RETURNS & REORDERS
    // ==========================================
    console.log('\n--- 9. Testing Returns & Reorder Workflows ---');

    // 9.1 Customer 1 Requests Return on Delivered Order
    const returnReqRes = await request(app)
      .post(`/api/v1/orders/${orderId}/return`)
      .set('Cookie', cust1Cookie)
      .send({
        reason: 'Size adjustment needed for the occasion.',
        description: 'Need sleeve length altered or replaced.',
      });
    assert(returnReqRes.status === 200, `Customer return request submitted (Got ${returnReqRes.status})`);
    assert(returnReqRes.body.data.order.orderStatus === ORDER_STATUS.RETURN_REQUESTED, 'Order status updated to return_requested');

    // 9.2 Seller Reviews and Approves Return
    const reviewReturnRes = await request(app)
      .patch(`/api/v1/seller/returns/${orderId}/review`)
      .set('Cookie', seller1Cookie)
      .send({
        approved: true,
        resolution: 'Atelier exchange concierge initiated.',
      });
    assert(reviewReturnRes.status === 200, 'Seller approves return');

    // 9.3 Reorder Items
    const reorderRes = await request(app)
      .post(`/api/v1/orders/${orderId}/reorder`)
      .set('Cookie', cust1Cookie);
    assert(reorderRes.status === 200, `Reorder items returns 200 (Got ${reorderRes.status})`);
    assert(reorderRes.body.data.addedCount >= 1, 'Available items re-added to shopping bag');

    // Clean test records
    await User.deleteMany({ email: /@commerce-test\.com$/i });
    await Category.deleteMany({ slug: /^comm-test-/ });
    await Brand.deleteMany({ slug: /^comm-test-/ });
    await Product.deleteMany({ slug: /^comm-test-/ });
    await ProductVariant.deleteMany({ sku: /^COMM-/ });
    await Store.deleteMany({ slug: /^comm-test-/ });
    await Seller.deleteMany({ businessEmail: /@commerce-test\.com$/i });
    await Coupon.deleteMany({ code: /^COMM-/ });
    await Order.deleteMany({ orderNumber: /^ZAR-/ });
    await Review.deleteMany({});
    await Address.deleteMany({});
    await Cart.deleteMany({});
    await Wishlist.deleteMany({});

    console.log('\n================================================================');
    console.log(`  PHASE 4 TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
    console.log('================================================================\n');

    await disconnectDB();
    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error('Fatal test error:', err);
    await disconnectDB();
    process.exit(1);
  }
};

runTests();
