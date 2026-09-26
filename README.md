# Zareen — Multi-Vendor Luxury Marketplace

Zareen is a production-grade, multi-vendor luxury e-commerce marketplace built using the MERN stack (MongoDB, Express, React, Node.js) with Stripe payment integration, Redis caching, BullMQ background queues, and real-time Socket.IO synchronization.

---

## 🏛 System Architecture & Technology Stack

### Frontend (Client)
- **Framework**: React 19 + Vite 8
- **Styling**: Tailwind CSS v4 (Global luxury design token system)
- **State Management**: Redux Toolkit (Decoupled domain slices & thunks)
- **Routing**: React Router DOM v7 (Role-based route guards)
- **Real-Time WebSockets**: `socket.io-client` v4
- **Payments**: `@stripe/stripe-js`

### Backend (API Server)
- **Runtime**: Node.js (ES Modules) + Express
- **Database**: MongoDB + Mongoose ODM (Indexes, Schemas, Transactions)
- **Authentication**: HTTP-Only JWT Cookies, Role-Based Access Control (Customer, Seller, Admin)
- **Payments**: Stripe API SDK (Server-authoritative PaymentIntents + Webhooks)
- **Caching & Queues**: Redis + BullMQ (Asynchronous worker pipelines)
- **Real-Time Events**: Socket.IO Server (Room-isolated user, seller, and admin channels)
- **Security**: Helmet, Strict CORS, Rate Limiting, Cookie Sanitization, Input Validation

---

## 📁 Repository Structure

```
zareen-eccommerce/
├── backend/                  # Express REST API Server
│   ├── config/               # Environment & database configurations
│   ├── controllers/          # Thin request/response handlers
│   ├── database/             # MongoDB connection & index initializers
│   ├── jobs/                 # Cron & maintenance task routines
│   ├── middleware/           # Auth, RBAC, error, rate-limiting middleware
│   ├── models/               # Mongoose schemas & data models
│   ├── queues/               # BullMQ background job queues
│   ├── routes/               # API endpoint routing definitions
│   ├── scripts/              # Automated unit, integration & E2E tests
│   ├── services/             # Core business & financial logic
│   ├── utils/                # Token, Logger, Socket.IO, ApiResponse helpers
│   ├── validators/           # Request schema & input validation rules
│   └── workers/              # Standalone BullMQ background job workers
│
├── client/                   # React 19 Frontend Application
│   ├── src/
│   │   ├── api/              # Axios API service clients
│   │   ├── app/              # Redux store configuration
│   │   ├── components/       # Reusable atomic UI & layout components
│   │   ├── features/         # Redux slices, thunks, selectors by domain
│   │   ├── guards/           # Protected, Seller, & Admin route guards
│   │   ├── hooks/            # Custom React domain hooks
│   │   ├── layouts/          # Customer, Seller, and Admin shell layouts
│   │   ├── pages/            # Application view pages
│   │   ├── routes/           # Unified React Router routes
│   │   └── services/         # Socket.IO client service abstraction
│   └── package.json
│
├── docs/                     # Project documentation & handover guides
└── README.md
```

---

## 🚀 Quickstart & Installation

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **MongoDB**: v6.0 or higher (Local or MongoDB Atlas)
- **Redis**: v6.0 or higher (Optional in development; graceful in-memory fallback active)

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure your MongoDB URI, JWT secret, and Stripe keys in .env
npm run dev
```

### 3. Frontend Setup
```bash
cd client
npm install
cp .env.example .env
npm run dev
```

The application will be running at:
- **Frontend Client**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000/api/v1`
- **Health Check**: `http://localhost:5000/api/health`

---

## 🛠 Available Scripts & Commands

### Backend (`backend/package.json`)
- `npm run dev`: Starts the backend server with auto-restart via `nodemon`.
- `npm start`: Starts the production backend Express server.
- `npm run worker`: Starts the standalone BullMQ background queue worker.
- `npm test`: Executes the complete test suite (222 unit/integration tests + 18 E2E tests).
- `npm run seed`: Seeds initial categories, brands, and administrative settings.

### Frontend (`client/package.json`)
- `npm run dev`: Launches the Vite development server with Hot Module Replacement.
- `npm run build`: Compiles the optimized, minified production bundle in `dist/`.
- `npm run preview`: Locally previews the production build.
- `npm run lint`: Runs ESLint across the client codebase.

---

## 💳 Stripe Payment Architecture

1. **Authoritative Calculation**: Client bag estimates totals; backend calculates exact amounts via `POST /api/v1/checkout/validate`.
2. **PaymentIntent Generation**: Frontend requests intent via `POST /api/v1/payments/create-intent`.
3. **Stripe Authorization**: Customer submits payment directly via Stripe Elements.
4. **Webhook Confirmation**: Stripe delivers `payment_intent.succeeded` webhook to `POST /api/v1/payments/webhook`.
5. **Fulfillment & Commission**: Backend updates order to `paid`, deducts inventory, and records 10% platform commission.

---

## 📡 Real-Time WebSockets (Socket.IO)

- Client connects upon authenticated login with secure credentials.
- Connected sockets join private rooms: `user:<userId>`, `seller:<sellerId>`, and `admin`.
- Supported Real-Time Events:
  - `notification:new`: In-app alerts for order progress, refunds, and store approvals.
  - `order:payment_updated`: Real-time order payment status update.
  - `seller:order_paid`: Live alerts for sellers upon customer acquisition.

---

## 🧪 Testing & Quality Assurance

Run the comprehensive automated test suite from the `backend/` directory:
```bash
cd backend
npm test
```
**Test Results**: **222 / 222 Passing (100% Success Rate)** across all marketplace phases.
