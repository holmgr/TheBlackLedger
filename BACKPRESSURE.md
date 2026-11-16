# Backpressure

## Checks

- Use the Bun version pinned in `package.json`.
- Install dependencies with `bun install --frozen-lockfile`, matching CI.
- Run `bun run lint`, `bun run format:check`, and `bun run build` for every code change, matching CI. Lint warnings fail the check; the build checks types and generates the production bundle.
- Use `bun run lint:fix` for available automatic lint fixes and `bun run format` to fix formatting, then rerun the checks.
- Inspect `package.json` scripts and CI workflows for additional checks. Run configured checks as they are added; use their documented commands and do not invent commands for tooling that is not configured.
- Keep manual testing enabled. Boot the app, exercise behavior affected by the change, check rendering and interactions, and inspect the browser console for errors. Capture screenshots for visible UI or battlefield changes. Follow `AGENTS.md` for project-specific smoke checks.

## Review

- Apply the architecture, coding, testing, and documentation guidance in `AGENTS.md`.
- Use `docs/gameplay-core.md` as the gameplay design source, distinguishing confirmed foundations from proposals.
- Apply the personal `phaser-2d-game` skill at `/Users/viktor/.codex/skills/phaser-2d-game/SKILL.md` when reviewing Phaser architecture and integration. Keep gameplay rules independent of React and Phaser.
- Use the personal `game-playtest` skill at `/Users/viktor/.codex/skills/game-playtest/SKILL.md` for browser QA, including screenshot review of canvas rendering and HUD readability.

## Running the app

- Follow `README.md` for local setup and run instructions. Start the app with `bun run dev` and open the local URL printed by Vite.
- Follow the README's Git hook setup instructions (`bun run hooks:install` once per clone). The pre-commit hook checks lint and formatting across the whole working tree, including unstaged changes; it does not modify or stage files. Bun must be on Git's PATH. Run the build separately.

## Shipping

- The goal state is a GitHub pull request with all checks passing. Open or update the PR and monitor its checks until they pass; do not treat merely opening the PR as completion.
- Leave the PR open for review. Merging is not part of the goal state.
- Follow `AGENTS.md` for commit and PR conventions, including validation results and screenshots for visible changes.
