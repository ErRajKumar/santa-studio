# Santa Studio

> Make the season unforgettable.

Santa Studio is a 100% client-side, static Christmas invitation and greeting card design studio built with React, TypeScript, Vite, Tailwind CSS, HTML5 Canvas, and JSZip.

Every design is rendered directly in your browser at high resolution (up to 2400 × 3000 px)—with no backend, no database, no server uploads, and full compatibility with GitHub Pages.

## Features

- **20 Unique Card Designs**:
  - **10 Christmas Invitation Templates**: Classic Christmas Elegance, Midnight Christmas, Candy Cane Christmas, Christmas Neon Party, Rustic Christmas, Luxury Gold Christmas, Snowy Wonderland, Santa's Christmas Party, Minimal Nordic Christmas, and Christmas Ticket.
  - **10 Christmas Wishes Templates**: Traditional Merry Christmas, Elegant Gold Wishes, Snowfall Greetings, Christmas Lights, Santa Greetings, Luxury Minimal, Christmas Family, Cute Christmas, Midnight Starry Christmas, and Modern Editorial Christmas.
- **Dedicated Collections Homepage & Card Editor**: Clean separation between browsing (`index.html`) and personalising (`editor.html?type=invitation&template=invitation-04`).
- **Real-Time Canvas Rendering Engine**: Dynamic text wrapping, automatic omission of blank optional fields, custom font selection, color palettes, alignment options, and print-grade PNG export.
- **Private Client-Side Photo Upload & Cropping**: Drag-and-drop or mobile photo selection with zoom and horizontal/vertical repositioning. Photos never leave the browser.
- **Bulk ZIP Export**: Generate personalised cards for an entire list of guests or recipients (one name per line) with live progress and cancellation support, packaged into a single ZIP via JSZip.
- **Mobile-First Editing Workflow**: Preview-first mobile workspace with a full-screen customisation sheet and fixed safe-area action bar.
- **Offline & GitHub Pages Ready**: Locally bundled typography (`@fontsource`) and relative `./` Vite base configuration so all pages and assets resolve cleanly at root or under `/repo-name/`.

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start local development server (port 3000)
npm run dev

# 3. Type-check
npm run lint

# 4. Build production static bundle
npm run build

# 5. Preview production build locally
npm run preview
```

## Deploying to GitHub Pages

Santa Studio is pre-configured with `base: './'` in `vite.config.ts` and a multi-page build (`dist/index.html` and `dist/editor.html`), plus a GitHub Actions workflow at `.github/workflows/deploy.yml`.

1. Push this repository to GitHub (on the `main` branch).
2. In your GitHub repository, go to **Settings → Pages**.
3. Under **Build and deployment → Source**, select **GitHub Actions**.
4. Every push to `main` (or manual dispatch in the **Actions** tab) will run `npm ci && npm run build` and publish `./dist` to GitHub Pages.

Both `https://<username>.github.io/<repo>/` and `https://<username>.github.io/<repo>/editor.html?type=invitation&template=invitation-04` will load and refresh cleanly with zero 404 errors.
