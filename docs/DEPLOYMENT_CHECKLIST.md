# Zareen Production Deployment Checklist

Use this checklist to ensure all security, database, worker, payment, and frontend requirements are verified prior to going live.

---

### 1. Infrastructure & Databases
- [ ] **MongoDB Production Instance**: MongoDB Atlas cluster provisioned (M10+ recommended), network access whitelist configured, automated daily snapshots enabled.
- [ ] **Redis Production Instance**: Dedicated Redis instance (Upstash, AWS ElastiCache, or Redis Cloud) with TLS and authentication enabled.
- [ ] **Node.js Environment**: Node.js runtime v18+ configured on backend hosting server/container.

### 2. Environment Variables & Security
- [ ] **Backend Environment (`backend/.env`)**:
  - `NODE_ENV=production`
  - `PORT=5000` (or platform dynamic port `$PORT`)
  - `MONGO_URI=<production_mongodb_connection_string>`
  - `CLIENT_URL=https://<your-frontend-domain.com>`
  - `JWT_SECRET=<min_64_char_random_crypto_secret>`
  - `JWT_EXPIRES_IN=7d`
  - `JWT_REFRESH_SECRET=<min_64_char_random_crypto_secret>`
  - `JWT_REFRESH_EXPIRES_IN=30d`
  - `STRIPE_SECRET_KEY=sk_live_...`
  - `STRIPE_WEBHOOK_SECRET=whsec_...`
  - `STRIPE_CURRENCY=pkr`
  - `REDIS_URL=rediss://default:<password>@<redis-host>:6379`
  - `SMTP_HOST=<smtp.provider.com>`
  - `SMTP_PORT=587`
  - `SMTP_USER=<smtp_username>`
  - `SMTP_PASSWORD=<smtp_password>`
  - `MAIL_FROM=Zareen Luxury Maison <concierge@yourdomain.com>`
  - `GOOGLE_CLIENT_ID=<google_oauth_client_id>`
  - `GOOGLE_CLIENT_SECRET=<google_oauth_client_secret>`
- [ ] **Frontend Environment (`client/.env`)**:
  - `VITE_API_URL=https://api.<your-backend-domain.com>/api/v1`
  - `VITE_SOCKET_URL=https://api.<your-backend-domain.com>`
  - `VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...`

### 3. Server Configuration & Process Management
- [ ] **HTTPS / SSL**: SSL certificates configured via reverse proxy (Nginx, Caddy, or Cloudflare).
- [ ] **Process Management**: Backend API managed by PM2 (`ecosystem.config.js`) or Docker container with restart policy `always`.
- [ ] **BullMQ Background Workers**: Standalone worker process running `npm run worker` to process email queues and cleanup tasks.
- [ ] **WebSocket Support**: Reverse proxy configured with `Upgrade: websocket` and `Connection: Upgrade` headers.

### 4. Payments & Webhooks
- [ ] **Stripe Production Webhook**: Webhook endpoint configured in Stripe Dashboard pointing to `https://api.<your-backend-domain.com>/api/v1/payments/webhook`.
- [ ] **Stripe Event Subscriptions**: Subscribed to `payment_intent.succeeded`, `payment_intent.payment_failed`, and `charge.refunded`.

### 5. Post-Deployment Verification
- [ ] Health check returns `200 OK` on `https://api.<your-backend-domain.com>/api/health`.
- [ ] Authentication sets secure, HTTP-only cookie over HTTPS.
- [ ] Real-time Socket.IO connection establishes successfully.
- [ ] Customer checkout flow completes with Stripe Live payment verification.
