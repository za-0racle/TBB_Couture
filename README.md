# TBB Couture

A responsive, single-page Vite website built with semantic HTML, custom CSS, and native JavaScript. No UI framework.

## Run locally

```sh
npm install
npm run dev
```

## Production

```sh
npm run build
npm run preview
```

Deploy the generated `dist` directory to any static host.

## Customize

- `src/main.js`: public/admin entry point.
- `src/storefront.js`: public sections, filtering, live catalog loading, and inquiries.
- `src/admin.js` and `src/admin.css`: admin login, dashboard, and editors.
- `src/backend.js`: authentication, database, and storage connection.
- `supabase/schema.sql`: database schema and access policies.
- `src/style.css`: responsive layouts, palette variables, typography, and reduced-motion support.
- `index.html`: page title, description, and metadata.
- `public/favicon.svg`: brand favicon.

Collection names and prices are demonstration content, clearly labeled on the page. Replace them with approved inventory before commercial use. Editorial placeholder photographs load from Unsplash and fonts from Google Fonts; an internet connection is required for those assets. Replace image URLs with local licensed product photographs when available.

Consultation, product, and Learning Center forms use native browser validation and open a prefilled WhatsApp message to +2348164835306. The marketplace cart supports adding items, adjusting quantities, removing selections, and sending an order summary to the same WhatsApp number. Contact links also open WhatsApp. Visitors must send messages themselves; public inquiries and cart contents are not stored. Admin authentication, catalog content, and images use Supabase when configured. Payment processing and enrollment submission are not included.

Validation: `npm run build` and `node --check src/main.js` pass. Browser automation is not installed in this workspace.

## Brand assets and formatting

The header and footer display `public/TBB_LOGO.jpg`. `public/favicon.svg` embeds the original logo and frames its circular emblem without altering the JPG.

Run `npm run format` to keep source code in readable, indented blocks, or `npm run format:check` to verify formatting.

## Featured-work gallery

When Supabase is connected, manage gallery works and sale items at `/admin`. Without configuration, `src/gallery.js` provides demo lookbook data. The initial gallery uses clearly labeled editorial placeholders, not verified TBB Couture work. Gallery previews support previous/next buttons, arrow keys, Escape, and backdrop dismissal.

## Admin workspace

Visit `/admin` to manage gallery works and sale items. Follow [ADMIN_SETUP.md](./ADMIN_SETUP.md) to configure Supabase Auth, database policies, storage, and Vercel environment variables. Without that setup, admin uploads are unavailable. Run `npm test` for validation and API contract checks; the latter use mocked HTTP responses rather than a live Supabase project.
