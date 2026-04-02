# Repository Guidelines

## Project Structure & Module Organization

This repository is a Turbo monorepo with npm workspaces.

- `apps/web`: main Next.js app and API surface. Most product code lives in `apps/web/src`, with UI in `src/components`, routes in `src/app` and `src/pages`, shared helpers in `src/lib`, and queries in `src/queries`.
- `apps/demo`: lightweight demo app for validating the `zenblog` package.
- `packages/zenblog`: published TypeScript client, with source in `src`, tests in `tests`, and build output in `dist`.
- `packages/types`, `packages/hash`, `packages/code-block-sugar-high`: supporting workspace packages.
- `apps/web/public` and `apps/web/assets`: static assets. `supabase/` contains local Supabase state and tooling data.

## Build, Test, and Development Commands

- `npm run dev`: starts workspace development via Turbo.
- `npm run dev:web`: runs the main app only.
- `npm run build`: builds all workspaces.
- `npm run test`: runs Vitest from the repo root.
- `npm run format`: formats `ts`, `tsx`, and `md` files with Prettier.
- `cd apps/web && npm run lint`: lint the web app with ESLint.
- `cd apps/web && npm run typecheck`: run TypeScript checks for the web app.
- `npm run db:start` / `npm run db:stop`: manage the local Supabase stack.

## Coding Style & Naming Conventions

Use TypeScript throughout and keep formatting consistent with Prettier: 2-space indentation, no tabs. Follow the existing file-local style rather than renaming for consistency alone.

- React components: `PascalCase` filenames, e.g. `ContentRenderer.tsx`.
- Hooks: `use...` names, e.g. `useKeyboard.ts`.
- Utilities and route helpers: short descriptive names, commonly lowercase or kebab-case, e.g. `create-id.ts`, `slugify.test.ts`.

## Testing Guidelines

Vitest is the active test runner. Place tests close to the code for app behavior or under package-level `tests/` folders for libraries. Use `*.test.ts` naming. Run focused tests first, then broader workspace tests if needed.

Do not edit generated outputs unless required by the task; regenerate them instead. This especially applies to `apps/web/src/types/supabase.ts` and package build artifacts in `packages/zenblog/dist`.

## Commit & Pull Request Guidelines

Recent history favors short, imperative commit messages, often with conventional prefixes like `feat:`, `fix:`, or `style:`. Keep commits focused and scoped to one change.

Pull requests should include a concise summary, linked issue or context, testing notes, and screenshots for UI changes. Call out schema, env, or webhook changes explicitly so reviewers can validate local setup.

## Configuration Tips

Use Node.js 20+ when possible. Stripe and Supabase workflows exist in the repo scripts; avoid committing secrets or local-only config values.
