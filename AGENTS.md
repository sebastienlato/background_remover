# Repository Guidelines

## Project Structure & Module Organization
The Vite + React + TypeScript source lives in `src/`, with `App.tsx` defining the main UI and `main.tsx` bootstrapping the React root. Global styling is in `src/index.css`, primarily Tailwind utilities, while component-scoped tweaks should sit next to the component file. Entry HTML, meta tags, and root div live in `index.html`. Tailwind, ESLint, and TS configs (`tailwind.config.js`, `eslint.config.js`, `tsconfig*.json`) sit at the repo root; update them before changing build behavior. Store static marketing captures in `screenshots/` and keep large binary assets out of `src/`.

## Build, Test & Development Commands
- `npm install` — sync dependencies after pulling config changes.
- `npm run dev` — start the Vite dev server with hot reload on http://localhost:5173.
- `npm run build` — produce a production bundle in `dist/`; run before pushing release changes.
- `npm run preview` — serve the built bundle locally to verify deployment behavior.
- `npm run lint` — run ESLint across the project; mandatory pre-commit.
- `npm run typecheck` — run `tsc` in noEmit mode to catch type regressions.

## Coding Style & Naming Conventions
Use modern functional React patterns, React hooks, and explicit TypeScript interfaces. Stick to 2-space indentation and prefer named exports per component (`BackgroundRemover.tsx`). Component file names are PascalCase; hooks are camelCase and start with `use`. Tailwind utility classes go directly in JSX; extract repeated sets into helper components rather than custom CSS when possible. Run `npm run lint` and rely on the repo ESLint/TypeScript configs—avoid ad-hoc formatting overrides.

## Testing Guidelines
Formal test tooling is not bundled yet; when adding tests, use Vitest + React Testing Library (already supported by Vite) under `src/__tests__/`. Name files `<Component>.test.tsx` and keep tests colocated with subject files. Validate background removal flows with mocked Supabase responses and ensure accessibility checks (focus states, alt text) are covered. Always run the relevant `npm run dev` scenario while developing tests to ensure integration fidelity.

## Commit & Pull Request Guidelines
Follow a concise, imperative present-tense subject line (e.g., `feat: add drag-and-drop uploads`). Keep commits scoped to one feature or fix, add context in the body, and mention screenshots for UI changes. Pull requests should describe motivation, summarize implementation, list manual verification steps (`npm run lint`, `npm run build`), and link to any tracking issues. Include environment or credential notes (e.g., Supabase keys in `.env.local`) so reviewers can reproduce results, and never commit secrets or large exports.
