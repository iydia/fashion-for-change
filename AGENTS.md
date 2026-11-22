# Project

Astro, TypeScript, Tailwind CSS, npm.
Use package.json and package-lock.json as the source of truth
for installed versions and available scripts.

## Commands

- npm ci: install dependencies from the committed lockfile.
- npm run dev: start the local development server.
- npm run build: generate the production build.
- npm run preview: serve the latest production build locally
  (plain static server; the Netlify adapter does not support `astro preview`).
- npm run check: run Astro/TypeScript diagnostics.
- npm run test:e2e: run the Playwright suite against a production build.
- npm run verify: run check, build, and test:e2e in sequence.

Inspect package.json before running additional commands.
Do not assume lint, typecheck, or test scripts exist.
Document new verification commands when adding them.

## Architecture

- Prefer static Astro components.
- Hydrate client islands only when interaction requires it.
- Keep route files focused on page composition and data loading.
- Reuse layouts and components for shared structure and behavior.
- Extract components when reuse or a distinct responsibility
  improves clarity; avoid speculative abstractions.
- Keep shared configuration and content separate from presentation.
- Define shared facts and business rules once.
- Follow the installed Astro version's content-collection conventions
  when implementing structured content.

## Types and validation

- Use strict TypeScript for new code.
- Avoid new any types and unchecked type assertions.
- Narrow unknown values at external boundaries.
- Validate external data with schemas where appropriate.
- Infer types from schemas rather than duplicating definitions.
- Derive values instead of storing redundant state.

## Styling and accessibility

- Use Tailwind utilities and shared design tokens.
- Preserve asset proportions and provide appropriate alternative text.
- Use semantic HTML, native controls, and descriptive link text.
- Support keyboard navigation, visible focus, and reduced motion.
- Check affected layouts at mobile and desktop widths.

## Project terminology

- Glossary of abbreviations: src/data/glossary.json.

## Verification

- Run relevant checks and the production build after changes.
- Run explicit Astro/TypeScript checking when configured;
  a successful build alone does not establish type correctness.
- Test important user-visible behavior and meaningful edge cases.
- Keep tests deterministic and independent of live external services.
- Do not weaken assertions or suppress errors to pass checks.
- Report what was verified and what remains unverified.

## Don't

- Add dependencies without checking existing capabilities.
- Edit generated build output or dependency files.
- Commit secrets or leftover debugging statements.
- Make unrelated dependency upgrades or force audit fixes.
- Overwrite unrelated work.
- Put product requirements or temporary plans in this file.

## When unsure

Inspect existing code and documentation first.
Proceed with reasonable, reversible implementation choices.
Ask when missing information blocks correct behavior or
requires a consequential product decision.
