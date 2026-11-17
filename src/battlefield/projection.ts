import type { Board, Position } from '../core/combat';

export function project(x: number, y: number) {
  return { x: 440 + (x - y) * 42, y: 85 + (x + y) * 22 };
}
/** Logical canvas coordinates, already scaled by Phaser's input manager. */
export function pickTile(point: Position, board: Board): Position | null {
  const dx = (point.x - 440) / 42;
  const dy = (point.y - 85) / 22;
  const x = Math.floor((dx + dy) / 2 + 0.5);
  const y = Math.floor((dy - dx) / 2 + 0.5);
  return Number.isFinite(x) &&
    Number.isFinite(y) &&
    x >= 0 &&
    y >= 0 &&
    x < board.width &&
    y < board.height
    ? { x, y }
    : null;
}

export function pickFigure(
  point: Position,
  units: readonly { id: string; hp: number; position: Readonly<Position> }[],
): string | null {
  const ordered = [...units].sort(
    (a, b) => a.position.x + a.position.y - b.position.x - b.position.y,
  );
  // Reverse draw order, including ties. Knocked-out figures never intercept living units.
  const unit = ordered.reverse().find((candidate) => {
    const p = project(candidate.position.x, candidate.position.y);
    return (
      candidate.hp > 0 && Math.abs(point.x - p.x) <= 12 && point.y >= p.y - 42 && point.y <= p.y
    );
  });
  return unit?.id ?? null;
}
