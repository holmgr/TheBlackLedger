export interface GameState {
  mission: string;
  status: string;
}
export function createInitialState(): GameState {
  return { mission: 'Dockyard 07', status: 'Awaiting deployment' };
}
