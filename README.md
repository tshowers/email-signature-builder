<p align="center">
  <img src="docs/email-signature-banner.png" alt="Email Signature Builder" width="100%">
</p>

# Email Signature Builder

A free, no-account-required tool for building a polished HTML email signature — pick a template, add your logo, and copy or download the HTML. Built by [Taliferro Tech](https://taliferro.com) as part of the [TODD](https://todd.taliferro.tech) product family.

**Live:** [signature.taliferro.tech](https://signature.taliferro.tech)

## Features

- Five signature templates (Clean, Centered, Sidebar, Minimal, Spotlight) with a live preview
- Custom accent colors and an optional call-to-action button
- Logo upload with hosted delivery (drag-and-drop or browse, PNG/JPG/WEBP/GIF/SVG up to 2MB)
- Copy-to-clipboard or download-as-HTML
- Step-by-step install guides for Gmail, Outlook, Apple Mail, and Yahoo Mail
- Light/dark mode support

## Tech stack

Angular 19 (standalone components, no router — single page). No login, no database on the client side; the only network call is to the existing Taliferro Tech backend for logo hosting (`POST /public/signature-assets`).

## Local development

```bash
npm install
ng serve
```

Then open `http://localhost:4200` (or whichever port you pass to `ng serve --port`).

## Build

```bash
ng build
```

Output goes to `dist/email-signature-builder/browser`.

## Deploy

Hosted on Firebase (site `taliferro-email-signature-builder`, project `taliferrotech`):

```bash
ng build
firebase deploy --only hosting
```

## Tests

```bash
ng test
```
