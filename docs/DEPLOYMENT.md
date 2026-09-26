# Zareen Production Deployment Guide

This guide describes the complete procedure for deploying the **Zareen MERN E-Commerce Platform** to a production environment.

---

## 🏗 High-Level Production Architecture

```
                      [ HTTPS Traffic / Cloudflare CDN ]
                                       │
            ┌──────────────────────────┴──────────────────────────┐
            ▼                                                     ▼
  [ Static Frontend Host ]                              [ Reverse Proxy / Nginx ]
 (Vercel / Netlify / S3 / CloudFront)                       │ (SSL Termination & WSS)
  React 19 + Tailwind SPA                                   ▼
                                                  [ Express API Node Server ]
                                                    `npm start` (Port 5000)
                                                            │
                     ┌──────────────────┬───────────────────┼──────────────────┐
                     ▼                  ▼                   ▼                  ▼
             [ MongoDB Atlas ]    [ Redis Cloud ]    [ BullMQ Worker ]    [ Stripe API ]
               Replica Set          Cache/Queues      `npm run worker`     Webhooks
```

---

## 📋 Step-by-Step Deployment Sequence

### Step 1: Prepare Database (MongoDB Atlas)
1. Create a dedicated Production Project in MongoDB Atlas.
2. Deploy an M10+ replica set cluster.
3. Configure Database Access: Create an authenticated user with read/write privileges for the `zareen_ecommerce` database.
4. Configure Network Access: Whitelist your backend API server IP addresses (or `0.0.0.0/0` with strict authentication credentials).
5. Obtain the connection URI: `mongodb+srv://<user>:<password>@cluster.mongodb.net/zareen_ecommerce?retryWrites=true&w=majority`.

### Step 2: Prepare Redis (Cache & BullMQ)
1. Provision a managed Redis instance (Redis Cloud, Upstash, or AWS ElastiCache).
2. Obtain connection string with authentication: `rediss://default:<password>@<redis-host>:6379`.

### Step 3: Configure Backend Environment Variables
In your backend hosting platform (e.g. AWS ECS, Render, DigitalOcean App Platform, Railway, or Linux VPS):
```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/zareen_ecommerce?retryWrites=true&w=majority
CLIENT_URL=https://zareen.luxury
JWT_SECRET=your_ultra_secure_256bit_random_secret_here
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_ultra_secure_refresh_secret_here
JWT_REFRESH_EXPIRES_IN=30d
STRIPE_SECRET_KEY=sk_live_your_stripe_production_key
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_production_webhook_secret
STRIPE_CURRENCY=pkr
REDIS_URL=rediss://default:password@host:port
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your_sendgrid_api_key
MAIL_FROM=Zareen Luxury Maison <concierge@zareen.luxury>
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Step 4: Deploy Backend API Server
1. Install production dependencies:
   ```bash
   cd backend
   npm ci --production=false
   ```
2. (Optional) Run database seeding for initial taxonomy and platform defaults:
   ```bash
   npm run seed
   ```
3. Start the API process with PM2 or Docker:
   ```bash
   npm start
   ```

### Step 5: Start BullMQ Background Worker
Run the dedicated background worker as a background process or separate container service:
```bash
cd backend
npm run worker
```

### Step 6: Configure Stripe Production Webhooks
1. Log in to your [Stripe Dashboard](https://dashboard.stripe.com/).
2. Navigate to **Developers** → **Webhooks** → **Add endpoint**.
3. Set URL to: `https://api.zareen.luxury/api/v1/payments/webhook`.
4. Select events to listen for:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
5. Copy the **Signing secret** (`whsec_...`) into your backend `STRIPE_WEBHOOK_SECRET` environment variable.

### Step 7: Configure Frontend Environment & Build
1. In your frontend build environment (e.g., Vercel, Netlify, Cloudflare Pages):
   ```env
   VITE_API_URL=https://api.zareen.luxury/api/v1
   VITE_SOCKET_URL=https://api.zareen.luxury
   VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
   ```
2. Run production build command:
   ```bash
   cd client
   npm ci
   npm run build
   ```
3. Deploy the compiled `client/dist/` directory to your static hosting CDN.

### Step 8: Configure Nginx / Reverse Proxy for WebSockets & SSL
```nginx
server {
    server_name api.zareen.luxury;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 🧪 Post-Deployment Verification & Smoke Test

1. **API Health**: Query `GET https://api.zareen.luxury/api/health` — must return `200 OK`.
2. **Customer Flow**: Register/Login → Browse Products → Add to Bag → Validate Checkout → Execute Stripe Live Card Payment → Confirm Order.
3. **Seller Flow**: Login as Seller → Check Orders → Update Item Status to `shipped` → Confirm status update.
4. **Admin Flow**: Login as Admin → Verify platform overview analytics → Review payments & commissions.
