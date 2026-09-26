# Zareen Luxury Marketplace — Technical Handover Document

## 1. Project Overview & Philosophy
Zareen is a multi-vendor luxury marketplace designed for high-end fashion, fine jewelry, haute horlogerie, and bespoke artisanal goods. The system adheres to a strict **Server as the Source of Truth** philosophy: client state serves solely for rendering and estimation, while pricing, taxes, shipping, coupon validity, inventory allocation, and role authorization are calculated authoritatively on the backend.

---

## 2. API Endpoints Reference

### Auth (`/api/v1/auth`)
- `POST /register`: Registers customer account and sets HTTP-only auth cookie.
- `POST /login`: Authenticates user and sets secure cookie.
- `POST /logout`: Clears session cookie and resets client session.
- `POST /verify-email`: Verifies token sent via email.
- `POST /forgot-password`: Generates secure password reset token.
- `POST /reset-password`: Resets password using token.
- `POST /google`: Verifies Google OAuth token.

### Users & Profile (`/api/v1/users`)
- `GET /me`: Returns currently authenticated user profile.
- `PATCH /me`: Updates personal information (name, phone, avatar).
- `PATCH /me/change-password`: Changes password with current password verification.
- `GET /me/addresses`: Retrieves saved delivery addresses.
- `POST /me/addresses`: Saves a new delivery address.
- `PATCH /me/addresses/:id`: Updates an existing address.
- `DELETE /me/addresses/:id`: Removes saved address.
- `PATCH /me/addresses/:id/default`: Sets address as default.

### Catalog & Taxonomy (`/api/v1/`)
- `GET /categories`: Public list of active product categories.
- `GET /categories/:id/subcategories`: Subcategories under a parent category.
- `GET /brands`: Public list of verified luxury brands.
- `GET /products`: Public paginated product catalog with search, price range, brand, and sort filters.
- `GET /products/:idOrSlug`: Product details with variants and stock availability.
- `GET /stores`: Public directory of approved seller boutiques.
- `GET /stores/:slug`: Boutique profile and featured collections.

### Shopping Bag & Checkout (`/api/v1/`)
- `GET /cart`: Retrieves authenticated user shopping bag.
- `POST /cart/items`: Adds item/variant to bag.
- `PATCH /cart/items/:id`: Updates quantity in bag.
- `DELETE /cart/items/:id`: Removes item from bag.
- `DELETE /cart`: Empties bag.
- `POST /checkout/validate`: Authoritative validation of items, shipping, coupon discount, and taxes.

### Orders & Payments (`/api/v1/`)
- `POST /orders`: Places authoritative order and deducts stock.
- `GET /orders`: Customer order history.
- `GET /orders/:id`: Detailed order breakdown with fulfillment timeline.
- `PATCH /orders/:id/cancel`: Cancels pending order and restores stock.
- `POST /orders/:id/return`: Submits return request for Atelier review.
- `POST /orders/:id/reorder`: Re-adds eligible items to cart.
- `POST /payments/create-intent`: Creates Stripe PaymentIntent for order.
- `POST /payments/webhook`: Stripe webhook processing for `payment_intent.succeeded`.

### Seller Portal (`/api/v1/seller`)
- `POST /apply`: Submits application to become an accredited marketplace seller.
- `GET /application`: Checks seller application status.
- `GET /store` & `PATCH /store`: Retrieves/updates boutique profile.
- `GET /products` & `POST /products`: Manages seller's product collection.
- `PATCH /products/:id` & `DELETE /products/:id`: Edits/deletes seller products.
- `GET /inventory` & `PATCH /inventory/:id/stock`: Real-time stock management.
- `GET /orders` & `PATCH /orders/:id/status`: Order item fulfillment tracking.
- `GET /returns` & `PATCH /returns/:id/review`: Reviews customer return requests.
- `GET /coupons` & `POST /coupons`: Seller-specific promotional coupons.
- `GET /earnings`: Financial earnings and payout ledger.
- `GET /analytics/overview`: Gross sales, net earnings, order count, and low stock metrics.

### Administrator (`/api/v1/admin`)
- `GET /analytics/overview`: Platform-wide gross sales, commission, active sellers, order volume.
- `GET /reports/:type`: Generates JSON and streaming CSV reports (sales, orders, sellers).
- `GET /sellers` & `PATCH /sellers/:id/approve` / `reject`: Seller accreditation review.
- `GET /products` & `PATCH /products/:id/status`: Catalog moderation.
- `GET /orders` & `PATCH /orders/:id/status`: Master logistics oversight.
- `POST /orders/:id/refund`: Authoritative Stripe refund issuance.
- `GET /reviews` & `PATCH /reviews/:id/status`: Customer reviews moderation.
- `GET /coupons` & `POST /coupons`: Platform-wide promotional vouchers.
- `GET /settings` & `PATCH /settings`: Platform settings (commission rate, tax rate, shipping fee).

---

## 3. Order Lifecycle & Status Flow

```
+------------------+
| pending_payment  |
+--------+---------+
         |
         | (Stripe Webhook: payment_intent.succeeded)
         v
+------------------+
|      paid        |
+--------+---------+
         |
         | (Order routed to Seller Atelier)
         v
+------------------+
|   processing     |
+--------+---------+
         |
         | (Seller attaches tracking & dispatches)
         v
+------------------+
|    shipped       |
+--------+---------+
         |
         | (Courier confirms handover)
         v
+------------------+
|   delivered      |
+--------+---------+
         |
         +----------------------------+
         |                            |
         v                            v
+------------------+         +------------------+
|  return_requested|         | verified_review  |
+--------+---------+         +------------------+
         |
         | (Seller/Admin Decision)
         v
+------------------+
|    returned      |
+--------+---------+
         |
         | (Stripe Refund Processed)
         v
+------------------+
|    refunded      |
+------------------+
```

---

## 4. Production Deployment Checklist

- [x] **Database**: Connect to production MongoDB Atlas cluster with connection pooling and replica sets.
- [x] **Redis**: Provision dedicated Redis instance for query caching and BullMQ queue processing.
- [x] **Stripe**: Configure production `STRIPE_SECRET_KEY` and set webhook endpoint pointing to `https://api.yourdomain.com/api/v1/payments/webhook`.
- [x] **Security**: Enable HTTPS on reverse proxy (Nginx / Cloudflare), set `NODE_ENV=production`, and confirm `Secure` cookies.
- [x] **WebSockets**: Ensure hosting environment (e.g. AWS ECS, Render, Railway, DigitalOcean App Platform) supports persistent WebSocket connections for Socket.IO.
- [x] **Workers**: Run standalone BullMQ background workers (`npm run worker` in `backend/`) to process asynchronous emails and routine maintenance jobs.

---

## 5. Future Engineering Roadmap (Deferred Features)

1. **AI Recommendations**: Personalized product suggestions based on browsing history and purchase behavior.
2. **Intelligent Semantic Search**: Vector-based multi-modal visual and semantic search for luxury items.
3. **AI Concierge**: Real-time white-glove customer assistance bot with inventory knowledge.
4. **Automated Payouts**: Automated Stripe Connect custom account payouts for marketplace sellers.
