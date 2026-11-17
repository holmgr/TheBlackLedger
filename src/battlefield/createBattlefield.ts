import Phaser from 'phaser';
import type { GameSession } from '../session/gameSession';
import { pickFigure, pickTile, project } from './projection';

export function createBattlefield(parent: HTMLElement, session: GameSession) {
  let disposed = false;
  let detach = () => {};
  class Battlefield extends Phaser.Scene {
    create() {
      if (disposed) return;
      const g = this.add.graphics();
      const labels = this.add.container();
      const render = () => {
        const { combat, selectedUnitId } = session.getSnapshot();
        g.clear();
        labels.removeAll(true);
        const selected = combat.units.find((unit) => unit.id === selectedUnitId);
        labels.add(
          this.add.text(
            24,
            24,
            selected
              ? `${selected.id} · (${selected.position.x}, ${selected.position.y}) · HP ${selected.hp}/${selected.maxHp} · AP ${selected.ap}`
              : 'TACTICAL VIEW / SELECT AN OPERATIVE',
            { fontFamily: 'monospace', fontSize: '13px', color: '#b0c7cf' },
          ),
        );
        for (let y = 0; y < combat.board.height; y++) {
          for (let x = 0; x < combat.board.width; x++) {
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
        for (const unit of [...combat.units].sort(
          (a, b) => a.position.x + a.position.y - b.position.x - b.position.y,
        )) {
          const p = project(unit.position.x, unit.position.y);
          if (unit.id === selectedUnitId) {
            g.lineStyle(3, 0xf7db83);
            g.strokeEllipse(p.x, p.y, 58, 28);
          }
          g.fillStyle(0x080e14, 0.5);
          g.fillEllipse(p.x, p.y, 30, 14);
          g.fillStyle(unit.hp === 0 ? 0x607079 : unit.team === 'player' ? 0x63d5c1 : 0xe38b79);
          g.fillRoundedRect(p.x - 9, p.y - 30, 18, 27, 5);
          g.fillCircle(p.x, p.y - 34, 7);
        }
      };
      const onPointer = (pointer: Phaser.Input.Pointer) => {
        const { combat } = session.getSnapshot();
        // Raised figures can overlap the diamond behind their feet: hit figures first.
        const unitId = pickFigure(pointer, combat.units);
        const tile = pickTile(pointer, combat.board);
        const occupant =
          combat.units.find((unit) => unit.id === unitId) ??
          combat.units.find(
            (candidate) =>
              tile &&
              candidate.position.x === tile.x &&
              candidate.position.y === tile.y &&
              candidate.hp > 0,
          );
        session.select(occupant?.id ?? null);
      };
      const unsubscribe = session.subscribe(render);
      this.input.on('pointerdown', onPointer);
      const updateBounds = () => this.scale.updateBounds();
      window.addEventListener('scroll', updateBounds, true);
      detach = () => {
        unsubscribe();
        window.removeEventListener('scroll', updateBounds, true);
        this.input.off('pointerdown', onPointer);
      };
      this.events.once(Phaser.Scenes.Events.SHUTDOWN, detach);
    }
  }
  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    width: 880,
    height: 500,
    backgroundColor: '#101c26',
    scene: Battlefield,
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  });
  return {
    destroy() {
      if (disposed) return;
      disposed = true;
      detach();
      // Phaser defers normal destruction to a frame; preboot cleanup must wait for READY.
      if (game.isBooted) game.destroy(true);
      else game.events.once(Phaser.Core.Events.READY, () => game.destroy(true));
    },
  };
}
