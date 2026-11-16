import { useEffect, useRef } from 'react';
import { createBattlefield } from '../battlefield/createBattlefield';
import { createInitialState } from '../core/state';

export function App() {
  const host = useRef<HTMLDivElement>(null);
  const state = createInitialState();
  useEffect(() => {
    const game = createBattlefield(host.current!);
    return () => { game.destroy(true); };
  }, []);
  return <main><header><span className="eyebrow">MERCENARY OPERATIONS / PROTOTYPE 001</span><h1>The Black Ledger<span>.</span></h1><p>A crew in debt. A contract ahead.</p></header><section className="mission"><div><span className="eyebrow">TRAINING CONTRACT</span><h2>{state.mission}</h2></div><span className="status">{state.status}</span></section><div className="battlefield" ref={host} /><footer><span>HELLO WORLD — SYSTEMS ONLINE</span><span>4 OPERATIVES / COMBAT COMING NEXT</span></footer></main>;
}
