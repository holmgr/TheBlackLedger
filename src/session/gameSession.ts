import {
  resolveCommand,
  type CombatCommand,
  type CombatState,
  type ResolutionResult,
} from '../core/combat';

type Immutable<T> = T extends object ? { readonly [K in keyof T]: Immutable<T[K]> } : T;
export interface SessionSnapshot {
  readonly combat: Immutable<CombatState>;
  readonly selectedUnitId: string | null;
  readonly busy: boolean;
}
export type DispatchResult =
  | { kind: 'gated'; reason: 'busy' | 'enemy-phase' }
  | { kind: 'resolved'; result: ResolutionResult };
type Resolver = (state: CombatState, command: CombatCommand) => ResolutionResult;

function freeze<T>(value: T): Immutable<T> {
  if (value !== null && typeof value === 'object') {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value as Immutable<T>;
}

/** One encounter owner; selection and playback busy state are presentation only. */
export function createGameSession(initial: CombatState, resolver: Resolver = resolveCommand) {
  const baseline = structuredClone(initial);
  let snapshot: SessionSnapshot = freeze({
    combat: structuredClone(baseline),
    selectedUnitId: null,
    busy: false,
  });
  const listeners = new Set<() => void>();
  function publish(next: SessionSnapshot) {
    snapshot = freeze(next);
    // Snapshot iteration prevents newly subscribed listeners receiving this publication twice.
    // oxlint-disable-next-line unicorn/no-useless-spread
    for (const listener of [...listeners]) {
      if (listeners.has(listener)) listener();
    }
  }
  function select(unitId: string | null) {
    const unit = snapshot.combat.units.find((candidate) => candidate.id === unitId);
    const selectedUnitId = unit?.team === 'player' && unit.hp > 0 ? unit.id : null;
    if (selectedUnitId !== snapshot.selectedUnitId) publish({ ...snapshot, selectedUnitId });
  }
  return {
    getSnapshot: () => snapshot,
    subscribe(listener: () => void) {
      listeners.add(listener);
      listener();
      return () => {
        listeners.delete(listener);
      };
    },
    select,
    setBusy(busy: boolean) {
      if (busy !== snapshot.busy) publish({ ...snapshot, busy });
    },
    reset(state: CombatState = baseline) {
      publish({ combat: structuredClone(state), selectedUnitId: null, busy: false });
    },
    dispatch(command: CombatCommand, source: 'human' | 'ai' = 'human'): DispatchResult {
      if (source === 'human') {
        if (snapshot.busy) return { kind: 'gated', reason: 'busy' };
        if (snapshot.combat.status.kind === 'active' && snapshot.combat.status.phase === 'enemy') {
          return { kind: 'gated', reason: 'enemy-phase' };
        }
      }
      const result = resolver(
        {
          ...snapshot.combat,
          board: { ...snapshot.combat.board },
          status: { ...snapshot.combat.status },
          units: snapshot.combat.units.map((unit) => ({ ...unit, position: { ...unit.position } })),
        },
        command,
      );
      if (result.accepted) {
        const combat = structuredClone(result.nextState);
        const selected = combat.units.find((unit) => unit.id === snapshot.selectedUnitId);
        publish({
          ...snapshot,
          combat,
          selectedUnitId: selected?.team === 'player' && selected.hp > 0 ? selected.id : null,
        });
      }
      return { kind: 'resolved', result };
    },
  };
}
export type GameSession = ReturnType<typeof createGameSession>;
