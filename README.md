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

- `src/main.js`: collection data, section content, social links, filtering, navigation, and inquiry dialogs.
- `src/style.css`: responsive layouts, palette variables, typography, and reduced-motion support.
- `index.html`: page title, description, and metadata.
- `public/favicon.svg`: brand favicon.

Collection names and prices are demonstration content, clearly labeled on the page. Replace them with approved inventory before commercial use. Editorial placeholder photographs load from Unsplash and fonts from Google Fonts; an internet connection is required for those assets. Replace image URLs with local licensed product photographs when available.

Consultation, product, and apprenticeship forms use native browser validation and open a prefilled WhatsApp message to +2348169824380. Visitors must send the message in WhatsApp themselves. No backend, payment processing, enrollment submission, or personal-data storage is included.

Validation: `npm run build` and `node --check src/main.js` pass. Browser automation is not installed in this workspace.

## Brand assets and formatting

The header and footer display `public/TBB_LOGO.jpg`. `public/favicon.svg` embeds the original logo and frames its circular emblem without altering the JPG.

Run `npm run format` to keep source code in readable, indented blocks, or `npm run format:check` to verify formatting.

## Featured-work gallery

Edit `src/gallery.js` to update the lookbook titles, categories, and photographs. The initial gallery uses clearly labeled editorial placeholders, not verified TBB Couture work. Gallery previews support previous/next buttons, arrow keys, Escape, and backdrop dismissal.
