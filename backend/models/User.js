import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { ROLES, USER_STATUS, getDefaultPermissions } from '../config/permissions.js';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your full name.'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters.'],
      maxlength: [100, 'Name cannot exceed 100 characters.'],
    },
    email: {
      type: String,
      required: [true, 'Please provide your email address.'],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address format.',
      ],
    },
    password: {
      type: String,
      required: [
        function () {
          // Password is required only if user is not authenticating via Google OAuth
          return !this.googleId;
        },
        'Please provide a secure password.',
      ],
      minlength: [8, 'Password must be at least 8 characters long.'],
      select: false, // Never returned in default queries
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    avatar: {
      type: String,
      default:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
    },
    role: {
      type: String,
      enum: {
        values: Object.values(ROLES),
        message: 'Role must be customer, seller, or admin.',
      },
      default: ROLES.CUSTOMER,
      index: true,
    },
    permissions: {
      type: [String],
      default: function () {
        return getDefaultPermissions(this.role || ROLES.CUSTOMER);
      },
    },
    status: {
      type: String,
      enum: {
        values: Object.values(USER_STATUS),
        message: 'Status must be active, inactive, or suspended.',
      },
      default: USER_STATUS.ACTIVE,
      index: true,
    },
    emailVerifiedAt: {
      type: Date,
      default: null,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
    googleId: {
      type: String,
      default: null,
      sparse: true,
      index: true,
    },

    // Security Tokens (Hashed sha256, never returned to client)
    verificationToken: {
      type: String,
      select: false,
    },
    verificationTokenExpiresAt: {
      type: Date,
      select: false,
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpiresAt: {
      type: Date,
      select: false,
    },
    passwordChangedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.password;
        delete ret.verificationToken;
        delete ret.verificationTokenExpiresAt;
        delete ret.passwordResetToken;
        delete ret.passwordResetExpiresAt;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      transform: (doc, ret) => {
        delete ret.password;
        delete ret.verificationToken;
        delete ret.verificationTokenExpiresAt;
        delete ret.passwordResetToken;
        delete ret.passwordResetExpiresAt;
        delete ret.__v;
        return ret;
      },
    },
  }
);

/**
 * Pre-save middleware: Hashes user password with bcrypt (12 rounds)
 */
userSchema.pre('save', async function () {
  // Only hash password if it has been modified (or is new)
  if (!this.isModified('password') || !this.password) return;

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);

  // If password was modified on an existing document, update passwordChangedAt
  if (!this.isNew) {
    this.passwordChangedAt = new Date(Date.now() - 1000); // 1s in past to ensure token issued after save is valid
  }
});

/**
 * Pre-save middleware: Synchronizes permissions if role changes
 */
userSchema.pre('save', function () {
  if (this.isModified('role') && (!this.permissions || this.permissions.length === 0)) {
    this.permissions = getDefaultPermissions(this.role);
  }
});

/**
 * Instance Method: Compares candidate password with stored hash
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

/**
 * Instance Method: Checks if password was changed after a JWT token was issued
 */
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

/**
 * Instance Method: Generates unhashed email verification token for email delivery
 * and stores hashed token in DB with a 24-hour expiration.
 */
userSchema.methods.createEmailVerificationToken = function () {
  const rawToken = crypto.randomBytes(32).toString('hex');

  this.verificationToken = crypto
    .createHash('sha256')
    .update(rawToken)
    .digest('hex');

  this.verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  return rawToken;
};

/**
 * Instance Method: Generates unhashed password reset token for email delivery
 * and stores hashed token in DB with a 1-hour expiration.
 */
userSchema.methods.createPasswordResetToken = function () {
  const rawToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(rawToken)
    .digest('hex');

  this.passwordResetExpiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  return rawToken;
};

export const User = mongoose.model('User', userSchema);
export default User;
