# Fashion for Change

Website for Fashion for Change (FC), a University of Waterloo club. Built with Astro, TypeScript, and Tailwind CSS, deployed on Netlify.

This is Phase 1: a reusable site shell with navigation and routing. Content, imagery, and final visual direction are intentionally left as TBD empty states — see **Phase 2** below.

## Setup

```
npm ci
npm run dev
```

Dev server runs at `http://localhost:4321`.

## Verification

```
npm run check     # Astro + TypeScript diagnostics (strict)
npm run build     # production build to ./dist/
npm run test:e2e  # Playwright suite against the production build
npm run verify    # runs all three, in order
```

`npm run preview` serves the production build with a small static file
server (`scripts/static-server.mjs`), not `astro preview` — the
`@astrojs/netlify` adapter doesn't support that command locally (it has no
preview entrypoint; use `netlify dev` instead if you need full Netlify
platform emulation). Run `npm run build` first.

Playwright tests boot that same static server automatically
(`playwright.config.ts`); `npm run test:e2e` on its own expects a prior
`npm run build`.

## Where things live

- **Site-wide facts**: `src/config/site.ts`.
- **Navigation**: `src/config/navigation.ts` — one typed list (links and
  disclosure groups) driving both the desktop and mobile markup in
  `src/components/Header.astro`. Add a route here to add it to the menu.
- **Nav interaction behavior**: `src/scripts/navigation.ts` — vanilla
  TypeScript (disclosure buttons + hover-intent, no ARIA menu roles, no
  framework). Imported by `Header.astro`.
- **Shared chrome**: `src/layouts/Layout.astro` (skip link, landmarks,
  header/footer, Newsreader font). `src/components/Header.astro` and
  `Footer.astro`.

## How related pages share layouts

- `src/layouts/GalleryLayout.astro` — takes a `title`; used by all three
  `/gallery/*` pages. Route files are a single line each.
- `src/layouts/TeamLayout.astro` — takes a `title` and an optional
  `message` override (used by `/team/before-2025` for its exact archive
  message); used by all three `/team/*` pages.
- `/about` and `/blog` are simple enough to use `Layout.astro` directly.

To add a new gallery or team page: add the route to
`src/config/navigation.ts`, then create a one-line `.astro` file under
`src/pages/gallery/` or `src/pages/team/` using the matching layout.

## Adding real content later

Every placeholder page ("Content coming soon.", "TBD" gallery/team copy)
is intentional, not a bug — swap it for real copy/images in place when
it's ready. No CMS or content collection is wired up yet; see Phase 2.

## Phase 2 (not in this phase)

- Real content for Home, About, Blog, galleries, and team pages.
- Photography and other imagery.
- Confirmed sponsors and charities (and their display order).
- Home page carousels (sponsor, charity) and theatre-style visual design.
- Final color palette (current palette is a neutral placeholder).
- Confirmation of the founding year used in the `/team/before-2025` message.

## Partner logo bands

Organization names, optional external URLs, logo imports, and visible artwork bounds live in
`src/data/partners.ts`. `LogoMarquee.astro` accepts a unique `id`, `heading`,
`items`, `direction` (`left`/`right`), `duration` in seconds per cycle, and
`tone` (`dark`/`cool`/`warm`). Original logo files are preserved; `PartnerLogo.astro`
uses an SVG viewport to exclude export whitespace and build-optimized images.

Track motion continues on mouse hover and pauses offscreen or when the document is hidden. Keyboard focus presents a static set of links. Reduced-motion preferences
and JavaScript-free browsing show each organization once in a static layout.
Visual repetitions are hidden from screen readers.

Linked logos open in a new tab. Keyboard focus presents a static set of original logos; visual loop copies are clickable but excluded from the tab order and accessibility tree.

Logo cards use a separate 3D surface inside each moving track slot. Fine mouse
pointers apply a maximum 3-degree inverse tilt and a warm highlight. Only the
active card runs a requestAnimationFrame loop; touch and reduced-motion users
get flat cards. No WebGL or animation dependency is required.

## Cursor trail

`CursorTrail.astro` adds one decorative, click-through canvas through the shared
layout. `src/config/cursor.ts` holds the sampled FC blue (#8CCAFB), tone palettes,
and trail limits. Add `data-cursor-tone="dark"`, `"light"`, or `"photo"` to a
section to select its treatment; the nearest annotation wins. The native mouse cursor is hidden only after the glow has been painted, and
restored when the effect clears or is disabled. The glow is aligned to the actual
click location. Fine mouse pointers get at most 20 fading trail points; the
render loop stops when idle, on window blur, or when the page is hidden. Touch
and reduced-motion users get no overlay. No dependencies were added.
