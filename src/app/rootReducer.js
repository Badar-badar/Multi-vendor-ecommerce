import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import cartReducer from '../features/cart/cartSlice';
import wishlistReducer from '../features/wishlist/wishlistSlice';
import productsReducer from '../features/products/productSlice';
import ordersReducer from '../features/orders/orderSlice';
import sellerReducer from '../features/seller/sellerSlice';
import notificationReducer from '../features/notifications/notificationSlice';
import recentlyViewedReducer from '../features/recentlyViewed/recentlyViewedSlice';
import adminReducer from '../features/admin/adminSlice';
import reviewReducer from '../features/reviews/reviewSlice';
import couponReducer from '../features/coupons/couponSlice';
import promotionReducer from '../features/promotions/promotionSlice';
import returnReducer from '../features/returns/returnSlice';
import addressReducer from '../features/addresses/addressSlice';
import paymentReducer from '../features/payment/paymentSlice';
import checkoutReducer from '../features/checkout/checkoutSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  wishlist: wishlistReducer,
  products: productsReducer,
  orders: ordersReducer,
  seller: sellerReducer,
  notifications: notificationReducer,
  recentlyViewed: recentlyViewedReducer,
  admin: adminReducer,
  reviews: reviewReducer,
  coupons: couponReducer,
  promotions: promotionReducer,
  returns: returnReducer,
  addresses: addressReducer,
  payment: paymentReducer,
  checkout: checkoutReducer,
});

export default rootReducer;
