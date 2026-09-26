import { Cart } from '../models/Cart.js';
import { Product, PRODUCT_APPROVAL_STATUS, PRODUCT_STATUS } from '../models/Product.js';
import { ProductVariant } from '../models/ProductVariant.js';
import { AppError } from '../utils/appError.js';

/**
 * Cart Service
 */

/**
 * Finds or creates an empty cart for an authenticated user.
 */
export const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = new Cart({ user: userId, items: [] });
    await cart.save();
  }
  return cart;
};

/**
 * Re-validates all cart items against live DB state and computes live totals.
 */
export const getCartDetails = async (userId) => {
  const cart = await getOrCreateCart(userId);

  const formattedItems = [];
  const issues = [];
  let subtotal = 0;
  let totalDiscount = 0;
  let itemCount = 0;

  for (const item of cart.items) {
    const product = await Product.findById(item.product)
      .populate('category', 'name slug')
      .populate('brand', 'name slug')
      .populate('store', 'name slug logo')
      .populate('seller', 'businessName')
      .lean();

    // 1. Check if product exists and is public
    if (!product || product.approvalStatus !== PRODUCT_APPROVAL_STATUS.APPROVED || product.status !== PRODUCT_STATUS.PUBLISHED) {
      issues.push({
        itemId: item._id,
        productId: item.product,
        type: 'UNAVAILABLE',
        message: `Product is no longer available on Zareen marketplace.`,
      });
      continue;
    }

    let unitPrice = product.basePrice;
    let compareAtPrice = product.compareAtPrice;
    let discountPercent = product.discount || 0;
    let availableStock = Math.max(0, (product.stock || 0) - (product.reservedStock || 0));
    let variantDetails = null;

    // 2. Check variant if applicable
    if (product.hasVariants || item.variant) {
      if (!item.variant) {
        issues.push({
          itemId: item._id,
          productId: product._id,
          type: 'VARIANT_REQUIRED',
          message: `Please select a size/color variant for '${product.name}'.`,
        });
        continue;
      }

      const variant = await ProductVariant.findById(item.variant).lean();
      if (!variant || variant.status !== 'active') {
        issues.push({
          itemId: item._id,
          productId: product._id,
          variantId: item.variant,
          type: 'VARIANT_UNAVAILABLE',
          message: `Selected variant is no longer available.`,
        });
        continue;
      }

      unitPrice = variant.price;
      compareAtPrice = variant.compareAtPrice || compareAtPrice;
      availableStock = Math.max(0, (variant.stock || 0) - (variant.reservedStock || 0));
      variantDetails = {
        _id: variant._id,
        sku: variant.sku,
        attributes: variant.attributes,
        price: variant.price,
      };
    }

    // 3. Check stock availability
    if (availableStock <= 0) {
      issues.push({
        itemId: item._id,
        productId: product._id,
        type: 'OUT_OF_STOCK',
        message: `'${product.name}' is currently out of stock.`,
      });
    } else if (item.quantity > availableStock) {
      issues.push({
        itemId: item._id,
        productId: product._id,
        type: 'INSUFFICIENT_STOCK',
        requestedQuantity: item.quantity,
        availableStock,
        message: `Only ${availableStock} units available for '${product.name}'.`,
      });
    }

    const effectiveQuantity = Math.min(item.quantity, availableStock > 0 ? availableStock : item.quantity);
    const itemSubtotal = unitPrice * item.quantity;
    const itemDiscount = discountPercent > 0 ? (itemSubtotal * discountPercent) / 100 : 0;
    const finalItemTotal = itemSubtotal - itemDiscount;

    subtotal += itemSubtotal;
    totalDiscount += itemDiscount;
    itemCount += item.quantity;

    const primaryImage = (product.images || []).find((img) => img.isPrimary) || (product.images || [])[0];

    formattedItems.push({
      _id: item._id,
      product: {
        _id: product._id,
        name: product.name,
        slug: product.slug,
        image: primaryImage?.url || '',
        category: product.category,
        brand: product.brand,
        store: product.store,
        seller: product.seller,
      },
      variant: variantDetails,
      quantity: item.quantity,
      unitPrice,
      compareAtPrice,
      discountPercent,
      itemSubtotal,
      finalItemTotal,
      availableStock,
      isAvailable: availableStock >= item.quantity && issues.every((i) => i.itemId?.toString() !== item._id.toString()),
    });
  }

  const grandTotal = Math.max(0, subtotal - totalDiscount);

  return {
    _id: cart._id,
    items: formattedItems,
    itemCount,
    subtotal,
    discount: totalDiscount,
    grandTotal,
    hasIssues: issues.length > 0,
    issues,
  };
};

/**
 * Adds an item to the user's cart with live stock and availability checks.
 */
export const addToCart = async (userId, { productId, variantId, quantity = 1 }) => {
  const parsedQuantity = Math.max(1, parseInt(quantity, 10) || 1);

  // 1. Verify Product
  const product = await Product.findById(productId);
  if (!product) {
    throw AppError.notFound('Product not found.');
  }

  if (product.approvalStatus !== PRODUCT_APPROVAL_STATUS.APPROVED || product.status !== PRODUCT_STATUS.PUBLISHED) {
    throw AppError.badRequest('This product is not currently available for purchase.');
  }

  let availableStock = product.availableStock;

  // 2. Verify Variant if required
  if (product.hasVariants) {
    if (!variantId) {
      throw AppError.badRequest('Please specify a product variant.');
    }
    const variant = await ProductVariant.findOne({ _id: variantId, product: productId, status: 'active' });
    if (!variant) {
      throw AppError.notFound('Selected product variant is not available.');
    }
    availableStock = variant.availableStock;
  }

  if (availableStock <= 0) {
    throw AppError.badRequest(`'${product.name}' is out of stock.`);
  }

  const cart = await getOrCreateCart(userId);

  // 3. Check if already in cart -> merge quantity
  const existingItemIndex = cart.items.findIndex(
    (i) => i.product.toString() === productId.toString() &&
      (variantId ? i.variant?.toString() === variantId.toString() : !i.variant)
  );

  if (existingItemIndex > -1) {
    const combinedQuantity = cart.items[existingItemIndex].quantity + parsedQuantity;
    if (combinedQuantity > availableStock) {
      throw AppError.badRequest(`Cannot add ${parsedQuantity} more. Total in cart exceeds available stock (${availableStock}).`);
    }
    cart.items[existingItemIndex].quantity = combinedQuantity;
  } else {
    if (parsedQuantity > availableStock) {
      throw AppError.badRequest(`Requested quantity (${parsedQuantity}) exceeds available stock (${availableStock}).`);
    }
    cart.items.push({
      product: productId,
      variant: variantId || null,
      quantity: parsedQuantity,
    });
  }

  await cart.save();
  return getCartDetails(userId);
};

/**
 * Updates cart item quantity.
 */
export const updateCartItemQuantity = async (userId, itemId, quantity) => {
  const parsedQuantity = parseInt(quantity, 10);
  if (isNaN(parsedQuantity) || parsedQuantity < 1) {
    throw AppError.badRequest('Quantity must be a positive integer.');
  }

  const cart = await getOrCreateCart(userId);
  const item = cart.items.id(itemId);
  if (!item) {
    throw AppError.notFound('Cart item not found.');
  }

  // Check live stock
  const product = await Product.findById(item.product);
  if (!product) {
    throw AppError.notFound('Product not found.');
  }

  let availableStock = product.availableStock;
  if (item.variant) {
    const variant = await ProductVariant.findById(item.variant);
    if (variant) availableStock = variant.availableStock;
  }

  if (parsedQuantity > availableStock) {
    throw AppError.badRequest(`Cannot set quantity to ${parsedQuantity}. Only ${availableStock} units available.`);
  }

  item.quantity = parsedQuantity;
  await cart.save();

  return getCartDetails(userId);
};

/**
 * Removes an item from the cart.
 */
export const removeCartItem = async (userId, itemId) => {
  const cart = await getOrCreateCart(userId);
  cart.items = cart.items.filter((i) => i._id.toString() !== itemId.toString());
  await cart.save();

  return getCartDetails(userId);
};

/**
 * Clears the user's entire cart.
 */
export const clearCart = async (userId) => {
  const cart = await getOrCreateCart(userId);
  cart.items = [];
  await cart.save();

  return {
    items: [],
    itemCount: 0,
    subtotal: 0,
    discount: 0,
    grandTotal: 0,
  };
};

export default {
  getOrCreateCart,
  getCartDetails,
  addToCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
};
