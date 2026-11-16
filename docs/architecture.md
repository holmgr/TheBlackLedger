# Combat architecture

`src/core/combat.ts` owns serializable combat state, commands, structured rejection reasons, presentation events and preview contracts. It imports neither React nor Phaser. State uses plain data and discriminated phase/outcome status, and round-trips through JSON. IDs are content-authored stable strings, never generated randomly.

`src/core/encounter.ts` accepts unknown content at the boundary, returns path-specific diagnostics, and creates deterministic owned state only after validation. Content cannot mutate initialized state. Validated combat state is the resolver's input contract; this is not a save loader or migration API.

The caller owns the current state and replaces it only with the returned next state. Commands describe intent. Successful future resolution returns next state and ordered presentation events; rejection returns the original unchanged state and no events. `resolveCommand(state, command)` currently rejects every reserved command honestly.

UI and future AI share `previewMovement(state, unitId)` and `previewAttack(state, unitId, targetId)`. Their result distinguishes available previews from unavailable queries; no empty result pretends a mechanic is implemented. Later implementation must keep previews consistent with command legality.

`src/content/` supplies encounter and unit definitions. `src/battlefield/` renders state and forwards input; React owns screens and HUD. Neither presentation layer owns combat rules. The existing `state.ts` mission shell and four-operative procedural demo remain unchanged, independent of the combat fixture, until a later integration issue. No generic ECS or plugin framework is required.

## Tests

Run `bun test` (or `bun run test`) with pinned Bun 1.4.4. Core behavior tests live beside modules as `*.test.ts`; Bun typings make tests part of the existing strict TypeScript build. CI runs tests alongside lint, format and production build checks. Tests cover content validation, deterministic initialization, JSON serialization, ownership and unsupported-command rejection invariants. New mechanics should add behavioral cases here before UI integration.
