import Phaser from 'phaser';
import { demoBoard } from '../content/demo';

export function createBattlefield(parent: HTMLElement): Phaser.Game {
  class Battlefield extends Phaser.Scene {
    create() {
      const g = this.add.graphics();
      const project = (x: number, y: number) => ({ x: 440 + (x - y) * 42, y: 85 + (x + y) * 22 });
      for (let y = 0; y < demoBoard.height; y++) {
        for (let x = 0; x < demoBoard.width; x++) {
          const p = project(x, y);
          g.fillStyle((x + y) % 2 ? 0x172b36 : 0x1c323e);
          g.lineStyle(1, 0x34505c);
          const points = [
            { x: p.x, y: p.y - 22 },
            { x: p.x + 42, y: p.y },
            { x: p.x, y: p.y + 22 },
            { x: p.x - 42, y: p.y },
          ];
          g.fillPoints(points, true);
          g.strokePoints(points, true);
        }
      }
      for (const unit of demoBoard.units) {
        const p = project(unit.x, unit.y);
        g.fillStyle(0x080e14, 0.5);
        g.fillEllipse(p.x, p.y, 30, 14);
        g.fillStyle(0x63d5c1);
        g.fillRoundedRect(p.x - 9, p.y - 30, 18, 27, 5);
        g.fillStyle(0xc8f6ec);
        g.fillCircle(p.x, p.y - 34, 7);
      }
      this.add.text(24, 24, 'TACTICAL VIEW / HELLO WORLD', {
        fontFamily: 'monospace',
        fontSize: '13px',
        color: '#8fa9b5',
      });
    }
  }
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    width: 880,
    height: 500,
    backgroundColor: '#101c26',
    scene: Battlefield,
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  });
}
