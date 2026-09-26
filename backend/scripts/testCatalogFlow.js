import request from 'supertest';
import app from '../app.js';
import { connectDB, disconnectDB } from '../database/connectDB.js';
import { User } from '../models/User.js';
import { Seller } from '../models/Seller.js';
import { Store } from '../models/Store.js';
import { Category } from '../models/Category.js';
import { Subcategory } from '../models/Subcategory.js';
import { Brand } from '../models/Brand.js';
import { Product } from '../models/Product.js';
import { ProductVariant } from '../models/ProductVariant.js';
import { ROLES, getDefaultPermissions } from '../config/permissions.js';

/**
 * ZAREEN Phase 3: Marketplace Catalog, Sellers, Products & Inventory Test Suite
 */
const runTests = async () => {
  console.log('\n================================================================');
  console.log('  STARTING ZAREEN PHASE 3 CATALOG, SELLERS & PRODUCTS TEST SUITE ');
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
    await User.deleteMany({ email: /@catalog-test\.com$/i });
    await Category.deleteMany({ slug: /^test-/ });
    await Subcategory.deleteMany({ slug: /^test-/ });
    await Brand.deleteMany({ slug: /^test-/ });
    await Product.deleteMany({ slug: /^test-/ });
    await ProductVariant.deleteMany({ sku: /^TEST-/ });
    await Store.deleteMany({ slug: /^test-/ });
    await Seller.deleteMany({ businessEmail: /@catalog-test\.com$/i });

    // Seed/find admin
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

    // Login Admin
    const adminLoginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@zareen.com', password: 'Admin@Zareen2025!' });
    const adminCookie = adminLoginRes.headers['set-cookie'][0].split(';')[0];

    // Create Customer 1 (will become Seller 1)
    const cust1Email = 'seller1@catalog-test.com';
    const regCust1Res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Fatima Haute Couture',
        email: cust1Email,
        password: 'Password123!',
        confirmPassword: 'Password123!',
        phone: '+92 300 1112233',
      });
    const cust1Cookie = regCust1Res.headers['set-cookie'][0].split(';')[0];
    const cust1Id = regCust1Res.body.data.user._id;

    // Create Customer 2 (will become Seller 2 for IDOR tests)
    const cust2Email = 'seller2@catalog-test.com';
    const regCust2Res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Zainab Luxury Pret',
        email: cust2Email,
        password: 'Password123!',
        confirmPassword: 'Password123!',
        phone: '+92 300 4445566',
      });
    const cust2Cookie = regCust2Res.headers['set-cookie'][0].split(';')[0];
    const cust2Id = regCust2Res.body.data.user._id;

    // Create Plain Customer (No seller role)
    const plainCustEmail = 'customer@catalog-test.com';
    const regPlainRes = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Sara Shopper',
        email: plainCustEmail,
        password: 'Password123!',
        confirmPassword: 'Password123!',
      });
    const plainCustCookie = regPlainRes.headers['set-cookie'][0].split(';')[0];

    // ==========================================
    // 1. CATEGORY & SUBCATEGORY & BRAND TESTS
    // ==========================================
    console.log('\n--- 1. Testing Categories, Subcategories & Brands ---');

    // 1.1 Admin Create Category
    const createCatRes = await request(app)
      .post('/api/v1/admin/categories')
      .set('Cookie', adminCookie)
      .send({
        name: 'Test Bridal Luxury',
        description: 'Exclusive bridal handcrafted collections',
        image: 'https://example.com/bridal.jpg',
        sortOrder: 1,
      });
    assert(createCatRes.status === 201, `Admin create category returns 201 (Got ${createCatRes.status})`);
    const categoryId = createCatRes.body.data.category._id;
    const categorySlug = createCatRes.body.data.category.slug;
    assert(categorySlug === 'test-bridal-luxury', `Slug generated correctly: ${categorySlug}`);

    // 1.2 Customer blocked from creating category
    const custCatRes = await request(app)
      .post('/api/v1/admin/categories')
      .set('Cookie', plainCustCookie)
      .send({ name: 'Hacked Category' });
    assert(custCatRes.status === 403, `Customer blocked from admin categories with 403 (Got ${custCatRes.status})`);

    // 1.3 Admin Create Subcategory
    const createSubcatRes = await request(app)
      .post('/api/v1/admin/subcategories')
      .set('Cookie', adminCookie)
      .send({
        category: categoryId,
        name: 'Test Lehengas',
        description: 'Embroidered bridal lehengas',
        sortOrder: 1,
      });
    assert(createSubcatRes.status === 201, `Admin create subcategory returns 201 (Got ${createSubcatRes.status})`);
    const subcategoryId = createSubcatRes.body.data.subcategory._id;
    const subcategorySlug = createSubcatRes.body.data.subcategory.slug;

    // 1.4 Admin Create Brand
    const createBrandRes = await request(app)
      .post('/api/v1/admin/brands')
      .set('Cookie', adminCookie)
      .send({
        name: 'Test Zareen Heritage',
        description: 'Artisanal heritage fashion',
        logo: 'https://example.com/heritage-logo.png',
      });
    assert(createBrandRes.status === 201, `Admin create brand returns 201 (Got ${createBrandRes.status})`);
    const brandId = createBrandRes.body.data.brand._id;
    const brandSlug = createBrandRes.body.data.brand.slug;

    // 1.5 Public list categories & brands
    const publicCatsRes = await request(app).get('/api/v1/categories');
    assert(publicCatsRes.status === 200, 'Public list categories returns 200');
    assert(publicCatsRes.body.data.categories.length > 0, 'Categories array returned');

    const publicCatDetailsRes = await request(app).get(`/api/v1/categories/${categorySlug}`);
    assert(publicCatDetailsRes.status === 200, 'Public category details by slug returns 200');

    // ==========================================
    // 2. SELLER APPLICATION & APPROVAL WORKFLOW
    // ==========================================
    console.log('\n--- 2. Testing Seller Application & Moderation Workflow ---');

    // 2.1 Customer 1 submits Seller Application
    const applyRes1 = await request(app)
      .post('/api/v1/sellers/apply')
      .set('Cookie', cust1Cookie)
      .send({
        businessName: 'Test Fatima Atelier',
        businessDescription: 'Master couturier in Lahore',
        businessEmail: cust1Email,
        businessPhone: '+92 300 1112233',
        businessAddress: {
          street: 'Gulberg III, MM Alam Road',
          city: 'Lahore',
          country: 'Pakistan',
        },
      });
    assert(applyRes1.status === 201, `Seller application submitted (Got ${applyRes1.status})`);
    const seller1Id = applyRes1.body.data.seller._id;
    assert(applyRes1.body.data.seller.approvalStatus === 'pending', 'Application status is pending');

    // 2.2 Customer 1 duplicate application blocked
    const dupApplyRes = await request(app)
      .post('/api/v1/sellers/apply')
      .set('Cookie', cust1Cookie)
      .send({
        businessName: 'Test Fatima Atelier Duplicate',
        businessEmail: cust1Email,
        businessPhone: '+92 300 1112233',
      });
    assert(dupApplyRes.status === 409, `Duplicate seller application blocked with 409 (Got ${dupApplyRes.status})`);

    // 2.3 Customer 2 submits Seller Application
    const applyRes2 = await request(app)
      .post('/api/v1/sellers/apply')
      .set('Cookie', cust2Cookie)
      .send({
        businessName: 'Test Zainab Pret',
        businessDescription: 'Contemporary luxury pret in Karachi',
        businessEmail: cust2Email,
        businessPhone: '+92 300 4445566',
        businessAddress: { city: 'Karachi', country: 'Pakistan' },
      });
    const seller2Id = applyRes2.body.data.seller._id;

    // 2.4 Unapproved customer tries to access seller products route -> 403
    const blockedProdRes = await request(app)
      .get('/api/v1/seller/products')
      .set('Cookie', cust1Cookie);
    assert(blockedProdRes.status === 403, `Unapproved customer blocked from /seller/products (Got ${blockedProdRes.status})`);

    // 2.5 Admin reviews and approves Seller 1 & Seller 2
    const approveSeller1Res = await request(app)
      .patch(`/api/v1/admin/sellers/${seller1Id}/approve`)
      .set('Cookie', adminCookie);
    assert(approveSeller1Res.status === 200, `Admin approves Seller 1 (Got ${approveSeller1Res.status})`);
    assert(approveSeller1Res.body.data.seller.approvalStatus === 'approved', 'Seller status updated to approved');
    assert(approveSeller1Res.body.data.store !== null, 'Primary store created automatically on approval');
    const store1Id = approveSeller1Res.body.data.store._id;
    const store1Slug = approveSeller1Res.body.data.store.slug;

    // Approve Seller 2
    await request(app)
      .patch(`/api/v1/admin/sellers/${seller2Id}/approve`)
      .set('Cookie', adminCookie);

    // Re-login Seller 1 & 2 to refresh session tokens with new 'seller' role
    const seller1Login = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: cust1Email, password: 'Password123!' });
    const seller1Cookie = seller1Login.headers['set-cookie'][0].split(';')[0];
    assert(seller1Login.body.data.user.role === ROLES.SELLER, 'User account elevated to seller role');

    const seller2Login = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: cust2Email, password: 'Password123!' });
    const seller2Cookie = seller2Login.headers['set-cookie'][0].split(';')[0];

    // ==========================================
    // 3. STORE MANAGEMENT TESTS
    // ==========================================
    console.log('\n--- 3. Testing Store Profiles ---');

    // 3.1 Seller 1 views own store
    const getStoreRes = await request(app)
      .get('/api/v1/seller/store')
      .set('Cookie', seller1Cookie);
    assert(getStoreRes.status === 200, `Seller gets own store (Got ${getStoreRes.status})`);
    assert(getStoreRes.body.data.store.name === 'Test Fatima Atelier', 'Store name matches business');

    // 3.2 Seller 1 updates own store
    const updateStoreRes = await request(app)
      .patch('/api/v1/seller/store')
      .set('Cookie', seller1Cookie)
      .send({
        description: 'Updated luxury bespoke bridal studio description',
        logo: 'https://example.com/atelier-logo.png',
      });
    assert(updateStoreRes.status === 200, 'Seller updates store successfully');
    assert(updateStoreRes.body.data.store.logo === 'https://example.com/atelier-logo.png', 'Store logo updated');

    // 3.3 Public store discovery
    const publicStoresRes = await request(app).get('/api/v1/stores');
    assert(publicStoresRes.status === 200, 'Public stores list returns 200');

    const publicStoreRes = await request(app).get(`/api/v1/stores/${store1Slug}`);
    assert(publicStoreRes.status === 200, 'Public store details by slug returns 200');

    // ==========================================
    // 4. SELLER PRODUCT CRUD & IDOR PROTECTION
    // ==========================================
    console.log('\n--- 4. Testing Product Creation, Moderation & IDOR Security ---');

    // 4.1 Inconsistent Category/Subcategory validation
    const fakeSubcat = '64b0f9b3f3a8b2d1c9e8f7a0';
    const badTaxonomyRes = await request(app)
      .post('/api/v1/seller/products')
      .set('Cookie', seller1Cookie)
      .send({
        name: 'Test Inconsistent Product',
        description: 'Testing invalid subcategory link',
        category: categoryId,
        subcategory: fakeSubcat,
        basePrice: 50000,
      });
    assert(badTaxonomyRes.status === 400 || badTaxonomyRes.status === 422, 'Inconsistent category/subcategory rejected with 400/422');

    // 4.2 Seller 1 Creates Product 1 (Simple Product)
    const createProd1Res = await request(app)
      .post('/api/v1/seller/products')
      .set('Cookie', seller1Cookie)
      .send({
        name: 'Test Regal Crimson Velvet Lehenga',
        description: 'Exquisite zardozi hand-embroidery on pure silk velvet.',
        shortDescription: 'Bridal velvet lehenga with handcrafted zardozi.',
        category: categoryId,
        subcategory: subcategoryId,
        brand: brandId,
        basePrice: 150000,
        compareAtPrice: 180000,
        discount: 16,
        stock: 5,
        sku: 'TEST-LEH-001',
        specifications: [
          { name: 'Fabric', value: 'Silk Velvet' },
          { name: 'Embroidery', value: 'Zardozi & Dabka' },
        ],
        images: [
          { url: 'https://example.com/crimson1.jpg', isPrimary: true, sortOrder: 0 },
        ],
        tags: ['bridal', 'lehenga', 'velvet', 'crimson'],
      });
    assert(createProd1Res.status === 201, `Seller 1 creates product (Got ${createProd1Res.status})`);
    const product1Id = createProd1Res.body.data.product._id;
    const product1Slug = createProd1Res.body.data.product.slug;
    assert(createProd1Res.body.data.product.approvalStatus === 'pending_review', 'New product is in pending_review moderation state');

    // 4.3 Seller 2 Creates Product 2
    const createProd2Res = await request(app)
      .post('/api/v1/seller/products')
      .set('Cookie', seller2Cookie)
      .send({
        name: 'Test Pastel Organza Peshwas',
        description: 'Floral tilla work on hand-woven organza fabric.',
        category: categoryId,
        basePrice: 85000,
        stock: 3,
        sku: 'TEST-PESH-001',
      });
    const product2Id = createProd2Res.body.data.product._id;

    // 4.4 IDOR Security: Seller 1 attempts to modify Seller 2's product -> 403
    const idorUpdateRes = await request(app)
      .patch(`/api/v1/seller/products/${product2Id}`)
      .set('Cookie', seller1Cookie)
      .send({ name: 'Hacked Title By Seller 1' });
    assert(idorUpdateRes.status === 403, `IDOR protection: Seller 1 cannot modify Seller 2's product (Got ${idorUpdateRes.status})`);

    // 4.5 IDOR Security: Seller 1 attempts to delete Seller 2's product -> 403
    const idorDeleteRes = await request(app)
      .delete(`/api/v1/seller/products/${product2Id}`)
      .set('Cookie', seller1Cookie);
    assert(idorDeleteRes.status === 403, `IDOR protection: Seller 1 cannot delete Seller 2's product (Got ${idorDeleteRes.status})`);

    // 4.6 Public catalog MUST NOT show unapproved product
    const publicUnapprovedRes = await request(app).get(`/api/v1/products/${product1Slug}`);
    assert(publicUnapprovedRes.status === 404, `Public API hides unapproved product (Got ${publicUnapprovedRes.status})`);

    // 4.7 Admin Moderation: Admin approves Product 1 & Product 2
    const approveProdRes = await request(app)
      .patch(`/api/v1/admin/products/${product1Id}/approve`)
      .set('Cookie', adminCookie);
    assert(approveProdRes.status === 200, `Admin approves Product 1 (Got ${approveProdRes.status})`);
    assert(approveProdRes.body.data.product.approvalStatus === 'approved', 'Product 1 approved');

    await request(app)
      .patch(`/api/v1/admin/products/${product2Id}/approve`)
      .set('Cookie', adminCookie);

    // 4.8 Public catalog now SHOWS approved product
    const publicApprovedRes = await request(app).get(`/api/v1/products/${product1Slug}`);
    assert(publicApprovedRes.status === 200, `Public API serves approved product (Got ${publicApprovedRes.status})`);
    assert(publicApprovedRes.body.data.product.name === 'Test Regal Crimson Velvet Lehenga', 'Product details match');

    // ==========================================
    // 5. SEARCH, FILTERING, SORTING & PAGINATION
    // ==========================================
    console.log('\n--- 5. Testing Catalog Search, Filters & Sorting ---');

    // 5.1 Keyword Search
    const searchRes = await request(app).get('/api/v1/products?search=Velvet');
    assert(searchRes.status === 200, 'Search by keyword returns 200');
    assert(searchRes.body.data.items.some(p => p._id === product1Id), 'Search found Velvet Lehenga');

    // 5.2 Category Filter
    const filterCatRes = await request(app).get(`/api/v1/products?category=${categorySlug}`);
    assert(filterCatRes.status === 200, 'Filter by category slug returns 200');
    assert(filterCatRes.body.data.items.length >= 1, 'Category products returned');

    // 5.3 Price Range Filter
    const priceFilterRes = await request(app).get('/api/v1/products?minPrice=100000&maxPrice=200000');
    assert(priceFilterRes.status === 200, 'Price range filter returns 200');
    assert(priceFilterRes.body.data.items.every(p => p.basePrice >= 100000 && p.basePrice <= 200000), 'All items match price range');

    // 5.4 Sorting
    const sortRes = await request(app).get('/api/v1/products?sort=price_desc');
    assert(sortRes.status === 200, 'Sort by price_desc returns 200');
    if (sortRes.body.data.items.length >= 2) {
      assert(sortRes.body.data.items[0].basePrice >= sortRes.body.data.items[1].basePrice, 'Sorted descending by price');
    }

    // 5.5 Pagination Metadata
    const pageRes = await request(app).get('/api/v1/products?page=1&limit=2');
    assert(pageRes.status === 200, 'Pagination query returns 200');
    assert(pageRes.body.data.pagination.page === 1, 'Pagination metadata has page');
    assert(pageRes.body.data.pagination.limit === 2, 'Pagination metadata has limit');
    assert(pageRes.body.data.pagination.total >= 2, 'Pagination metadata has total count');

    // ==========================================
    // 6. INVENTORY MANAGEMENT TESTS
    // ==========================================
    console.log('\n--- 6. Testing Inventory Management ---');

    // 6.1 Seller views inventory
    const invRes = await request(app)
      .get('/api/v1/seller/inventory')
      .set('Cookie', seller1Cookie);
    assert(invRes.status === 200, `Seller gets inventory (Got ${invRes.status})`);
    assert(invRes.body.data.items.length > 0, 'Inventory items list returned');

    // 6.2 Adjust Stock (valid)
    const adjustStockRes = await request(app)
      .patch(`/api/v1/seller/inventory/${product1Id}/stock`)
      .set('Cookie', seller1Cookie)
      .send({ stock: 12 });
    assert(adjustStockRes.status === 200, `Stock adjusted to 12 (Got ${adjustStockRes.status})`);
    assert(adjustStockRes.body.data.stock === 12, 'Product stock updated to 12');
    assert(adjustStockRes.body.data.availableStock === 12, 'Available stock is 12');

    // 6.3 Negative Stock Rejected
    const negStockRes = await request(app)
      .patch(`/api/v1/seller/inventory/${product1Id}/stock`)
      .set('Cookie', seller1Cookie)
      .send({ stock: -5 });
    assert(negStockRes.status === 400 || negStockRes.status === 422, 'Negative stock rejected with 400/422');

    // 6.4 IDOR Inventory Protection: Seller 2 cannot adjust Seller 1's product stock
    const idorStockRes = await request(app)
      .patch(`/api/v1/seller/inventory/${product1Id}/stock`)
      .set('Cookie', seller2Cookie)
      .send({ stock: 99 });
    assert(idorStockRes.status === 403, `IDOR protection: Seller 2 cannot alter Seller 1's stock (Got ${idorStockRes.status})`);

    // Clean test records
    await User.deleteMany({ email: /@catalog-test\.com$/i });
    await Category.deleteMany({ slug: /^test-/ });
    await Subcategory.deleteMany({ slug: /^test-/ });
    await Brand.deleteMany({ slug: /^test-/ });
    await Product.deleteMany({ slug: /^test-/ });
    await ProductVariant.deleteMany({ sku: /^TEST-/ });
    await Store.deleteMany({ slug: /^test-/ });
    await Seller.deleteMany({ businessEmail: /@catalog-test\.com$/i });

    console.log('\n================================================================');
    console.log(`  PHASE 3 TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
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
