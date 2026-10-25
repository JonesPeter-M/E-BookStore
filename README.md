# PETER Online Book Store

A full-stack online bookstore built for academic and literary readers. Features a warm, editorial UI with real-time inventory, JWT-authenticated accounts, and a cart/checkout flow backed by an embedded MongoDB instance that starts automatically with no configuration.

---

## Features

- 📚 **Book Catalogue** — 12 seeded titles across Technology, Fiction, Science, History, Self-Help, Business, and Philosophy
- 🔍 **Live Search & Filtering** — search by keyword, filter by category, sort by price/stock/title
- 🛒 **Cart & Checkout** — add to cart, adjust quantities, atomic inventory decrement on order
- 🔖 **Wishlist** — save books to a personal reading list (session-scoped, not persisted to DB)
- 👤 **Auth** — register / log in with JWT + bcrypt; demo account pre-seeded
- 📦 **Order History** — view past orders with status and book details
- 🎨 **3D Hero Book Card** — interactive tilt/rotation on hover
- ♿ **Accessibility** — focus rings, `aria-*` labels, `prefers-reduced-motion` respected throughout

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite 8, Tailwind CSS v4 |
| Animations | Motion (Framer Motion v12) — used in FloatingDock only |
| Icons | Lucide React |
| HTTP Client | Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB via Mongoose; embedded `mongodb-memory-server` for zero-config dev |
| Auth | JSON Web Tokens (`jsonwebtoken`) + `bcryptjs` |
| Fonts | DM Serif Display, Inter (Google Fonts CDN) |

---

## Setup

### Prerequisites
- Node.js ≥ 18
- npm ≥ 10

### Install & Run

```bash
# 1. Clone / unzip the project
cd "online-bookstore (1)"

# 2. Install dependencies
npm install

# 3. Configure environment (optional for dev — defaults work out of the box)
cp .env.example .env
# Edit .env: set a strong JWT_SECRET before deploying to production

# 4. Start the development server (frontend + backend on one port)
npm run dev
```

Open **http://localhost:3000**

### Production Build

```bash
npm run build                    # Builds frontend to dist/
NODE_ENV=production npm start    # Serves dist/ as static files
```

> ⚠️ Always set `JWT_SECRET` in your environment before running in production.

---

## Demo Credentials

These credentials are seeded automatically on every fresh start:

| Field | Value |
|-------|-------|
| Email | `demo@bookstore.test` |
| Password | `password123` |

The **"Demo Login"** button in the navbar fills these in automatically.

---

## Project Structure

```
.
├── server/             # Express API
│   ├── middleware/auth.ts
│   ├── models/         # Mongoose schemas: Book, User, Cart, Order
│   ├── routes/         # auth, books, cart, orders
│   ├── db.ts           # MongoDB connection (embedded or external)
│   └── seed.ts         # 12 books + demo user
├── src/                # React frontend
│   ├── api/client.ts   # Axios instance + typed API helpers
│   ├── components/     # UI components
│   ├── context/        # AuthContext, CartContext, WishlistContext
│   ├── pages/          # HomePage, CartPage, CheckoutPage, OrdersPage, OrderSuccessPage
│   └── types/          # Shared TypeScript interfaces
├── public/
│   └── images/         # bookstore-hero.jpg/webp (hero photo)
├── docs/               # AI Studio project specifications & prompt documentation
├── server.ts           # Entry point — starts Express + Vite middleware
├── .env.example        # Environment variable template (keys only, no values)
└── index.html
```

---

## Deploy on AI Studio (Cloud Run)

When deploying this project to Cloud Run via Google AI Studio (Build mode):

1. **Environment Secrets**:
   - Set `JWT_SECRET` in the AI Studio environment configuration to a secure random string (e.g. generated via `openssl rand -hex 64`).
   - Set `NODE_ENV` to `production`.
2. **Database Behavior**:
   - The database defaults to embedded `mongodb-memory-server` seeded with 12 sample books and demo accounts.
   - Because Cloud Run containers are ephemeral, **in-memory data resets whenever the instance restarts or scales down to zero**.
   - For data persistence across deployments, configure `MONGODB_URI` pointing to an external MongoDB instance (e.g., MongoDB Atlas).

---

## Credits

- **Hero Background Photo**: `TODO: Add photo source attribution`

---

## Known Limitations

| Item | Status |
|------|--------|
| **Wishlist persistence** | Wishlist lives in React context only — resets on page refresh, not saved to the database. |
| **Payment processing** | Checkout accepts a card number field but does **not** process real payments. No payment gateway is integrated. |
| **Email notifications** | No email is sent on order confirmation. |
| **GEMINI_API_KEY env var** | Declared in `.env.example` but no code reads it. |
| **Bundle size** | Main JS bundle is ~587 kB (174 kB gzipped) — above Vite's 500 kB advisory. No code-splitting is in place. |
| **JWT dev fallback** | `server/middleware/auth.ts` falls back to a hardcoded dev secret when `JWT_SECRET` is absent and `NODE_ENV !== 'production'`. This is intentional for dev convenience but **must not reach production without a real secret set**. |
