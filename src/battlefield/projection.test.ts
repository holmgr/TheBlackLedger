import { expect, test } from 'bun:test';
import { pickFigure, pickTile, project } from './projection';

test('inverse projection picks every cell including all four board corners', () => {
  for (let x = 0; x < 8; x++)
    for (let y = 0; y < 8; y++) {
      expect(pickTile(project(x, y), { width: 8, height: 8 })).toEqual({ x, y });
    }
});
test('diamond boundaries and out-of-board input never clamp to phantom cells', () => {
  const board = { width: 8, height: 8 };
  expect(pickTile({ x: 440, y: 64 }, board)).toEqual({ x: 0, y: 0 });
  expect(pickTile({ x: 440, y: 62 }, board)).toBeNull();
  for (const point of [
    project(-1, 0),
    project(8, 0),
    project(0, -1),
    project(0, 8),
    { x: NaN, y: 0 },
    { x: 880, y: 500 },
  ]) {
    expect(pickTile(point, board)).toBeNull();
  }
});

test('knocked-out figures cannot intercept living figures on the same tile', () => {
  const position = { x: 2, y: 4 };
  const units = [
    { id: 'down', hp: 0, position },
    { id: 'living', hp: 5, position },
  ];
  const feet = project(2, 4);
  const point = { x: feet.x, y: feet.y - 24 };
  expect(pickFigure(point, units)).toBe('living');
  expect(pickFigure(point, [...units].reverse())).toBe('living');
  expect(pickFigure(point, [units[0]])).toBeNull();
});
