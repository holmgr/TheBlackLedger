# The Black Ledger

Browser-first isometric tactical RPG prototype. TypeScript rules, Phaser battlefield, React interface, Vite build. Uses Bun for dependency management and running development tools.

Install Bun on macOS with `brew install oven-sh/bun/bun`.

```sh
bun install
bun run hooks:install
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

Commit `bun.lock` when dependencies change. In CI, use `bun install --frozen-lockfile`, then `bun run lint`, `bun run format:check`, and `bun run build`. Use the Bun version recorded in `package.json` for consistent tooling.

## Linting and commit hooks

Oxlint checks JavaScript and TypeScript with correctness rules and React Hooks checks enabled. Generated build output is excluded. Run `bun run lint` to check the project or `bun run lint:fix` to apply available automatic fixes. Warnings fail the check.

Oxfmt formats source files, styles, configuration, and documentation using two-space indentation, single quotes, and semicolons. Run `bun run format` to format files or `bun run format:check` to check formatting without changing files. Generated output and `bun.lock` are excluded.

Run `bun run hooks:install` once per clone to enable the versioned native Git hooks in `.githooks/`. This sets the repository-local `core.hooksPath` without an additional hook dependency. Bun must be available on the PATH used by Git (including GUI clients). Before every commit, the pre-commit hook runs `bun run lint` and `bun run format:check` across the project and blocks the commit if either check fails. It checks the working tree, including unstaged changes, and does not modify or stage files. After fixing lint errors or running `bun run format`, stage the fixes and retry the commit. New worktrees share this repository configuration; the hook script is versioned with the source.

## Continuous integration

GitHub Actions runs the `Build` check on pull requests targeting `main` and pushes to `main`. The workflow installs the Bun version from `package.json`, installs dependencies with the frozen lockfile, then runs linting, formatting checks, strict TypeScript checking, and the production build. CI runs the check commands directly without installing Git hooks. It can also be started manually from the Actions tab once the workflow is on the default branch.

To run the same checks locally:

```sh
bun install --frozen-lockfile
bun run lint
bun run format:check
bun run build
```

## Combat contracts and tests

See [combat rules](docs/combat-rules.md) and [architecture](docs/architecture.md) for provisional rules and shared core contracts. Run `bun test` for colocated `*.test.ts` core tests; CI runs these before the build. Combat mechanics remain unimplemented.
