Book Finder — Notes (requirements + updates)
Purpose

A responsive web app to discover, search, filter, view, and save books; optional purchase/borrow flows and admin management.

Core requirements (summary)

Search: title, author, ISBN, keywords; autocomplete / suggestions; fuzzy/partial matching.

Filters & Sort: genre, language, year range, price range, rating, availability; sort by relevance, newest, price, rating.

Results UX: pagination or infinite scroll; clear empty / error states.

Book detail: cover, authors, publisher, ISBN(s), year, description, formats, price/availability, sample/excerpt, ratings & reviews, related books.

User accounts: signup/login (email + password), password reset (social login optional).

User features: wishlist/favorites, recently viewed, post/edit/delete reviews, view order/history (if selling).

Admin panel: add/edit/delete books, bulk import (CSV/JSON), manage categories, moderate reviews/users.

Integrations (optional): Google Books / Open Library for metadata; Stripe/PayPal for payments.

APIs: REST endpoints for search, book details, auth, wishlist, reviews, admin.

Data models: Book, User, Review, Wishlist, Order (fields: title, authors[], isbn[], genres[], cover_url, price, stock, rating, timestamps).

Non-functional requirements

Responsive (mobile-first), accessible (semantic HTML, alt text, keyboard nav).

Secure (HTTPS, hashed passwords, input validation).

Performant (lazy-load images, code-splitting, server-side paging).

Scalable & maintainable (DB indexes, clear component structure, documented API).

Tested & deployable (unit/integration tests, CI/CD; frontend on Netlify/Vercel, backend on Render/AWS).

Concrete updates (what was likely added) — copy-ready bullets

Added search + autocomplete (partial matches, debounce).

Implemented filters & sorting (genre, year, price, rating).

Added pagination or infinite scroll for results.

Enhanced book detail page (full metadata, related books, wishlist CTA).

Implemented auth (signup/login) and wishlist persistence.

Added recently viewed (localStorage or backend).

Added reviews & ratings (create/edit/delete by owner).

Performance: lazy-loaded book covers and code-splitting.

UI polish: responsive grid, improved spacing, mobile fixes.

Deployment: Netlify-friendly routing (_redirects or netlify.toml) added.

Optional: integrated Google Books / Open Library for missing metadata.

Tests/CI: added basic unit tests and GitHub Actions (if present).

Quick verification checklist (one-line checks)

Search works: type partial title → suggestions appear.

Filters apply: choose genre/year → results update.

Pagination: move to next page or scroll to load more.

Book detail shows metadata + Add to wishlist.

Wishlist persists after reload (login required if implemented).

Recently viewed updates after opening a book.

Reviews can be added/edited/deleted by the author.

Images lazy-load; initial bundle size reduced.

Direct links to client routes serve index (check _redirects).

External metadata fetched for unknown ISBNs (inspect network calls).

Short changelog template (copy & paste)

vX.Y.Z — YYYY-MM-DD

Feature: Search + autocomplete (src/components/SearchBar, src/hooks/useDebounce).

Feature: Filters by genre/year/price (src/components/Filters).

Feature: Wishlist & recently viewed (src/components/Wishlist, src/components/RecentlyViewed).

Perf: Lazy-loaded covers (src/components/BookCard).

Deploy: Added Netlify _redirects.