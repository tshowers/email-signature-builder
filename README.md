<p align="center">
  <img src="docs/email-signature-banner.png" alt="Email Signature Builder" width="100%">
</p>

# Email Signature Builder

A free, no-account-required tool for building a polished HTML email signature — pick a template, add your logo, and copy or download the HTML. Built by [Taliferro Tech](https://taliferro.com) as part of the [16Ahead](https://app.16ahead.com) product family.

**Live:** [signature.16ahead.com](https://signature.16ahead.com)

## Features

- Five signature templates (Clean, Centered, Sidebar, Minimal, Spotlight) with a live preview
- Custom accent colors and an optional call-to-action button
- Logo upload with hosted delivery (drag-and-drop or browse, PNG/JPG/WEBP/GIF/SVG up to 2MB)
- Copy-to-clipboard or download-as-HTML
- Step-by-step install guides for Gmail, Outlook, Apple Mail, and Yahoo Mail
- Help and About pages, light/dark mode

## Tech stack

- Angular 19, standalone components, with the router serving `/`, `/help`, `/about` and a catch-all 404
- Build-time prerendering (`"prerender": true` in [angular.json](angular.json)): each route is written out as static HTML for SEO, and Firebase Hosting serves those files. There is no Node server in production.
- Shared look and components come from [`@taliferro/ui`](https://github.com/tshowers/taliferro-ui) (see below)
- Hosted on Firebase Hosting

## Prerequisites

- **Node.js 22** (developed on 22.13.1) and npm
- **Git access** to both `tshowers/email-signature-builder` and `tshowers/taliferro-ui`
- **Chrome**, for `npm run test:ci` (Karma runs headless Chrome)
- **Firebase CLI** (`npm i -g firebase-tools`), only if you deploy, logged in to an account with access to the `taliferrotech` project

You don't need to install the Angular CLI globally. The npm scripts use the local copy.

## Setting up your machine

`package.json` points to the shared UI package by relative path (`"@taliferro/ui": "file:../../taliferro-ui"`), so **you need both repos, laid out like this, before `npm install` will work**:

```
<workspace>/
├── taliferro-ui/
└── web-products/
    └── email-signature-builder/
```

```bash
mkdir -p ~/taliferro/web-products && cd ~/taliferro
git clone https://github.com/tshowers/taliferro-ui.git
git clone git@github.com:tshowers/email-signature-builder.git web-products/email-signature-builder

cd web-products/email-signature-builder
npm install
npm start
```

Then open `http://localhost:4200`.

## Configuration, APIs and environment variables

**You don't need any environment variables, API keys or `.env` file.**

The only setting is `backendURL` in [src/environments/](src/environments/). Production builds swap `environment.ts` for `environment.prod.ts`. Both currently point to the production Taliferro Tech API:

| Setting | Value |
|---|---|
| `backendURL` | `https://api.taliferro.tech/api` |

The app makes one API call:

- `POST {backendURL}/public/signature-assets` with body `{ fileName, dataUrl }`, which returns `{ assetUrl }`. It hosts an uploaded logo so the exported signature can link to it. The endpoint is public (no auth), and the API accepts requests from `http://localhost:4200`. **Local development therefore uploads to the production backend.**
- If the upload fails, the app still works: the logo stays local and the user sees a message saying hosted delivery was unavailable.

Other external services:

- **Google Analytics 4** (`G-BR0EFKQV8V`), set up in [src/index.html](src/index.html). It's turned off on `localhost`, `127.0.0.1` and `[::1]`, so local runs don't show up in analytics.

## Scripts

| Command | What it does |
|---|---|
| `npm start` | Dev server on port 4200 |
| `npm run build` | Production build plus prerender, output to `dist/email-signature-builder/browser`. **Also bumps the version** (see below). |
| `npm run watch` | Development build in watch mode |
| `npm test` | Unit tests (Karma and Jasmine) in watch mode |
| `npm run test:ci` | Unit tests run once in headless Chrome |
| `npm run typecheck` | TypeScript check with no output files |

**Version bump:** `prebuild` runs [scripts/update-build-version.mjs](scripts/update-build-version.mjs). It rewrites `version` in `package.json` and `public/assets/version.json` as `YYYY.M.D-build.N`, where N goes up for each build on the same day. Every build changes those two files, so don't be surprised to see them in `git status`.

## Project layout

```
src/app/
├── signature-builder/   the builder (home page, "/")
├── features/            help, about, not-found pages
├── shared/              components synced from taliferro-ui (don't edit here)
└── services/
public/                  robots.txt, sitemap.xml, brand images, favicons
scripts/                 build version bump
deploy.sh                production deploy
```

## Shared UI (taliferro-ui)

The product family shares one look and a set of common components:

- **Styles:** [src/styles.css](src/styles.css) imports tokens, controls, the universal menu, the footer and the product-page styles from `@taliferro/ui/styles/*`. To pick up changes to these, edit them in `taliferro-ui` and rebuild.
- **Components:** the files in `src/app/shared/` (platform menu, site footer, product pages, also-from-us) are **copied in** from `taliferro-ui` and start with a `SYNCED FROM` comment. Make changes in `taliferro-ui`, then run that component's `sync.sh` (for example `taliferro-ui/menu-component/sync.sh`). It copies the files into every product, including this one. Each app's own `*.config.ts` files are never overwritten.

The family-wide conventions are written up in `taliferro-ui/PRODUCT-STANDARD.md`.

## SEO

- [src/index.html](src/index.html) holds the default title, description, canonical, Open Graph and Twitter tags for `/`.
- The Help and About pages set their own title, description, canonical and `og:url` (About also adds JSON-LD). The prerender step writes them into `help/index.html` and `about/index.html`.
- The 404 page sets `noindex`, so unknown URLs aren't indexed even though Firebase serves them with a 200.
- URLs have no trailing slash (`"trailingSlash": false` in [firebase.json](firebase.json)). Canonicals and the sitemap match.
- **When you add a public route,** also add it to [public/sitemap.xml](public/sitemap.xml), give it its own title, description and canonical, and check that it shows up in `dist/email-signature-builder/prerendered-routes.json` after a build.

## Deploy

Hosted on Firebase (site `taliferro-email-signature-builder`, project `taliferrotech`). Deploy with:

```bash
./deploy.sh
```

The script:

1. selects the `taliferrotech` Firebase project
2. runs `npm run build` (which bumps the version), `npm run test:ci` and `npm run typecheck`, and stops if any of them fails
3. **commits every change in the working tree** as `Deploy: v<version>`, so make sure the tree holds only what you mean to ship
4. runs `firebase deploy --only hosting:taliferro-email-signature-builder`

The script doesn't push to GitHub, so push the commit afterwards.
