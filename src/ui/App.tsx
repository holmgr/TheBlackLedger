import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { createBattlefield } from '../battlefield/createBattlefield';
import { createDemoState, unitNames } from '../content/demo';
import { createGameSession, type GameSession } from '../session/gameSession';

export function App({ session: providedSession }: { session?: GameSession } = {}) {
  const host = useRef<HTMLDivElement>(null);
  const [ownedSession] = useState(() => createGameSession(createDemoState()));
  const session = providedSession ?? ownedSession;
  const { combat, selectedUnitId, busy } = useSyncExternalStore(
    session.subscribe,
    session.getSnapshot,
  );
  useEffect(() => {
    if (!host.current) return;
    const battlefield = createBattlefield(host.current, session);
    return () => battlefield.destroy();
  }, [session]);
  const selected = combat.units.find((unit) => unit.id === selectedUnitId);
  return (
    <main>
      <header>
        <span className="eyebrow">MERCENARY OPERATIONS / PROTOTYPE 002</span>
        <h1>
          The Black Ledger<span>.</span>
        </h1>
        <p>A crew in debt. A contract ahead.</p>
      </header>
      <section className="mission">
        <div>
          <span className="eyebrow">TRAINING CONTRACT</span>
          <h2>{combat.encounterId}</h2>
        </div>
        <span className="status">
          Round {combat.round} ·{' '}
          {combat.status.kind === 'active' ? `${combat.status.phase} phase` : combat.status.outcome}
          {busy ? ' · Playback' : ''}
        </span>
        <button onClick={() => session.reset()}>Reset encounter</button>
      </section>
      <div className="battlefield" ref={host} />
      <section className="inspection" aria-label="Unit inspection">
        <div className="selection" aria-live="polite">
          <strong>
            {selected ? (unitNames[selected.id] ?? selected.id) : 'Select an operative'}
          </strong>
          <span>
            {selected
              ? `${selected.id} · (${selected.position.x}, ${selected.position.y}) · HP ${selected.hp}/${selected.maxHp} · AP ${selected.ap}`
              : 'Click a figure or occupied tile. Empty ground clears selection.'}
          </span>
          <button disabled={!selected} onClick={() => session.select(null)}>
            Clear selection
          </button>
        </div>
        <div className="roster">
          {combat.units.map((unit) => (
            <button
              key={unit.id}
              className={unit.team}
              aria-pressed={selectedUnitId === unit.id}
              disabled={unit.team !== 'player' || unit.hp === 0}
              onClick={() => session.select(unit.id)}
            >
              <strong>{unitNames[unit.id] ?? unit.id}</strong>
              <span>
                {unit.id} · ({unit.position.x}, {unit.position.y})
              </span>
              <span>
                HP {unit.hp}/{unit.maxHp} · AP {unit.ap}
              </span>
            </button>
          ))}
        </div>
      </section>
      <footer>
        <span>ONE ENCOUNTER / LIVE TACTICAL VIEW</span>
        <span>4 OPERATIVES / COMBAT COMMANDS COMING NEXT</span>
      </footer>
    </main>
  );
}
