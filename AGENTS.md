# Repository Guidelines

## Project Structure & Module Organization

The Black Ledger is a browser-first isometric tactical RPG prototype built with TypeScript, React, Phaser, and Vite.

- `src/core/`: engine-independent game state and action resolution. Keep rules independent of React and Phaser.
- `src/content/`: encounter, ability, and specialist definitions; currently contains the demo board.
- `src/battlefield/`: Phaser rendering and battlefield input.
- `src/ui/`: React screens, HUD, and shared CSS.
- `src/main.tsx`: application entry point.
- `src/saves/` and `src/dev/`: placeholders for persistence, migrations, and scenario tools.
- `docs/gameplay-core.md`: design brief; distinguish confirmed foundations from proposals when implementing gameplay.

There is currently no dedicated test or asset directory. The battlefield uses procedural graphics.

## Build, Test, and Development Commands

Use the Bun version recorded in `package.json` (currently `1.4.4`).

- `bun install`: install dependencies; commit `bun.lock` when dependencies change.
- `bun run dev`: start Vite on localhost; open the URL it prints.
- `bun run build`: run strict TypeScript checking, then generate the production bundle in `dist/`.
- `bun run preview`: serve the production build locally.
- `bun install --frozen-lockfile`: install reproducibly in CI, followed by `bun run build`.

## Coding Style & Naming Conventions

Follow existing TypeScript conventions: two-space indentation, single-quoted strings, semicolons, and ES module imports. Use PascalCase for React components and interfaces (`App`, `GameState`), and camelCase for functions and variables (`createBattlefield`, `demoBoard`). Use `.tsx` for JSX and `.ts` for game logic. Keep modules within their architectural layer. No formatter or linter is configured.

## Testing Guidelines

No automated test framework, test script, or coverage threshold is configured. Run `bun run build` for every code change. For UI or rendering changes, also check the local page: verify the mission header, isometric board, and four operatives render, and inspect the browser console for errors. When introducing automated tests, document the runner and naming convention alongside them.

## Commit & Pull Request Guidelines

The initial commit uses an imperative, descriptive subject: `Initialize browser game scaffold with Bun, React, and Phaser`. Follow that style with focused commits. In pull requests, explain the resulting behavior, link relevant issues when applicable, and report validation performed. Include screenshots for visible UI or battlefield changes. Update documentation when changing setup commands or architecture.
