# Combat architecture

`src/core/combat.ts` owns serializable combat state, commands, structured rejection reasons, presentation events and preview contracts. It imports neither React nor Phaser. State uses plain data and discriminated phase/outcome status, and round-trips through JSON. IDs are content-authored stable strings, never generated randomly.

`src/core/encounter.ts` accepts unknown content at the boundary, returns path-specific diagnostics, and creates deterministic owned state only after validation. Parsing builds typed, owned values from known fields. Encounter rules then check bounds, HP, unique IDs, occupancy and living teams before initial state construction. Field errors are reported first; encounter-wide rules run only after parsing succeeds. Content cannot mutate initialized state. Validated combat state is the resolver's input contract; this is not a save loader or migration API.

The caller owns the current state and replaces it only with the returned next state. Commands describe intent. Successful future resolution returns next state and ordered presentation events; rejection returns the original unchanged state and no events. `resolveCommand(state, command)` currently rejects every reserved command honestly.

UI and future AI share `previewMovement(state, unitId)` and `previewAttack(state, unitId, targetId)`. Their result distinguishes available previews from unavailable queries; no empty result pretends a mechanic is implemented. Later implementation must keep previews consistent with command legality.

`src/content/` supplies encounter and unit definitions. `src/battlefield/` renders state and forwards input; React owns screens and HUD. Neither presentation layer owns combat rules. The session integration below connects validated content to both presentation layers. No generic ECS or plugin framework is required.

## Tests

Run `bun test` (or `bun run test`) with pinned Bun 1.4.4. Core behavior tests live beside modules as `*.test.ts`; Bun typings make tests part of the existing strict TypeScript build. CI runs tests alongside lint, format and production build checks. Tests cover content validation, deterministic initialization, JSON serialization, ownership and unsupported-command rejection invariants. New mechanics should add behavioral cases here before UI integration.

## Live session and presentation

`src/session/gameSession.ts` owns the current encounter outside React and Phaser. `getSnapshot()` returns a stable, deeply frozen snapshot until publication. Construction/reset take owned copies; a reset without arguments restores the original owned encounter. `subscribe(listener)` immediately consumes the initial snapshot and returns an idempotent unsubscribe. Accepted dispatch, reset, selection, and busy changes publish synchronously. Rejected commands preserve the snapshot. Consumers must treat snapshots as read-only.

`dispatch(command, source = 'human')` delegates to the merged core resolver. Human commands are additionally gated during playback or the enemy phase; controller gates are distinct from core rejections. Future AI callers can specify `ai`. The optional resolver argument supports behavioral tests of successful publication until core mechanics exist. No movement or attack rules live in the controller or either renderer.

Selection and busy are presentation state, never combat fields. Only living friendly units can be selected. Accepted state changes clear removed, knocked-out, or nonfriendly selections; reset always clears selection and busy. Reset accepts initialized combat state, not unknown encounter content: use `createEncounter` at the content boundary first.

React constructs a stable session and consumes it with `useSyncExternalStore`; `App` also accepts an injected session for replacement by a future mission host. Its effect replaces the battlefield adapter when that session changes. Phaser receives the same session, subscribes to snapshots, and detaches input/subscription on teardown. The adapter tolerates destruction before Phaser boot and React StrictMode setup/cleanup/setup. Pointer input uses Phaser's scaled logical coordinates followed by the inverse projection in `src/battlefield/projection.ts`. Figures are hit before tiles; empty, enemy, knocked-out, and outside input clear selection. Board clicks inspect units; commands remain unimplemented in core.

The demo now supplies four operatives and one enemy through validated encounter content. Names are presentation metadata, with stable IDs as fallback. The obsolete mission-shell `state.ts` and independent board adapter are retired. Tests beside session/projection modules cover subscriptions, ownership, input gating, accepted/rejected dispatch, reset/reconciliation, inverse projection, and board boundaries.
