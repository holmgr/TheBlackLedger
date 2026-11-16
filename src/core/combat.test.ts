import { describe, expect, test } from 'bun:test';
import { createEncounter } from './encounter';
import { previewAttack, previewMovement, resolveCommand, type CombatCommand } from './combat';

const fixture = () => ({
  id: 'dockyard',
  board: { width: 8, height: 8 },
  units: [
    {
      id: 'operative',
      team: 'player',
      position: { x: 2, y: 4 },
      maxHp: 10,
      hp: 10,
      moveRange: 4,
      attackRange: 3,
      damage: 2,
    },
    {
      id: 'guard',
      team: 'enemy',
      position: { x: 6, y: 4 },
      maxHp: 8,
      hp: 8,
      moveRange: 3,
      attackRange: 2,
      damage: 2,
    },
  ],
});
function initial() {
  const result = createEncounter(fixture());
  if (!result.ok) throw new Error(JSON.stringify(result.diagnostics));
  return result.state;
}
describe('encounter boundary', () => {
  test('initializes deterministically with owned state and JSON round-trip', () => {
    const content = fixture();
    const result = createEncounter(content);
    expect(result).toEqual(createEncounter(content));
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.state).toEqual(JSON.parse(JSON.stringify(result.state)));
    expect(result.state.units.map((unit) => unit.ap)).toEqual([2, 0]);
    expect(result.state.round).toBe(1);
    content.units[0].position.x = 7;
    expect(result.state.units[0].position.x).toBe(2);
  });
  test.each([null, { malformed: [] }, {}, { units: null }])(
    'rejects malformed content %j',
    (value) => {
      const result = createEncounter(value);
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.diagnostics.length).toBeGreaterThan(0);
    },
  );
  test.each([NaN, Infinity, -1, 0.5, Number.MAX_SAFE_INTEGER + 1])(
    'rejects invalid stats and coordinates %s',
    (value) => {
      const content = fixture();
      content.units[0].hp = value;
      content.units[0].position.x = value;
      expect(createEncounter(content).ok).toBe(false);
    },
  );
  test('reports duplicate IDs, occupancy and excessive HP', () => {
    const content = fixture();
    content.units[1] = { ...content.units[0], hp: 11 };
    const result = createEncounter(content);
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.diagnostics.map((d) => d.path)).toEqual(
        expect.arrayContaining(['units[1].id', 'units[1].hp', 'units[1].position']),
      );
  });
  test('requires both living teams but knocked-out units do not occupy tiles', () => {
    const content = fixture();
    content.units.push({ ...content.units[0], id: 'down', hp: 0 });
    expect(createEncounter(content).ok).toBe(true);
    content.units[1].hp = 0;
    expect(createEncounter(content).ok).toBe(false);
  });
  test('rejects out-of-bounds spawns', () => {
    const content = fixture();
    content.units[0].position.y = 8;
    expect(createEncounter(content).ok).toBe(false);
  });
});
test('reserved commands reject without mutation or presentation events', () => {
  const state = initial();
  const before = JSON.stringify(state);
  const commands: CombatCommand[] = [
    { type: 'Move', unitId: 'operative', destination: { x: 3, y: 4 } },
    { type: 'Attack', unitId: 'operative', targetId: 'guard' },
    { type: 'EndTurn', team: 'player' },
  ];
  for (const command of commands) {
    const result = resolveCommand(state, command);
    expect(result.accepted).toBe(false);
    expect(result.nextState).toBe(state);
    expect(result.events).toEqual([]);
    if (!result.accepted) expect(result.rejection.code).toBe('unsupported-command');
  }
  expect(JSON.stringify(state)).toBe(before);
  state.status = { kind: 'finished', outcome: 'draw' };
  const result = resolveCommand(state, commands[0]);
  if (!result.accepted) expect(result.rejection.code).toBe('terminal-state');
  expect(previewMovement(state, 'operative').available).toBe(false);
  expect(previewAttack(state, 'operative', 'guard').available).toBe(false);
});

test('ignores non-contract content properties including cycles', () => {
  const content = fixture();
  Object.assign(content.board, { extra: content });
  Object.assign(content.units[0].position, { extra: content });
  const result = createEncounter(content);
  expect(result.ok).toBe(true);
  if (result.ok) expect(() => JSON.stringify(result.state)).not.toThrow();
  expect(createEncounter([]).ok).toBe(false);
});

test('rejects sparse unit arrays with a diagnostic for the missing entry', () => {
  const content = fixture();
  content.units.length = 3;
  const result = createEncounter(content);
  expect(result.ok).toBe(false);
  if (!result.ok)
    expect(result.diagnostics).toContainEqual({
      path: 'units[2]',
      message: 'Expected unit object.',
    });
});

test('reports field errors before checking encounter rules', () => {
  const content = fixture();
  content.board.width = 0;
  content.units[1].team = 'alien';
  const result = createEncounter(content);
  expect(result.ok).toBe(false);
  if (!result.ok)
    expect(result.diagnostics.map((error) => error.path)).toEqual(['board.width', 'units[1].team']);
});
