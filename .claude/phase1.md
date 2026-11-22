Read AGENTS.md first. Implement Phase 1 of the Fashion for Change website in this repository.

This is an iterative build with a 24-hour deadline. Focus on a usable, reusable website shell and navigation. Leave content writing and detailed visual design for Phase 2.

Inspect the existing Astro starter, assets, installed versions, and scripts before editing. Give a brief implementation plan, then proceed. Preserve unrelated work and existing assets. Work directly without subagents to conserve usage.

SCOPE

1. Shared layout and navigation

Create a shared header, footer, and page layout.

Center the desktop navigation group horizontally. The FC logo links to https://linktr.ee/fashionforchange.

Top-level navigation:
- About: link to /about
- Gallery: dropdown button
- Blog: link to /blog
- Our Team: dropdown button

Gallery dropdown:
- Show Day → /gallery/show-day
- Team Photoshoots → /gallery/team-photoshoots
- Holiday Market → /gallery/holiday-market

Our Team dropdown:
- 2026–2027 → /team/2026-2027
- 2025–2026 → /team/2025-2026
- Before 2025 → /team/before-2025

These are separate page destinations, not in-page tabs. No default gallery or team-year selection is needed. Gallery and Our Team are disclosure buttons, not links to additional landing pages.

Use one typed navigation definition for desktop and mobile. Keep route files thin and reuse layouts for related pages. Avoid an elaborate generic menu framework.

2. Navigation interactions

Use semantic navigation with disclosure buttons and ordinary links; do not use application-style ARIA menu roles.

Desktop:
- Dropdowns open on hover and can also be toggled by click.
- Moving the pointer from the trigger into its submenu must not close it.
- Only one dropdown is open at a time.
- Clicking outside or pressing Escape closes it.
- Escape returns focus to the controlling button.
- Moving keyboard focus outside the navigation closes open dropdowns.
- Closed dropdown links must not remain keyboard-focusable.

Keyboard:
- Enter/Space toggles disclosure buttons.
- Tab moves through visible controls and links in logical order.
- Expose accurate aria-expanded and aria-controls attributes.
- Provide visible focus and aria-current on the active page link.
- Do not close a submenu while keyboard focus remains inside it.

Mobile/touch:
- A labeled menu toggle reveals the navigation.
- Gallery and Our Team expand by tap.
- Navigation must work without hover, overflow, or tiny touch targets.
- Closing a menu containing keyboard focus restores focus appropriately.
- Choosing a destination closes the navigation.

3. Routes and content

Home (/):
- Separate from About.
- Future direction: a theatre-style, impactful landing page with a prominent title, imagery, a sponsor carousel, and a charity carousel.
- Phase 1: create a restrained title area and clearly separated empty-state sections for future gallery, sponsor, and charity content.
- Do not implement carousels, autoplay, elaborate animation, or generate imagery yet.
- Do not treat imported logos as confirmed sponsors or charities. Leave relationships and ordering TBD.
- Include a Join FC link.

About (/about):
- Leave the entire About content TBD.
- Render an About heading and a simple “Content coming soon.” empty state.
- Do not draft a mission statement, club history, or other About copy.

Gallery pages:
- Use the corresponding title in title case.
- Reuse a gallery page layout.
- Leave photography, captions, dates, and descriptions TBD.
- Display an intentional empty state rather than invented content or broken images.

Blog (/blog):
- Render a Blog heading and “Stories coming soon.”
- No blog engine, sample posts, or CMS in this phase.

Team pages:
- Reuse a team page layout.
- Member names, roles, photos, and biographies remain TBD.
- Do not fabricate profiles.
- On /team/before-2025, display this exact message:
  “Fashion for Change began in 2016. Our digital archive is just getting started, and we’re adding earlier teams and memories over time.”
- Record the founding year as owner-supplied and awaiting confirmation before public release. Do not change the requested message.

4. Links, assets, and styling

- Define https://linktr.ee/fashionforchange once in shared site configuration.
- All external calls to action use this destination for now.
- Internal navigation uses the actual internal routes.
- Use Newsreader as the primary editorial font with an appropriate fallback.
- Use existing FC logo assets (src/assets/fc), preserve their proportions, and choose a variant with readable contrast.
- Preserve all original imported assets.
- Use a neutral palette and shared typography, spacing, and color tokens. Final colors remain TBD.
- Prioritize hierarchy, readability, responsive layout, and accessibility.
- No custom illustrations, generated assets, or decorative effects in this phase.
- Include semantic landmarks, a skip link, descriptive page titles, and one primary heading per page.

5. Starter cleanup

Replace starter branding and demo navigation. Inspect references before removing unused demo pages, components, and dependencies.

Remove src/assets/corgi.jpg and its instances.

Keep local Netlify Edge Function emulation disabled. Inspect any example Edge Function before removing it so deployment behavior is understood.

Do not expand this task into an infrastructure migration. No database, authentication, CMS, MCP setup, analytics, or framework major upgrades.

6. Verification

Inspect existing scripts before adding commands.

- Enable strict TypeScript while retaining required Astro/React configuration.
- Add explicit Astro/TypeScript checking; a build alone is insufficient.
- Add a small Playwright suite against the production build.
- Cover:
  - Direct loading of every requested route.
  - Desktop dropdown hover and click behavior.
  - Keyboard opening, link navigation, Escape, and focus restoration.
  - Mobile menu and nested disclosure behavior.
  - Active-page indication.
  - Join FC pointing to the expected Linktree URL.
  - The exact archive message.
- Use accessible roles and names in tests.
- Assert expected destinations independently of the navigation configuration.
- Do not navigate to live external services.
- Do not add unit tests merely to repeat static configuration.
- Provide npm run verify to run checking, production build, and browser tests.
- Run verification and report actual results or precise blockers.
- Check mobile and desktop rendering if browser inspection is available; otherwise clearly identify manual checks still needed.

7. Handoff

Update README with:
- Actual setup and verification commands.
- Where navigation and site configuration live.
- How related pages share layouts.
- How future content can be added.
- A short Phase 2 list: content, imagery, confirmed sponsors/charities, carousels, and final visual direction.

Keep AGENTS.md focused on durable coding conventions. Do not put this feature plan or FC-specific content into it.

Make reasonable, reversible implementation choices without repeatedly asking for confirmation. Preserve TBD decisions instead of inventing answers. Ask only if something blocks correct implementation.

Finish with a concise summary of changes, checks performed, remaining limitations, and manual review needed. Do not commit, push, or deploy.