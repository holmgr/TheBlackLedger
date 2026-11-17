import type { Board, CombatState, Encounter, Position, Team, UnitDefinition } from './combat';

export interface Diagnostic {
  path: string;
  message: string;
}
export type InitializationResult =
  | { ok: true; state: CombatState }
  | { ok: false; diagnostics: Diagnostic[] };

/** Parse content, check encounter rules, then create owned initial state. */
export function createEncounter(input: unknown): InitializationResult {
  const diagnostics: Diagnostic[] = [];
  const encounter = parseEncounter(input, diagnostics);
  if (!encounter) return { ok: false, diagnostics };

  const ruleErrors = validateEncounter(encounter);
  if (ruleErrors.length > 0) return { ok: false, diagnostics: ruleErrors };

  return { ok: true, state: createCombatState(encounter) };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseId(value: unknown, path: string, diagnostics: Diagnostic[]): string | undefined {
  if (typeof value === 'string' && value.trim().length > 0) return value;
  diagnostics.push({ path, message: 'Expected nonempty stable ID.' });
}

function parseInteger(
  value: unknown,
  minimum: number,
  path: string,
  diagnostics: Diagnostic[],
): number | undefined {
  if (typeof value === 'number' && Number.isSafeInteger(value) && value >= minimum) return value;
  diagnostics.push({
    path,
    message: `Expected a safe integer greater than or equal to ${minimum}.`,
  });
}

function parseBoard(input: unknown, diagnostics: Diagnostic[]): Board | undefined {
  if (!isRecord(input)) {
    diagnostics.push({ path: 'board', message: 'Expected board object.' });
    return;
  }
  const width = parseInteger(input.width, 1, 'board.width', diagnostics);
  const height = parseInteger(input.height, 1, 'board.height', diagnostics);
  if (width === undefined || height === undefined) return;
  return { width, height };
}

function parsePosition(
  input: unknown,
  path: string,
  diagnostics: Diagnostic[],
): Position | undefined {
  if (!isRecord(input)) {
    diagnostics.push({ path, message: 'Expected position object.' });
    return;
  }
  const x = parseInteger(input.x, 0, `${path}.x`, diagnostics);
  const y = parseInteger(input.y, 0, `${path}.y`, diagnostics);
  if (x === undefined || y === undefined) return;
  return { x, y };
}

function parseTeam(value: unknown, path: string, diagnostics: Diagnostic[]): Team | undefined {
  if (value === 'player' || value === 'enemy') return value;
  diagnostics.push({ path, message: 'Expected player or enemy.' });
}

function parseUnit(
  input: unknown,
  path: string,
  diagnostics: Diagnostic[],
): UnitDefinition | undefined {
  if (!isRecord(input)) {
    diagnostics.push({ path, message: 'Expected unit object.' });
    return;
  }
  const id = parseId(input.id, `${path}.id`, diagnostics);
  const team = parseTeam(input.team, `${path}.team`, diagnostics);
  const position = parsePosition(input.position, `${path}.position`, diagnostics);
  const maxHp = parseInteger(input.maxHp, 1, `${path}.maxHp`, diagnostics);
  const hp = parseInteger(input.hp, 0, `${path}.hp`, diagnostics);
  const moveRange = parseInteger(input.moveRange, 0, `${path}.moveRange`, diagnostics);
  const attackRange = parseInteger(input.attackRange, 0, `${path}.attackRange`, diagnostics);
  const damage = parseInteger(input.damage, 0, `${path}.damage`, diagnostics);
  if (
    id === undefined ||
    team === undefined ||
    position === undefined ||
    maxHp === undefined ||
    hp === undefined ||
    moveRange === undefined ||
    attackRange === undefined ||
    damage === undefined
  )
    return;
  return { id, team, position, maxHp, hp, moveRange, attackRange, damage };
}

function parseEncounter(input: unknown, diagnostics: Diagnostic[]): Encounter | undefined {
  if (!isRecord(input)) {
    diagnostics.push({ path: '$', message: 'Expected encounter object.' });
    return;
  }
  const id = parseId(input.id, 'id', diagnostics);
  const board = parseBoard(input.board, diagnostics);
  const units: UnitDefinition[] = [];
  if (!Array.isArray(input.units)) {
    diagnostics.push({ path: 'units', message: 'Expected unit array.' });
  } else {
    // entries() visits sparse slots too, so missing units produce diagnostics.
    for (const [index, value] of input.units.entries()) {
      const unit = parseUnit(value, `units[${index}]`, diagnostics);
      if (unit) units.push(unit);
    }
  }
  if (diagnostics.length > 0 || id === undefined || board === undefined) return;
  return { id, board, units };
}

function validateEncounter(encounter: Encounter): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
  const ids = new Set<string>();
  const occupied = new Set<string>();
  const livingTeams = new Set<Team>();
  for (const [index, unit] of encounter.units.entries()) {
    const path = `units[${index}]`;
    if (ids.has(unit.id)) diagnostics.push({ path: `${path}.id`, message: 'Duplicate unit ID.' });
    ids.add(unit.id);
    if (unit.hp > unit.maxHp)
      diagnostics.push({ path: `${path}.hp`, message: 'HP exceeds maxHp.' });
    if (unit.position.x >= encounter.board.width || unit.position.y >= encounter.board.height) {
      diagnostics.push({
        path: `${path}.position`,
        message: 'Expected integer in-bounds position.',
      });
    }
    if (unit.hp === 0) continue;
    livingTeams.add(unit.team);
    const tile = `${unit.position.x},${unit.position.y}`;
    if (occupied.has(tile))
      diagnostics.push({ path: `${path}.position`, message: 'Living units cannot share a tile.' });
    occupied.add(tile);
  }
  for (const team of ['player', 'enemy'] as const) {
    if (!livingTeams.has(team))
      diagnostics.push({
        path: 'units',
        message: `Elimination encounters require a living ${team} unit.`,
      });
  }
  return diagnostics;
}

function createCombatState(encounter: Encounter): CombatState {
  return {
    encounterId: encounter.id,
    board: encounter.board,
    units: encounter.units.map((unit) => ({
      ...unit,
      ap: unit.hp > 0 && unit.team === 'player' ? 2 : 0,
    })),
    round: 1,
    status: { kind: 'active', phase: 'player' },
  };
}
