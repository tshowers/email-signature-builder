# Changelog

All notable changes to this project are documented here.

## 2026-08-29

### Added
- Extracted from the `taliferrotech` monorepo (`frontend/src/app/features/email/pages/email-signature-builder`) into its own standalone Angular 19 app — five signature templates, logo upload, copy/download HTML, and platform install guides for Gmail, Outlook, Apple Mail, and Yahoo Mail.
- Vendored TODD's global `.form-control`/`.form-select` field styling so the form matches TODD's look without pulling in Bootstrap.
- Branding, SEO, and social meta tags: favicon, description, canonical URL, Open Graph and Twitter Card tags.
- Footer matching TODD's site-wide footer (copyright, "Site design Taliferro Group" credit, patent notice) plus a working Contact link to `taliferro.com/contact.html`.
- README with product banner, feature list, and local dev/build/deploy instructions.
- Firebase Hosting config for the `taliferro-email-signature-builder` site (project `taliferrotech`), live at [signature.taliferro.tech](https://signature.taliferro.tech).

### Removed
- The TODD-login "save to profile" feature (`AuthService`/`UserService`/Firebase) — dropped as out of scope for a standalone public tool. This also removed the `firebase`/`@angular/fire` dependency entirely; the app is now 100% client-side aside from the logo-hosting API call.

### Backend
- Still calls the existing `todd-backend` endpoints (`POST /public/signature-assets`, `GET /signature-assets/:assetId`) for logo upload/hosting — no backend code was duplicated. Added `signature.taliferro.tech` and the Firebase-provided `.web.app`/`.firebaseapp.com` origins to `todd-backend/functions/index.js`'s CORS allowlist and deployed that change to production (`functions[api]`).
