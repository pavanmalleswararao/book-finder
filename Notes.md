Book Finder — Notes (requirements + updates)
Purpose

A responsive web app to discover, search, view.

Core requirements (summary)

Search: title, author, keywords; fuzzy/partial matching.

Results UX: pagination or infinite scroll; clear empty / error states.

Book detail: cover, authors, related books.

Integrations (optional): Open Library for metadata.

APIs: REST endpoints for search, book details.

Data models: Book, User.

Non-functional requirements

Responsive (mobile-first), accessible (semantic HTML, alt text, keyboard nav).

Secure (HTTPS).

Performant (lazy-load images, code-splitting).

Scalable & maintainable (clear component structure, documented API).

Tested & deployable (unit test, frontend on Netlify/Vercel).

Concrete updates (what was likely added)

Added search (partial matches).

Added pagination or infinite scroll for results.

Enhanced book detail page (full metadata, related books).

Added recently viewed (localStorage).

Performance: lazy-loaded book covers and code-splitting.

UI polish: responsive grid, improved spacing, mobile fixes.

Deployment: Netlify-friendly routing (_redirects or netlify.toml) added.

Optional: Open Library for missing metadata.

Tests/CI: added basic unit tests and GitHub Actions (if present).

Quick verification checklist (one-line checks)

Search works: type partial title → suggestions appear.

Pagination: scroll to load more.

Book detail shows metadata.

Recently viewed updates after opening a book.

Images lazy-load; initial bundle size reduced.

Direct links to client routes serve index (check _redirects).

External metadata fetched (inspect network calls).

Short changelog template (copy & paste)

vX.Y.Z — YYYY-MM-DD

Feature: Search(src/components/SearchBar).

Feature: recently viewed (src/components/RecentlyViewed).

Perf: Lazy-loaded covers (src/components/BookCard).

Deploy: Added Netlify _redirects.