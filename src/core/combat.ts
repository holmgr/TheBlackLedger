export type Team = 'player' | 'enemy';
export type CombatOutcome = 'victory' | 'defeat' | 'draw';
export interface Position {
  x: number;
  y: number;
}
export interface Board {
  width: number;
  height: number;
}
export interface UnitDefinition {
  id: string;
  team: Team;
  position: Position;
  maxHp: number;
  hp: number;
  moveRange: number;
  attackRange: number;
  damage: number;
}
export interface Encounter {
  id: string;
  board: Board;
  units: UnitDefinition[];
}
export interface CombatUnit extends UnitDefinition {
  ap: number;
}
export type CombatStatus =
  | { kind: 'active'; phase: Team }
  | { kind: 'finished'; outcome: CombatOutcome };
export interface CombatState {
  encounterId: string;
  board: Board;
  units: CombatUnit[];
  round: number;
  status: CombatStatus;
}
export type CombatCommand =
  | { type: 'Move'; unitId: string; destination: Position }
  | { type: 'Attack'; unitId: string; targetId: string }
  | { type: 'EndTurn'; team: Team };
export type RejectionCode =
  | 'terminal-state'
  | 'unsupported-command'
  | 'unknown-unit'
  | 'wrong-phase'
  | 'knocked-out'
  | 'insufficient-ap'
  | 'invalid-position'
  | 'occupied'
  | 'out-of-range'
  | 'invalid-target';
export interface Rejection {
  code: RejectionCode;
  message: string;
}
export type PresentationEvent =
  | { type: 'moved'; unitId: string; from: Position; to: Position }
  | { type: 'damaged'; unitId: string; amount: number; hp: number }
  | { type: 'knocked-out'; unitId: string }
  | { type: 'phase-started'; phase: Team; round: number }
  | { type: 'combat-ended'; outcome: CombatOutcome };
export type ResolutionResult =
  | { accepted: true; nextState: CombatState; events: PresentationEvent[] }
  | { accepted: false; nextState: CombatState; events: []; rejection: Rejection };
export type Preview<T> = { available: true; value: T } | { available: false; rejection: Rejection };
export interface MovementPreview {
  destinations: Position[];
}
export interface AttackPreview {
  targetId: string;
  damage: number;
  remainingHp: number;
}

/** Commands are reserved contracts; mechanics are deliberately not implemented yet. */
export function resolveCommand(state: CombatState, _command: CombatCommand): ResolutionResult {
  const terminal = state.status.kind === 'finished';
  return {
    accepted: false,
    nextState: state,
    events: [],
    rejection: {
      code: terminal ? 'terminal-state' : 'unsupported-command',
      message: terminal ? 'Combat has finished.' : 'Combat commands are not implemented yet.',
    },
  };
}
export function previewMovement(_state: CombatState, _unitId: string): Preview<MovementPreview> {
  return {
    available: false,
    rejection: {
      code: 'unsupported-command',
      message: 'Movement previews are not implemented yet.',
    },
  };
}
export function previewAttack(
  _state: CombatState,
  _unitId: string,
  _targetId: string,
): Preview<AttackPreview> {
  return {
    available: false,
    rejection: { code: 'unsupported-command', message: 'Attack previews are not implemented yet.' },
  };
}
