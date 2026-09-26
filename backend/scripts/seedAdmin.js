import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User.js';
import { ROLES, USER_STATUS, getDefaultPermissions } from '../config/permissions.js';
import { connectDB, disconnectDB } from '../database/connectDB.js';

dotenv.config();

/**
 * Secure Admin Seeding Script
 * 
 * Usage:
 *   node scripts/seedAdmin.js
 * 
 * Configured via environment variables:
 *   SEED_ADMIN_NAME (default: "Zareen Master Admin")
 *   SEED_ADMIN_EMAIL (default: "admin@zareen.com")
 *   SEED_ADMIN_PASSWORD (default: "Admin@Zareen2025!")
 */
const seedAdmin = async () => {
  try {
    console.log('--- Initializing Zareen Admin Seeder ---');
    await connectDB();

    const adminName = process.env.SEED_ADMIN_NAME || 'Zareen Master Admin';
    const adminEmail = (process.env.SEED_ADMIN_EMAIL || 'admin@zareen.com').toLowerCase().trim();
    const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'Admin@Zareen2025!';

    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      if (existingAdmin.role === ROLES.ADMIN) {
        console.log(`[OK] Admin account already exists: ${adminEmail} (Role: ${existingAdmin.role})`);
        await disconnectDB();
        process.exit(0);
      } else {
        // Upgrade existing user to admin with full admin permissions
        existingAdmin.role = ROLES.ADMIN;
        existingAdmin.permissions = getDefaultPermissions(ROLES.ADMIN);
        existingAdmin.status = USER_STATUS.ACTIVE;
        existingAdmin.emailVerifiedAt = existingAdmin.emailVerifiedAt || new Date();
        await existingAdmin.save();
        console.log(`[SUCCESS] Existing user ${adminEmail} elevated to Admin.`);
        await disconnectDB();
        process.exit(0);
      }
    }

    // Create new admin user
    const adminUser = new User({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: ROLES.ADMIN,
      permissions: getDefaultPermissions(ROLES.ADMIN),
      status: USER_STATUS.ACTIVE,
      emailVerifiedAt: new Date(),
    });

    await adminUser.save();
    console.log(`[SUCCESS] Master Admin created successfully: ${adminEmail}`);
    console.log(`[INFO] Role: ${adminUser.role} | Permissions: ${adminUser.permissions.length} total granted.`);
    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error('[ERROR] Failed to seed admin user:', error.message);
    await disconnectDB();
    process.exit(1);
  }
};

seedAdmin();
