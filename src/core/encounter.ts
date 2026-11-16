import type { CombatState, Encounter, UnitDefinition } from './combat';

export interface Diagnostic {
  path: string;
  message: string;
}
export type InitializationResult =
  | { ok: true; state: CombatState }
  | { ok: false; diagnostics: Diagnostic[] };
const record = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);
const integer = (value: unknown, minimum: number): value is number =>
  typeof value === 'number' && Number.isSafeInteger(value) && value >= minimum;
const id = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

/** Validate untrusted content before creating owned, JSON-serializable state. */
export function createEncounter(input: unknown): InitializationResult {
  const diagnostics: Diagnostic[] = [];
  const fail = (path: string, message: string) => diagnostics.push({ path, message });
  if (!record(input))
    return { ok: false, diagnostics: [{ path: '$', message: 'Expected encounter object.' }] };
  if (!id(input.id)) fail('id', 'Expected nonempty stable ID.');
  const board = input.board;
  const validBoard = record(board) && integer(board.width, 1) && integer(board.height, 1);
  if (!validBoard) fail('board', 'Width and height must be positive safe integers.');
  if (!Array.isArray(input.units)) fail('units', 'Expected unit array.');
  const ids = new Set<string>();
  const occupied = new Set<string>();
  const living = new Set<string>();
  if (Array.isArray(input.units))
    Array.from(input.units).forEach((unit: unknown, index: number) => {
      const path = `units[${index}]`;
      if (!record(unit)) {
        fail(path, 'Expected unit object.');
        return;
      }
      if (!id(unit.id)) fail(`${path}.id`, 'Expected nonempty stable ID.');
      else {
        if (ids.has(unit.id)) fail(`${path}.id`, 'Duplicate unit ID.');
        ids.add(unit.id);
      }
      if (unit.team !== 'player' && unit.team !== 'enemy')
        fail(`${path}.team`, 'Expected player or enemy.');
      for (const stat of ['maxHp', 'hp', 'moveRange', 'attackRange', 'damage'] as const) {
        if (!integer(unit[stat], stat === 'maxHp' ? 1 : 0))
          fail(
            `${path}.${stat}`,
            'Expected valid nonnegative safe integer (maxHp must be positive).',
          );
      }
      if (typeof unit.hp === 'number' && typeof unit.maxHp === 'number' && unit.hp > unit.maxHp)
        fail(`${path}.hp`, 'HP exceeds maxHp.');
      const position = unit.position;
      if (
        !record(position) ||
        !integer(position.x, 0) ||
        !integer(position.y, 0) ||
        (validBoard &&
          (position.x >= (board.width as number) || position.y >= (board.height as number)))
      ) {
        fail(`${path}.position`, 'Expected integer in-bounds position.');
      } else if (typeof unit.hp === 'number' && unit.hp > 0) {
        const key = `${position.x},${position.y}`;
        if (occupied.has(key)) fail(`${path}.position`, 'Living units cannot share a tile.');
        occupied.add(key);
      }
      if (typeof unit.hp === 'number' && unit.hp > 0) living.add(String(unit.team));
    });
  for (const team of ['player', 'enemy'])
    if (!living.has(team)) fail('units', `Elimination encounters require a living ${team} unit.`);
  if (diagnostics.length) return { ok: false, diagnostics };
  // All required fields have been checked above; copy only the public contract fields.
  const encounter = input as unknown as Encounter;
  const units = encounter.units.map((unit): UnitDefinition & { ap: number } => ({
    id: unit.id,
    team: unit.team,
    position: { x: unit.position.x, y: unit.position.y },
    maxHp: unit.maxHp,
    hp: unit.hp,
    moveRange: unit.moveRange,
    attackRange: unit.attackRange,
    damage: unit.damage,
    ap: unit.hp > 0 && unit.team === 'player' ? 2 : 0,
  }));
  return {
    ok: true,
    state: {
      encounterId: encounter.id,
      board: { width: encounter.board.width, height: encounter.board.height },
      units,
      round: 1,
      status: { kind: 'active', phase: 'player' },
    },
  };
}
