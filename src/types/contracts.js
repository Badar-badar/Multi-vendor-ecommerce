/**
 * ZAREEN FRONTEND DATA CONTRACTS & SCHEMA DEFINITIONS
 *
 * This file specifies the authoritative contract shapes expected from the
 * upcoming Express + MongoDB backend for all core business domains.
 */

/**
 * @typedef {Object} User
 * @property {string} id - Unique user ID
 * @property {string} name - Full user name
 * @property {string} email - Verified email address
 * @property {'customer' | 'seller' | 'admin'} role - Active role
 * @property {string[]} permissions - Granted granular permissions
 * @property {'active' | 'suspended' | 'pending'} status - User account status
 * @property {string} [avatar] - Profile picture URL
 * @property {string} [phone] - Contact telephone number
 * @property {boolean} isEmailVerified - Email verification flag
 * @property {string} createdAt - ISO timestamp
 */

/**
 * @typedef {Object} ProductVariant
 * @property {string} id - Variant ID
 * @property {string} [sku] - Stock keeping unit
 * @property {string} [size] - Size option (e.g., 'S', 'M', 'L', 'XL')
 * @property {string} [color] - Color name / code
 * @property {number} price - Variant specific price override
 * @property {number} [compareAtPrice] - Strikethrough comparison price
 * @property {number} stock - Available unit inventory
 * @property {string[]} [images] - Variant specific photo URLs
 */

/**
 * @typedef {Object} Product
 * @property {string} id - Unique product ID
 * @property {string} title - Product title / name
 * @property {string} slug - URL friendly unique slug
 * @property {string} description - Full HTML/Markdown description
 * @property {string} [shortDescription] - Concise product summary
 * @property {number} price - Standard retail price
 * @property {number} [compareAtPrice] - Original retail price for discounts
 * @property {number} stock - Total available stock
 * @property {string} category - Category ID or slug
 * @property {string} [subcategory] - Subcategory ID or slug
 * @property {string} [brand] - Brand ID or slug
 * @property {string} seller - Seller ID or store reference
 * @property {string[]} images - High-res product image URLs
 * @property {string} [thumbnail] - Primary preview thumbnail
 * @property {ProductVariant[]} [variants] - Product variants
 * @property {number} [rating] - Average rating (0 - 5)
 * @property {number} [numReviews] - Total review count
 * @property {boolean} [isFeatured] - Featured badge flag
 * @property {boolean} [isNewArrival] - New arrival badge flag
 * @property {'draft' | 'pending' | 'active' | 'rejected' | 'archived'} status - Publishing status
 * @property {string} createdAt - ISO timestamp
 * @property {string} updatedAt - ISO timestamp
 */

/**
 * @typedef {Object} Category
 * @property {string} id - Category ID
 * @property {string} name - Category name
 * @property {string} slug - Unique URL slug
 * @property {string} [description] - Category overview
 * @property {string} [image] - Hero banner / icon URL
 * @property {string[]} [subcategories] - Associated subcategory names/IDs
 * @property {number} [productCount] - Total products in category
 * @property {boolean} isActive - Visibility flag
 */

/**
 * @typedef {Object} Brand
 * @property {string} id - Brand ID
 * @property {string} name - Brand name
 * @property {string} slug - Unique URL slug
 * @property {string} [logo] - Brand logo image URL
 * @property {string} [description] - Brand biography
 * @property {number} [productCount] - Number of catalog items
 * @property {boolean} isActive - Active flag
 */

/**
 * @typedef {Object} Store
 * @property {string} id - Store ID
 * @property {string} sellerId - Owning seller ID
 * @property {string} name - Public store name
 * @property {string} slug - Unique store URL slug
 * @property {string} [description] - Store bio
 * @property {string} [logo] - Store logo URL
 * @property {string} [banner] - Hero store banner URL
 * @property {number} [rating] - Aggregate store rating
 * @property {number} [totalSales] - Total verified sales
 * @property {string} [email] - Store customer service email
 * @property {string} [phone] - Store contact phone
 * @property {string} [city] - Operating city
 * @property {string} [country] - Operating country
 */

/**
 * @typedef {Object} CartItem
 * @property {string} id - Cart item entry ID
 * @property {string} productId - Referenced product ID
 * @property {string} title - Product title snapshot
 * @property {string} slug - Product slug
 * @property {string} image - Item thumbnail
 * @property {number} price - Authoritative unit price snapshot
 * @property {number} quantity - Chosen quantity
 * @property {string} [variantId] - Selected variant ID
 * @property {string} [size] - Selected size
 * @property {string} [color] - Selected color
 * @property {number} stock - Authoritative available inventory
 */

/**
 * @typedef {Object} Cart
 * @property {CartItem[]} items - Array of active cart items
 * @property {number} subtotal - Calculated gross item sum
 * @property {number} discount - Coupon discount sum
 * @property {number} shipping - Calculated shipping fee
 * @property {number} tax - Calculated tax amount
 * @property {number} total - Final payable order total
 * @property {string} [couponCode] - Applied coupon code
 */

/**
 * @typedef {Object} Address
 * @property {string} [id] - Address ID
 * @property {string} fullName - Recipient full name
 * @property {string} phone - Contact phone number
 * @property {string} street - Street address and building/apartment
 * @property {string} city - City / District
 * @property {string} state - Province / State
 * @property {string} zipCode - Postal code
 * @property {string} country - Country
 * @property {boolean} [isDefault] - Default shipping address flag
 */

/**
 * @typedef {Object} OrderItem
 * @property {string} productId - Product ID
 * @property {string} title - Product title
 * @property {string} image - Product thumbnail
 * @property {number} price - Unit price at order time
 * @property {number} quantity - Ordered quantity
 * @property {string} [variantId] - Variant identifier
 * @property {string} [size] - Size selection
 * @property {string} [color] - Color selection
 * @property {string} [sellerId] - Fulfillment seller ID
 */

/**
 * @typedef {Object} Order
 * @property {string} id - Order ID / Order Number
 * @property {string} userId - Purchasing customer ID
 * @property {OrderItem[]} items - Purchased line items
 * @property {Address} shippingAddress - Delivery address
 * @property {Address} [billingAddress] - Invoicing address
 * @property {'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'} status - Order status
 * @property {string} paymentMethod - 'stripe' | 'cod' | 'card'
 * @property {'pending' | 'completed' | 'failed' | 'refunded'} paymentStatus - Payment status
 * @property {number} subtotal - Subtotal amount
 * @property {number} shippingCost - Shipping fee
 * @property {number} discount - Discount applied
 * @property {number} tax - Tax amount
 * @property {number} totalAmount - Total paid / payable amount
 * @property {string} [trackingNumber] - Carrier tracking number
 * @property {string} [carrier] - Shipping provider
 * @property {string} createdAt - ISO timestamp
 */

/**
 * @typedef {Object} Review
 * @property {string} id - Review ID
 * @property {string} productId - Product ID
 * @property {string} userId - Reviewer user ID
 * @property {string} userName - Reviewer display name
 * @property {string} [userAvatar] - Reviewer avatar URL
 * @property {number} rating - Score 1 - 5
 * @property {string} title - Review title
 * @property {string} comment - Detailed review text
 * @property {string[]} [images] - Customer photos
 * @property {boolean} isVerifiedPurchase - Verified buyer flag
 * @property {number} [helpfulCount] - Thumbs up count
 * @property {string} createdAt - ISO timestamp
 */

/**
 * @typedef {Object} Notification
 * @property {string} id - Notification ID
 * @property {string} userId - Recipient user ID
 * @property {string} title - Notification heading
 * @property {string} message - Notification text
 * @property {'order' | 'seller' | 'security' | 'promotion' | 'system'} type - Category
 * @property {string} [link] - Deep link URL
 * @property {boolean} isRead - Read state
 * @property {string} createdAt - ISO timestamp
 */

/**
 * @typedef {Object} AuditLog
 * @property {string} id - Audit record ID
 * @property {string} action - Action key (e.g. 'USER_BAN', 'PRODUCT_APPROVE')
 * @property {string} actorId - User ID who triggered action
 * @property {string} actorName - Display name
 * @property {string} actorRole - Role of actor
 * @property {string} resource - Target resource entity
 * @property {string} [resourceId] - Target resource ID
 * @property {string} [ipAddress] - Request IP
 * @property {'success' | 'flagged' | 'failed'} status - Action outcome
 * @property {object} [details] - Snapshot of modified fields
 * @property {string} createdAt - ISO timestamp
 */

/**
 * @typedef {Object} PaginationMeta
 * @property {number} page - Current 1-based page
 * @property {number} limit - Items per page
 * @property {number} total - Total records matching query
 * @property {number} totalPages - Total computed pages
 */

export const CONTRACT_ROLES = {
  CUSTOMER: 'customer',
  SELLER: 'seller',
  ADMIN: 'admin',
};

export const CONTRACT_ORDER_STATUSES = [
  'pending',
  'paid',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'refunded',
];
