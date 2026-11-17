import { expect, test } from 'bun:test';
import { createDemoState } from '../content/demo';
import { createGameSession } from './gameSession';
import type { CombatCommand } from '../core/combat';

const command: CombatCommand = { type: 'EndTurn', team: 'player' };

test('subscription consumes initial snapshot, publishes synchronously, and detaches', () => {
  const session = createGameSession(createDemoState());
  const seen: (string | null)[] = [];
  const off = session.subscribe(() => seen.push(session.getSnapshot().selectedUnitId));
  const first = session.getSnapshot();
  expect(session.getSnapshot()).toBe(first);
  session.select('bulwark');
  expect(seen).toEqual([null, 'bulwark']);
  off();
  off();
  session.select(null);
  expect(seen).toHaveLength(2);
  expect(first.selectedUnitId).toBeNull();
});

test('owns initial and reset data and exposes frozen snapshots', () => {
  const initial = createDemoState();
  const session = createGameSession(initial);
  initial.units[0].hp = 0;
  expect(session.getSnapshot().combat.units[0].hp).toBe(10);
  expect(Object.isFrozen(session.getSnapshot().combat.units[0].position)).toBe(true);
  session.select('bulwark');
  session.setBusy(true);
  const replacement = createDemoState();
  replacement.encounterId = 'Replacement';
  replacement.units[0].position = { x: 0, y: 0 };
  session.reset(replacement);
  replacement.units[0].hp = 0;
  expect(session.getSnapshot()).toMatchObject({
    selectedUnitId: null,
    busy: false,
    combat: { encounterId: 'Replacement' },
  });
  expect(session.getSnapshot().combat.units[0]).toMatchObject({ hp: 10, position: { x: 0, y: 0 } });
  session.reset();
  expect(session.getSnapshot().combat.units[0].hp).toBe(10);
});

test('invalid, enemy and knocked-out selections clear predictably', () => {
  const state = createDemoState();
  state.units[1].hp = 0;
  const session = createGameSession(state);
  for (const id of ['missing', 'sentry', 'breacher', null]) {
    session.select('bulwark');
    session.select(id);
    expect(session.getSnapshot().selectedUnitId).toBeNull();
  }
});

test('core rejection preserves snapshot and reports domain rejection', () => {
  const session = createGameSession(createDemoState());
  const before = session.getSnapshot();
  expect(session.dispatch(command)).toMatchObject({
    kind: 'resolved',
    result: { accepted: false, rejection: { code: 'unsupported-command' } },
  });
  expect(session.getSnapshot()).toBe(before);
});

test('human input is gated during playback/enemy phase, AI reaches the core', () => {
  const session = createGameSession(createDemoState());
  session.setBusy(true);
  expect(session.dispatch(command)).toEqual({ kind: 'gated', reason: 'busy' });
  expect(session.dispatch(command, 'ai').kind).toBe('resolved');
  const state = createDemoState();
  state.status = { kind: 'active', phase: 'enemy' };
  session.reset(state);
  expect(session.dispatch(command)).toEqual({ kind: 'gated', reason: 'enemy-phase' });
  expect(session.dispatch(command, 'ai').kind).toBe('resolved');
  state.status = { kind: 'finished', outcome: 'victory' };
  session.reset(state);
  expect(session.dispatch(command)).toMatchObject({
    kind: 'resolved',
    result: { rejection: { code: 'terminal-state' } },
  });
});

test.each(['removed', 'knocked-out', 'enemy'] as const)(
  'accepted commands publish owned state and reconcile %s selection',
  (change) => {
    const session = createGameSession(createDemoState(), (state) => {
      if (change === 'removed') state.units = state.units.filter((unit) => unit.id !== 'bulwark');
      else if (change === 'knocked-out') state.units[0].hp = 0;
      else state.units[0].team = 'enemy';
      state.round = 2;
      return { accepted: true, nextState: state, events: [] };
    });
    session.select('bulwark');
    let observedRound = 0;
    session.subscribe(() => {
      observedRound = session.getSnapshot().combat.round;
    });
    const before = session.getSnapshot();
    const response = session.dispatch(command);
    expect(observedRound).toBe(2);
    expect(session.getSnapshot().selectedUnitId).toBeNull();
    expect(before.combat.units[0].hp).toBe(10);
    if (response.kind === 'resolved') response.result.nextState.round = 99;
    expect(session.getSnapshot().combat.round).toBe(2);
  },
);

test('accepted updates preserve valid selection and publish new positions/values', () => {
  const session = createGameSession(createDemoState(), (state) => {
    state.units[0].position = { x: 0, y: 7 };
    state.units[0].hp = 6;
    state.units[0].ap = 1;
    return { accepted: true, nextState: state, events: [] };
  });
  session.select('bulwark');
  session.dispatch(command);
  expect(session.getSnapshot().selectedUnitId).toBe('bulwark');
  expect(session.getSnapshot().combat.units[0]).toMatchObject({
    position: { x: 0, y: 7 },
    hp: 6,
    ap: 1,
  });
});
