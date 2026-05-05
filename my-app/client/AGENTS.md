# Repository Guidelines

## Project Structure & Module Organization
This repository currently contains a single frontend app in `my-app/` (React + TypeScript + Vite).

- `my-app/src/`: application source code.
- `my-app/src/app/styles/`: shared style layers (`reset.css`, `variables.css`, `index.css`).
- `my-app/public/`: static assets served as-is.
- `my-app/dist/`: production build output (generated, do not edit).
- `lancedb/`: local tooling data; treat as environment data, not app source.

Keep feature code in `src/` and place reusable UI or logic in clearly named subfolders as the app grows.

## Build, Test, and Development Commands
Run commands from `my-app/`.

- `pnpm install`: install dependencies.
- `pnpm dev`: start Vite dev server with HMR.
- `pnpm build`: run TypeScript project build (`tsc -b`) and produce production bundle.
- `pnpm preview`: serve the production build locally.
- `pnpm lint`: run ESLint across the project.
- After each addition of new code or functionality, run `pnpm build` from `my-app/`.

## Coding Style & Naming Conventions
- Language: TypeScript with React function components.
- Indentation: 2 spaces; keep imports grouped and sorted logically.
- Components: `PascalCase` file and export names (example: `ProductCard.tsx`).
- Hooks/utilities: `camelCase` names (example: `useRackLayout.ts`, `formatPrice.ts`).
- Styling: keep global tokens in `src/app/styles/variables.css`; avoid hard-coded repeated values.

Linting is configured via `my-app/eslint.config.js` with `@eslint/js`, `typescript-eslint`, `react-hooks`, and `react-refresh`.

## Testing Guidelines
Automated tests are not configured yet. For new logic-heavy features, add tests with Vitest + React Testing Library and colocate as `*.test.ts` / `*.test.tsx` near the source file.

Until a test runner is added, treat `pnpm lint` and `pnpm build` as required quality gates before opening a PR.

## Commit & Pull Request Guidelines
There is no commit history yet, so use a consistent convention from now on:

- Use Conventional Commits format: `<type>[optional scope]: <description>`.
- `feat` introduces a new feature (SemVer MINOR), `fix` patches a bug (SemVer PATCH).
- Breaking changes must use either `!` after type/scope (example: `feat(api)!: ...`) or a `BREAKING CHANGE: ...` footer.
- Additional allowed types: `build`, `chore`, `ci`, `docs`, `style`, `refactor`, `perf`, `test`.
- Keep commits focused and small; include optional body/footer when behavior changes.
- Examples:
  - `feat: allow provided config object to extend other configs`
  - `feat!: send an email to the customer when a product is shipped`
  - `feat(api)!: send an email to the customer when a product is shipped`
  - `chore!: drop support for Node 6`
  - `docs: correct spelling of CHANGELOG`
  - `feat(lang): add Polish language`

PRs should include:
- short problem/solution description,
- linked issue (if available),
- screenshots or short video for UI changes,
- verification notes (`pnpm lint`, `pnpm build`, and test results when present).
