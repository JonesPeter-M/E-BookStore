# Google AI Studio Build Mode — Master Prompt

You are a senior product designer and senior full-stack engineer. Upgrade the existing repository into **PETER Online Book Store**, a premium, dark, editorial online bookstore for students. Implementation credit: **Last finish made by Jones JP**.

## First: inspect, then modify

Read the entire existing repository before changing files. Summarize the current architecture, API contracts, routes, state management, environment variables, scripts, and tests. The current stack includes React 19 + TypeScript + Vite, Tailwind CSS v4, React Router DOM v7, Axios, AuthContext, CartContext, Node/Express, MongoDB/Mongoose, JWT and bcrypt. Preserve this stack and the existing real backend. Do not rebuild the site as a disconnected frontend mock, do not replace database-backed features with static arrays, and do not remove assessment documentation unless there is an equivalent retained path.

Use `DESIGN.md` and `ui-spec.yaml` as the source of truth. If the repository differs from the expected description, inspect and adapt rather than assuming files exist. Make small, coherent changes and keep the app buildable after each phase.

## Visual direction

Create a premium “Night Library” visual system: background #111318, surface #191C24, elevated surface #292D38, lavender accent #B9A4FF, warm accent #E7AE68, primary text #F4F1EA, muted text #B5B7C2 and border #343844. Use an editorial serif for hero headings and a clean sans-serif for UI. Strong hierarchy, precise spacing, restrained borders, clear prices and book covers. Avoid generic AI layouts, excess gradients, glassmorphism, permanent neon glow, decorative clutter and repetitive oversized rounded cards.

## Required screens and functionality

1. Homepage/catalogue: clear header with PETER wordmark, search by title or author, account, wishlist and cart count; 3D hero with a direct “Explore books” CTA; curated collections; existing categories, sorting, stock filters; responsive catalogue grid.
2. Book cards: cover, title, author, price, accurate stock state, add-to-cart, wishlist and quick-view affordance.
3. Accessible quick-view dialog using real catalogue data.
4. Wishlist with visible selected state. Persist per signed-in user only if safely supported by backend changes; otherwise clearly scope persistence locally and do not imply cross-device sync.
5. Accessible slide-out cart drawer, with server-backed quantities, stock limits, subtotal and checkout action. Preserve the full `/cart` page.
6. Checkout with accessible field-level validation, loading/disabled submit, order summary, server errors and recovery.
7. Order success and authenticated order history using the existing API and persisted order snapshots.
8. Existing authentication flows and assessment documentation remain functional and are visually restyled.

Every major screen must include loading, empty, error and success states as relevant. Maintain real API calls, authentication, server-authoritative prices, stock validation, checkout and order history.

## 3D and motion

Use exactly one primary 3D book in the hero. Prefer a lazy-loaded GLB using React Three Fiber/Drei if compatible and performance-appropriate; otherwise build a polished CSS 3D layered-book fallback. Provide static fallback for WebGL failure and constrained/mobile devices. Do not block first content paint.

Use GSAP for a restrained hero entrance and at most one purposeful scroll reveal. Clean up animations and ScrollTriggers on unmount/navigation. Add Lenis only if it works cleanly with the current Vite/React setup; integrate it with GSAP using one documented ticker/RAF strategy, not competing loops. Preserve native scroll behavior and disable/reduce motion for touch devices and `prefers-reduced-motion`. Integrate selected React Bits components individually only after reviewing source, dependency impact, accessibility and performance; do not install a large library blindly. Avoid animation that hides content or reduces usability.

## Engineering constraints

- Keep the existing route and API contracts unless a documented, tested change is necessary.
- Reuse existing components, contexts, API client and TypeScript types when appropriate.
- Do not introduce duplicate state sources for cart or authentication.
- Prevent stale search responses and debounce network search.
- Ensure focus management, keyboard navigation, 44x44px target guidance, WCAG AA contrast target and semantic HTML.
- Escape regex search input and limit query length.
- Fix the public stock-reset endpoint: protect it with admin authorization or disable outside demo mode.
- Remove hard-coded JWT secret fallback in production; require a strong secret from server-side environment configuration.
- Make in-memory MongoDB fallback explicit for demo/local development; use persistent MongoDB in production.
- Fix checkout consistency: if order persistence fails after stock decrement, ensure rollback/compensation; prefer MongoDB transactions where supported and test the actual deployment topology.
- Never expose raw internal exception messages to clients.
- Never put secrets in client-side code or source control.

## Quality gates

Run the existing type-check/lint and production build scripts; run tests and add API-level integration tests for registration/login, unauthorized access, catalogue search, cart boundaries, stock races, checkout success/failure, order history and session isolation. Fix errors rather than claiming success without evidence.

Test widths 375, 390, 430, 768, 1024, 1280, 1440 and 1920px. Check no horizontal overflow, working mobile menu, image aspect ratios, keyboard/focus behavior, reduced-motion behavior, empty/error/loading states, footer links, page titles, meta descriptions, favicon, custom 404 and current copyright year.

## Google AI Studio and deployment

If this repository was imported from GitHub, preserve its existing structure. Before deploying, explain which parts AI Studio Build Mode is hosting and how the Express server and MongoDB connect. Verify whether the current imported project can run its existing Vite/Express entrypoint in AI Studio's runtime; do not silently replace it with AI Studio's generated architecture. Keep persistent MongoDB external if needed and configure connection strings, JWT secret, CORS and production API URL using server-side secrets/environment variables. Test direct-route refreshes, authentication, database persistence and production build. Only report deployment success after a live deployment and verification actually complete.

## Working method and final report

Proceed in phases: (1) audit and plan, (2) design tokens and shell, (3) catalogue and hero, (4) cart/wishlist/quick view, (5) checkout/orders, (6) accessibility/performance/security, (7) tests and deployment readiness. Do not delete working features to simplify implementation. At the end, report changed files, added dependencies, tests/build commands and their actual results, known limitations, required environment variables and exact deployment steps. Do not fabricate test results, URLs or deployment success.
