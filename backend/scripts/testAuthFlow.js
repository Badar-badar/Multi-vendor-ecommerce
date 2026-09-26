import request from 'supertest';
import express from 'express';
import app from '../app.js';
import { connectDB, disconnectDB } from '../database/connectDB.js';
import { User } from '../models/User.js';
import { ROLES, USER_STATUS, PERMISSIONS } from '../config/permissions.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';
import { requirePermission, requireAllPermissions } from '../middleware/permissionMiddleware.js';

/**
 * ZAREEN Phase 2: Full End-to-End Auth, RBAC & Permissions Test Suite
 */
const runTests = async () => {
  console.log('\n==================================================');
  console.log('  STARTING ZAREEN PHASE 2 AUTH & RBAC TEST SUITE  ');
  console.log('==================================================\n');

  await connectDB();

  // Setup dedicated express app for testing RBAC and permission middleware
  const rbacApp = express();
  rbacApp.use(express.json());
  rbacApp.use((req, res, next) => {
    // Basic cookie parsing for testing
    const cookieHeader = req.headers.cookie;
    req.cookies = {};
    if (cookieHeader) {
      cookieHeader.split(';').forEach(c => {
        const [k, v] = c.trim().split('=');
        if (k && v) req.cookies[k] = v;
      });
    }
    next();
  });

  rbacApp.get('/test/seller-only', authenticate, requireRole(ROLES.SELLER), (req, res) => {
    res.json({ success: true, message: 'Seller access granted' });
  });

  rbacApp.get('/test/admin-only', authenticate, requireRole(ROLES.ADMIN), (req, res) => {
    res.json({ success: true, message: 'Admin access granted' });
  });

  rbacApp.get('/test/admin-seller', authenticate, requireRole(ROLES.ADMIN, ROLES.SELLER), (req, res) => {
    res.json({ success: true, message: 'Admin or seller access granted' });
  });

  rbacApp.get('/test/perm-products-view', authenticate, requirePermission(PERMISSIONS.PRODUCTS_VIEW), (req, res) => {
    res.json({ success: true, message: 'Products view permission granted' });
  });

  rbacApp.get('/test/perm-admin-sellers', authenticate, requirePermission(PERMISSIONS.ADMIN_SELLERS_MANAGE), (req, res) => {
    res.json({ success: true, message: 'Admin sellers manage permission granted' });
  });

  rbacApp.use((err, req, res, next) => {
    const status = err.statusCode || 500;
    res.status(status).json({
      success: false,
      message: err.message,
    });
  });

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
    // Clean test accounts
    await User.deleteMany({ email: /@test-zareen\.com$/i });

    const testCustomerEmail = 'customer1@test-zareen.com';
    const testPassword = 'Password123!';
    let customerCookie = '';
    let adminCookie = '';

    // ==========================================
    // 1. REGISTRATION TESTS
    // ==========================================
    console.log('\n--- 1. Testing Registration ---');

    // 1.1 Valid Registration
    const regRes = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Ayesha Khan',
        email: testCustomerEmail,
        password: testPassword,
        confirmPassword: testPassword,
        phone: '+92 300 1234567',
      });

    assert(regRes.status === 201, `Register status 201 Created (Got ${regRes.status})`);
    assert(regRes.body.success === true, 'Response success is true');
    assert(regRes.body.data.user.role === ROLES.CUSTOMER, 'Role defaults strictly to customer');
    assert(!regRes.body.data.user.password, 'Password hash is NEVER returned in response');
    assert(!regRes.body.data.user.verificationToken, 'Verification token is not in response');
    
    // Check cookie
    const setCookieHeader = regRes.headers['set-cookie'];
    assert(setCookieHeader && setCookieHeader.some(c => c.startsWith('token=')), 'Set-Cookie contains HTTP-only auth token');
    if (setCookieHeader) {
      customerCookie = setCookieHeader[0].split(';')[0];
    }

    // 1.2 Privilege Escalation Attempt during Register
    const hackRes = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Attacker Admin',
        email: 'attacker@test-zareen.com',
        password: testPassword,
        confirmPassword: testPassword,
        role: 'admin',
        permissions: ['admin.dashboard.view', 'admin.sellers.manage'],
        status: 'active',
      });

    assert(hackRes.status === 201, 'Attacker registered as normal user');
    assert(hackRes.body.data.user.role === ROLES.CUSTOMER, 'Privilege escalation rejected: role is customer, not admin');
    assert(!hackRes.body.data.user.permissions.includes('admin.dashboard.view'), 'Permission injection rejected');

    // 1.3 Duplicate Email Registration
    const dupRes = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Duplicate Khan',
        email: testCustomerEmail,
        password: testPassword,
        confirmPassword: testPassword,
      });
    assert(dupRes.status === 409, `Duplicate email returns 409 Conflict (Got ${dupRes.status})`);

    // 1.4 Invalid Email Format
    const badEmailRes = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Bad Email',
        email: 'invalid-email-format',
        password: testPassword,
        confirmPassword: testPassword,
      });
    assert(badEmailRes.status === 422, `Invalid email returns 422 Validation Error (Got ${badEmailRes.status})`);

    // 1.5 Password Confirmation Mismatch
    const mismatchRes = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Mismatch Pass',
        email: 'mismatch@test-zareen.com',
        password: testPassword,
        confirmPassword: 'DifferentPassword123!',
      });
    assert(mismatchRes.status === 422, `Password mismatch returns 422 Validation Error (Got ${mismatchRes.status})`);

    // 1.6 Weak Password
    const weakPassRes = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Short Pass',
        email: 'shortpass@test-zareen.com',
        password: 'short',
        confirmPassword: 'short',
      });
    assert(weakPassRes.status === 422, `Short password (<8 chars) returns 422 Validation Error (Got ${weakPassRes.status})`);

    // ==========================================
    // 2. LOGIN TESTS
    // ==========================================
    console.log('\n--- 2. Testing Login ---');

    // 2.1 Valid Login
    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: testCustomerEmail,
        password: testPassword,
      });
    assert(loginRes.status === 200, `Valid login returns 200 OK (Got ${loginRes.status})`);
    assert(loginRes.body.data.user.email === testCustomerEmail, 'User email matches');
    assert(!loginRes.body.data.user.password, 'Password field is omitted');
    if (loginRes.headers['set-cookie']) {
      customerCookie = loginRes.headers['set-cookie'][0].split(';')[0];
    }

    // 2.2 Invalid Password (Account enumeration prevention)
    const wrongPassRes = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: testCustomerEmail,
        password: 'WrongPassword!',
      });
    assert(wrongPassRes.status === 401, 'Invalid password returns 401 Unauthorized');
    assert(wrongPassRes.body.message.includes('Invalid email address or password'), 'Generic error message prevents enumeration');

    // 2.3 Non-existent Email
    const wrongEmailRes = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'nonexistent@test-zareen.com',
        password: testPassword,
      });
    assert(wrongEmailRes.status === 401, 'Non-existent email returns 401 Unauthorized');
    assert(wrongEmailRes.body.message === wrongPassRes.body.message, 'Identical generic error message for unknown email vs wrong password');

    // 2.4 Suspended Account Login
    const suspendedUser = new User({
      name: 'Suspended User',
      email: 'suspended@test-zareen.com',
      password: testPassword,
      status: USER_STATUS.SUSPENDED,
    });
    await suspendedUser.save();

    const suspendedRes = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'suspended@test-zareen.com',
        password: testPassword,
      });
    assert(suspendedRes.status === 403, `Suspended user login rejected with 403 (Got ${suspendedRes.status})`);

    // ==========================================
    // 3. CURRENT USER & PROFILE TESTS
    // ==========================================
    console.log('\n--- 3. Testing Current User (/me) & Profile ---');

    // 3.1 Authenticated /api/v1/auth/me
    const meRes = await request(app)
      .get('/api/v1/auth/me')
      .set('Cookie', customerCookie);
    assert(meRes.status === 200, `Authenticated /auth/me returns 200 (Got ${meRes.status})`);
    assert(meRes.body.data.user.email === testCustomerEmail, 'Me returns correct user profile');
    assert(Array.isArray(meRes.body.data.user.permissions), 'User permissions included');

    // 3.2 Unauthenticated /api/v1/auth/me
    const unauthMeRes = await request(app).get('/api/v1/auth/me');
    assert(unauthMeRes.status === 401, `Unauthenticated /auth/me returns 401 (Got ${unauthMeRes.status})`);

    // 3.3 Safe Profile Update
    const updateRes = await request(app)
      .patch('/api/v1/users/me')
      .set('Cookie', customerCookie)
      .send({
        name: 'Ayesha Khan Updated',
        phone: '+92 321 9876543',
        role: 'admin', // Malicious attempt to elevate role via profile update
      });
    assert(updateRes.status === 200, 'Profile update returns 200 OK');
    assert(updateRes.body.data.user.name === 'Ayesha Khan Updated', 'Name updated successfully');
    assert(updateRes.body.data.user.role === ROLES.CUSTOMER, 'Role remains customer (mass assignment prevented)');

    // 3.4 Change Password
    const changePassRes = await request(app)
      .post('/api/v1/users/me/change-password')
      .set('Cookie', customerCookie)
      .send({
        currentPassword: testPassword,
        newPassword: 'NewPassword123!',
        confirmPassword: 'NewPassword123!',
      });
    assert(changePassRes.status === 200, `Change password returns 200 (Got ${changePassRes.status})`);
    if (changePassRes.headers['set-cookie']) {
      customerCookie = changePassRes.headers['set-cookie'][0].split(';')[0];
    }

    // ==========================================
    // 4. FORGOT PASSWORD & RESET PASSWORD TESTS
    // ==========================================
    console.log('\n--- 4. Testing Password Reset Flow ---');

    // 4.1 Forgot Password Request (registered email)
    const forgotRes = await request(app)
      .post('/api/v1/auth/forgot-password')
      .send({ email: testCustomerEmail });
    assert(forgotRes.status === 200, 'Forgot password returns 200 OK');
    assert(!forgotRes.body.data?.token, 'Reset token is NOT exposed in API response');

    // 4.2 Forgot Password Request (unregistered email - account enumeration check)
    const forgotUnknownRes = await request(app)
      .post('/api/v1/auth/forgot-password')
      .send({ email: 'unknown@test-zareen.com' });
    assert(forgotUnknownRes.status === 200, 'Unknown email in forgot password still returns 200 generic message');

    // 4.3 Direct Token Reset Flow
    const userForReset = await User.findOne({ email: testCustomerEmail });
    const rawResetToken = userForReset.createPasswordResetToken();
    await userForReset.save();

    const resetRes = await request(app)
      .post('/api/v1/auth/reset-password')
      .send({
        token: rawResetToken,
        password: 'BrandNewPassword123!',
        confirmPassword: 'BrandNewPassword123!',
      });
    assert(resetRes.status === 200, `Reset password with valid token returns 200 (Got ${resetRes.status})`);

    // 4.4 Prevent Token Reuse
    const reuseResetRes = await request(app)
      .post('/api/v1/auth/reset-password')
      .send({
        token: rawResetToken,
        password: 'AnotherPassword123!',
        confirmPassword: 'AnotherPassword123!',
      });
    assert(reuseResetRes.status === 400, 'Reused password reset token returns 400 Bad Request');

    // ==========================================
    // 5. EMAIL VERIFICATION TESTS
    // ==========================================
    console.log('\n--- 5. Testing Email Verification ---');

    const unverifiedUser = await User.findOne({ email: testCustomerEmail });
    const rawVerifyToken = unverifiedUser.createEmailVerificationToken();
    await unverifiedUser.save();

    // 5.1 Verify with Valid Token
    const verifyRes = await request(app)
      .post('/api/v1/auth/verify-email')
      .send({ token: rawVerifyToken });
    assert(verifyRes.status === 200, `Verify email returns 200 OK (Got ${verifyRes.status})`);

    // 5.2 Prevent Verification Token Reuse
    const reuseVerifyRes = await request(app)
      .post('/api/v1/auth/verify-email')
      .send({ token: rawVerifyToken });
    assert(reuseVerifyRes.status === 400, 'Reused verification token returns 400');

    // ==========================================
    // 6. RBAC & PERMISSIONS TESTS
    // ==========================================
    console.log('\n--- 6. Testing RBAC & Permissions Enforcement ---');

    // Admin login
    const adminLoginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'admin@zareen.com',
        password: 'Admin@Zareen2025!',
      });
    assert(adminLoginRes.status === 200, `Admin login returns 200 (Got ${adminLoginRes.status})`);
    assert(adminLoginRes.body.data.user.role === ROLES.ADMIN, 'Admin role confirmed');
    if (adminLoginRes.headers['set-cookie']) {
      adminCookie = adminLoginRes.headers['set-cookie'][0].split(';')[0];
    }

    // Customer accessing Seller-only route -> 403 Forbidden
    const custToSellerRes = await request(rbacApp)
      .get('/test/seller-only')
      .set('Cookie', customerCookie);
    assert(custToSellerRes.status === 403, `Customer accessing seller route returns 403 (Got ${custToSellerRes.status})`);

    // Customer accessing Admin-only route -> 403 Forbidden
    const custToAdminRes = await request(rbacApp)
      .get('/test/admin-only')
      .set('Cookie', customerCookie);
    assert(custToAdminRes.status === 403, `Customer accessing admin route returns 403 (Got ${custToAdminRes.status})`);

    // Admin accessing Admin-only route -> 200 OK
    const adminToAdminRes = await request(rbacApp)
      .get('/test/admin-only')
      .set('Cookie', adminCookie);
    assert(adminToAdminRes.status === 200, `Admin accessing admin route returns 200 OK (Got ${adminToAdminRes.status})`);

    // Customer checking permissions: customer has products.view -> 200 OK
    const custPermRes = await request(rbacApp)
      .get('/test/perm-products-view')
      .set('Cookie', customerCookie);
    assert(custPermRes.status === 200, `Customer with products.view permission allowed (Got ${custPermRes.status})`);

    // Customer checking permissions: customer DOES NOT have admin.sellers.manage -> 403 Forbidden
    const custDeniedPermRes = await request(rbacApp)
      .get('/test/perm-admin-sellers')
      .set('Cookie', customerCookie);
    assert(custDeniedPermRes.status === 403, `Customer without admin.sellers.manage permission denied 403 (Got ${custDeniedPermRes.status})`);

    // Admin checking permissions: admin has admin.sellers.manage -> 200 OK
    const adminPermRes = await request(rbacApp)
      .get('/test/perm-admin-sellers')
      .set('Cookie', adminCookie);
    assert(adminPermRes.status === 200, `Admin with admin.sellers.manage permission allowed (Got ${adminPermRes.status})`);

    // ==========================================
    // 7. LOGOUT TESTS
    // ==========================================
    console.log('\n--- 7. Testing Logout ---');

    const logoutRes = await request(app).post('/api/v1/auth/logout');
    assert(logoutRes.status === 200, 'Logout returns 200 OK');
    const clearCookieHeader = logoutRes.headers['set-cookie'];
    assert(
      clearCookieHeader && clearCookieHeader.some(c => c.includes('token=;') || c.includes('Max-Age=0') || c.includes('Expires=')),
      'Auth cookie is cleared on logout'
    );

    // Repeated Logout is safe
    const repeatLogoutRes = await request(app).post('/api/v1/auth/logout');
    assert(repeatLogoutRes.status === 200, 'Repeated logout remains 200 OK without errors');

    // Clean test accounts
    await User.deleteMany({ email: /@test-zareen\.com$/i });

    console.log('\n==================================================');
    console.log(`  RESULTS: ${passed} PASSED | ${failed} FAILED`);
    console.log('==================================================\n');

    await disconnectDB();
    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error('Fatal test error:', err);
    await disconnectDB();
    process.exit(1);
  }
};

runTests();
