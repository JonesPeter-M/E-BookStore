# PETER Online Book Store — Design System & UX Blueprint

**Brand:** PETER Online Book Store  
**Audience:** Students and young readers  
**Direction:** Premium dark editorial / Night Library  
**Implementation credit:** Last finish made by Jones JP

## Product principle

Make finding and buying a book effortless. Distinctiveness comes from a dimensional hero book, editorial typography, confident contrast, curated discovery, and precise interaction feedback—not motion for its own sake.

## Existing architecture to preserve

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- React Router DOM v7
- Axios API client and JWT request interceptor
- Existing `AuthContext` and `CartContext`
- Express 4 / Node.js API
- MongoDB + Mongoose; existing User, Book, Cart and Order models
- Existing routes: `/`, `/cart`, `/checkout`, `/order-success/:orderId`, `/orders`
- Existing APIs for authentication, books, cart and orders
- Existing catalogue search, category filters, stock handling, checkout validation, order history and assessment documentation modal

Do not replace the working backend with mock data or a frontend-only prototype. Inspect the actual code before editing. Preserve API contracts unless a change is necessary, documented, and tested.

## Visual tokens

| Token | Value | Use |
|---|---|---|
| `--color-bg` | `#111318` | Main page background |
| `--color-surface` | `#191C24` | Cards, navigation, drawers |
| `--color-elevated` | `#292D38` | Hover surfaces, popovers |
| `--color-accent` | `#B9A4FF` | Primary brand action and focus accents |
| `--color-accent-warm` | `#E7AE68` | Price highlights and rare emphasis |
| `--color-text` | `#F4F1EA` | Primary text |
| `--color-muted` | `#B5B7C2` | Secondary text |
| `--color-border` | `#343844` | Dividers and outlines |
| `--color-success` | `#72C69B` | Success status, paired with text/icon |
| `--color-warning` | `#F0BE70` | Low-stock status, paired with text/icon |
| `--color-danger` | `#F08B8B` | Errors and out-of-stock status |

Typography: editorial serif (e.g. DM Serif Display) for campaign headings; Inter or an equivalent readable sans-serif for UI. Use self-hosted fonts when practical and provide fallbacks. Base body 16px, supporting text no smaller than 12px, clear type scale, line-height 1.45–1.65 for body text.

Spacing: 4px base scale; common values 8, 12, 16, 24, 32, 48, 64, 96px. Main content max width approximately 1280px. Most control/card radii 8–12px; larger radii reserved for hero artwork and major surfaces. Use subtle borders and lighting; avoid excessive glassmorphism, gradients, glow, or rounded-card repetition.

## Information architecture

1. Home/catalogue (`/`): compact sticky header, search, hero, curated collections, category filters, book grid, recommendations and footer.
2. Cart (`/cart`): line items, quantity controls, remove action, subtotal/shipping/tax/total as already implemented, clear checkout CTA, empty state.
3. Checkout (`/checkout`): delivery details, field-level validation, order summary, loading/disabled submit state and server error recovery.
4. Order success (`/order-success/:orderId`): order identifier, purchased items, totals, continue-shopping and order-history actions.
5. Orders (`/orders`): authenticated user's history, date/status/total and item snapshots, plus loading/empty/error states.
6. Authentication: retain existing auth modal and flows; style it consistently and make error states understandable.
7. Cart drawer: accessible slide-over that works on all pages and does not replace the full cart route.
8. Book quick view: accessible dialog showing cover, title, author, description, price, stock, wishlist and add-to-cart.

## Homepage layout

- Header: PETER wordmark, catalogue navigation, prominent search by title/author, wishlist entry, account entry, cart button with count.
- Hero: headline such as “Find your next chapter.”; short student-friendly supporting copy; primary CTA “Explore books”; secondary CTA “Browse collections”; one 3D hero book on a restrained dark stage.
- Discovery row: curated categories and concise filters. Preserve the existing category, sort, and in-stock filters.
- Featured books: consistent image ratios, title, author, price, stock state and one primary add-to-cart action. Quick-view and wishlist are secondary actions.
- Curated collections/recommendations: explain the collection with useful labels, not fabricated personalization claims.
- Footer: support/navigation, assessment documentation entry retained where needed, and credit “Last finish made by Jones JP”.

## 3D and motion

- One hero book only; use a reusable component. Prefer optimized GLB with React Three Fiber/Drei if the model is justified and the dependencies work with the current build. Otherwise use a CSS 3D layered book as a lighter fallback.
- Lazy-load the 3D module and model. Provide a poster/static cover fallback, handle WebGL failure, avoid blocking first paint, and use reduced/static treatment on small or low-power devices.
- GSAP: use for hero entrance and one controlled scroll-triggered reveal only. Scope and clean up timelines/ScrollTriggers on unmount and route changes.
- Lenis: optional smooth scrolling on long-form desktop views; preserve native scrolling and browser accessibility. Avoid competing with GSAP ScrollTrigger; integrate via a single documented ticker/RAF strategy. Disable or reduce on touch devices and when `prefers-reduced-motion` is enabled.
- Motion duration guidance: micro feedback 120–180ms; drawer/dialog 220–320ms; hero entrance 500–800ms; avoid perpetual motion except a very subtle optional float.
- Use transform/opacity where possible, avoid layout thrashing, maintain responsive interactions, and respect `prefers-reduced-motion`.

## Interactive features

- Wishlist: toggle with visible state; persist per signed-in user if a safe backend model/API is added. Until then, use local persistence only as an explicitly local feature and do not imply cross-device sync. Never change existing API contracts silently.
- Cart drawer: slide in from the right on desktop and as a full-height/bottom-sheet pattern on mobile. Lock background scroll, trap focus, close on Escape, return focus to trigger, announce cart updates, and keep quantities within server stock.
- Quick view: accessible modal/dialog with focus management and clear close behavior; reuse the same book data and API types as catalogue.
- Recommendations: deterministic curated rules based on existing category/title/author data; avoid claiming AI personalization unless actually implemented and disclosed.
- Toasts: success/error feedback with appropriate live-region semantics; don't rely on color alone.
- Search: debounce network requests, support Enter and clear, handle no results, loading, network failure and stale requests.
- Add to cart: loading/disabled state while request is in flight, handle unauthenticated users using existing auth flow, reflect server-confirmed stock and cart state.

## Accessibility and responsive behavior

- Keyboard navigation, visible focus, semantic buttons/links, labels for all fields, meaningful alt text, dialog focus management and screen-reader status announcements.
- WCAG AA contrast target for body text and interactive controls; status uses both icon/text and color.
- Touch targets ideally at least 44x44 CSS px.
- No horizontal overflow at 375, 390, 430, 768, 1024, 1280, 1440 and 1920px viewport widths.
- Mobile: stack hero content, use static/light 3D fallback, compact header with functional menu/search, two-column product grid when content allows, and full-screen cart drawer/quick view where appropriate.
- Tablet: reduce hero scale and grid columns; preserve clear filters and tap targets.
- Desktop: generous editorial spacing, restrained motion and a 3–5 column book grid depending on width.

## Performance

- Keep 3D and animation code out of the critical initial bundle where possible.
- Optimize/compress book images; use stable aspect ratios and lazy-load below-the-fold assets.
- Avoid unnecessary React state churn, duplicate requests and layout shifts.
- Target smooth 60fps animation on capable devices, but prefer no animation to jank.
- Ensure the app remains usable if WebGL, remote fonts or motion libraries fail.

## Quality gates

- Run existing TypeScript/lint and production build commands; add reliable test commands if missing.
- Verify register/login/demo flow, search by title and author, filters/sort, add/update/remove cart, refresh persistence, insufficient stock, checkout validation, order creation, stock changes, order history and logout/session behavior.
- Add tests for checkout failure after stock decrement and ensure inventory/order consistency; use MongoDB transactions where deployment supports them, otherwise implement and test complete compensation/rollback.
- Protect `POST /api/books/reset-seed` with admin authorization or disable it outside demo mode.
- Require a strong environment-provided JWT secret in production; never use a known fallback secret.
- Make in-memory MongoDB fallback explicit for local/demo only; production should fail clearly if persistent database is unavailable.
- Escape regex search input and cap query length; do not expose raw server exceptions to clients.
- Verify SPA deep links on deployment, environment variables, CORS, persistent database, HTTPS, and no secrets in client bundles.
- Confirm footer links, page titles, meta descriptions, favicon, custom 404, dynamic/current copyright year, and no horizontal scrolling.

## Credit

Footer or About area: “PETER Online Book Store” and “Last finish made by Jones JP”. Do not add personal contact details unless supplied.
