# The Black Ledger

Browser-first isometric tactical RPG prototype. TypeScript rules, Phaser battlefield, React interface, Vite build. Uses Bun for dependency management and running development tools.

Install Bun on macOS with `brew install oven-sh/bun/bun`.

```sh
bun install
bun run dev
```

Open the local URL printed by Vite. The hello-world screen displays a placeholder isometric board and four operatives; combat and persistence are not implemented yet.

```sh
bun run build
bun run preview
```

Publish `dist/` to a static host. For hosting under a subdirectory, build with `bun run build --base=/repository-name/`.

## Structure

- `src/core`: engine-independent state and action resolution
- `src/content`: ability, specialist, and encounter definitions
- `src/battlefield`: Phaser rendering and battlefield input
- `src/ui`: React screens and HUD
- `src/saves`: future browser persistence and migrations
- `src/dev`: future scenario tools

Keep game rules independent of React and Phaser. Start with one encounter, movement, attacks, cover, and one shared synergy mechanic before expanding the roster.

## Reproducible installs

Commit `bun.lock` when dependencies change. In CI, use `bun install --frozen-lockfile`, then `bun run build`. Use the Bun version recorded in `package.json` for consistent tooling.
