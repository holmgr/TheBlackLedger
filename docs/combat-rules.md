# Combat rules contract

## Confirmed foundations

The [gameplay brief](gameplay-core.md) remains authoritative: technological sci-fi abilities, flat tactical space, four deployed from a fixed roster, no permanent death, and combat/composition before campaign breadth. The five-specialist MVP is provisional.

## Provisional MVP defaults

These defaults are hypotheses for implementation and playtesting, not permanent design commitments.

- Square logical grid, zero-based integer coordinates, orthogonal movement. Manhattan distance (`abs(dx) + abs(dy)`) measures movement and basic attack range. Movement must eventually respect traversable routes; distance alone does not establish reachability.
- Player phase followed by enemy phase, free operative order within each phase. Each living unit receives 2 AP at the beginning of its team's phase; inactive units start with 0 AP. There is no individual activation lock.
- A move of up to the unit's content-defined move range costs 1 AP. A basic attack costs 1 AP and may be repeated. Attack range and damage come from content.
- Only living units occupy tiles; they cannot share tiles. Knocked-out units stay recorded, do not block movement, cannot act or be attacked, and remain knocked out until mission end. No permanent death.
- EndTurn explicitly ends the entire team's phase and discards its remaining AP. No automatic phase change on AP exhaustion. Enemy EndTurn begins the next player phase and increments the round; initial round is 1.
- Damage is deterministic: actual loss is clamped to `[0, current HP]`; HP remains within `[0, maxHp]`. No elevation effects. Cover and line of sight refinements are deferred to tactical targeting.
- Elimination checks happen after an entire action resolves. If both teams have no living units, draw takes precedence; otherwise no living players means defeat, no living enemies means victory. Terminal combat rejects every command without changing state or producing events.
- Initial elimination encounters require at least one living unit on each team. Future enemy-free objectives require an explicit validation extension.

## Available now and deferred questions

This issue provides initialization and public contracts only. Move, Attack and EndTurn all reject as unsupported; previews explicitly report unavailable. No pathfinding, attack resolution, phase transitions, AI, saves or abilities are implemented here.

Coordinates and numeric stats must be finite safe integers. Board dimensions and max HP are positive; HP, damage and ranges are nonnegative, and HP cannot exceed max HP. IDs are nonempty stable strings unique within the encounter's units. Living spawn positions must be in bounds and distinct.

Accuracy, cover, LOS, objectives beyond elimination, abilities, revival, tuning, and campaign economy remain deferred. Presentation events describe committed changes only; rejection emits none.
