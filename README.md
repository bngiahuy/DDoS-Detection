# DDoSDetection

A simple, minimal React + TypeScript + Vite frontend scaffold used for the DDoS detection project.

This repository provides a lightweight UI codebase built with Vite, React and TypeScript. It includes a component library under `components/` and shared UI primitives under `ui/`.

## Prerequisites

- Node.js 16+ (or compatible LTS)
- pnpm (preferred package manager)

If you don't have pnpm installed:

```bash
npm install -g pnpm
```

## Quick start

Install dependencies and run the dev server (pnpm is recommended):

```bash
pnpm install
pnpm dev
```

Build for production:

```bash
pnpm build
pnpm preview
```

Common scripts (may vary if you customized `package.json`):

- `pnpm dev` — start Vite dev server with hot module replacement
- `pnpm build` — create a production build
- `pnpm preview` — locally preview the production build
- `pnpm lint` — run linters (if configured)

## Project structure (high level)

- `src/` — main source code
  - `main.tsx`, `App.tsx`, styles, assets
- `components/` — page-specific and feature components
- `ui/` — shared UI primitives and design-system components
- `public/` — static assets
- `tsconfig.*.json` — TypeScript configuration files

Explore `components/` and `ui/` to find the building blocks used across pages like `DataScientistPage.tsx`, `NetworkAdminPage.tsx`, and `DevOpsPage.tsx`.

## Notes & recommendations

- This project is set up with TypeScript and multiple `tsconfig` files (`tsconfig.app.json`, `tsconfig.node.json`). If you enable type-aware ESLint rules, point the linter to these configs.
- The repo is organized for UI development only. If you add backend services, separate them into their own folders or repositories.

## Contributing

Contributions are welcome. Suggested workflow:

1. Fork the repo
2. Create a feature branch
3. Run `pnpm install` and test locally with `pnpm dev`
4. Open a pull request with a clear description and testing notes
