import type { Encounter } from '../core/combat';
import { createEncounter } from '../core/encounter';

export const unitNames: Record<string, string> = {
  bulwark: 'Bulwark',
  breacher: 'Breacher',
  marksman: 'Marksman',
  engineer: 'Engineer',
  sentry: 'Dockyard Sentry',
};
export const demoEncounter: Encounter = {
  id: 'Dockyard 07',
  board: { width: 8, height: 8 },
  units: [
    { id: 'bulwark', team: 'player', position: { x: 2, y: 4 } },
    { id: 'breacher', team: 'player', position: { x: 3, y: 5 } },
    { id: 'marksman', team: 'player', position: { x: 4, y: 4 } },
    { id: 'engineer', team: 'player', position: { x: 3, y: 3 } },
    { id: 'sentry', team: 'enemy', position: { x: 7, y: 0 } },
  ].map((unit) => ({
    ...unit,
    team: unit.team === 'player' ? 'player' : 'enemy',
    maxHp: 10,
    hp: 10,
    moveRange: 4,
    attackRange: 5,
    damage: 3,
  })),
};
export function createDemoState() {
  const result = createEncounter(demoEncounter);
  if (!result.ok) throw new Error(JSON.stringify(result.diagnostics));
  return result.state;
}
