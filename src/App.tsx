import React from 'react';
import { useGameLogic } from './hooks/useGameLogic';
import { Settings } from './components/Settings';
import { Display } from './components/Display';
import { Stats } from './components/Stats';

export default function App() {
  const { state, startGame, stopGame, updateState } = useGameLogic();

  return (
    <div className="h-[100dvh] flex flex-col bg-[var(--color-surface)] text-[var(--color-ink)] font-sans overflow-hidden">
      <header className="px-6 py-4 border-b border-[var(--color-border)] flex justify-between items-center bg-white shrink-0 z-10">
        <div>
          <h1 className="text-lg md:text-xl font-semibold tracking-tight">手指独立性训练</h1>
          <p className="text-[10px] md:text-xs text-[var(--color-ink-light)] uppercase tracking-widest mt-0.5">Finger Independence</p>
        </div>
        
        {!state.isRunning && !state.isFinished && (
          <button
            onClick={startGame}
            className="px-6 py-2.5 bg-[var(--color-ink)] text-white text-xs md:text-sm font-medium uppercase tracking-widest hover:bg-black transition-colors"
          >
            开始训练
          </button>
        )}
        {(state.isRunning || state.isFinished) && (
          <button
            onClick={stopGame}
            className="px-6 py-2.5 border border-[var(--color-border)] text-[var(--color-ink)] text-xs md:text-sm font-medium uppercase tracking-widest hover:bg-gray-50 transition-colors"
          >
            停止 / 返回
          </button>
        )}
      </header>

      {state.isRunning && state.countdown === null && (
        <div className="shrink-0 border-b border-[var(--color-border)]">
          <Stats state={state} />
        </div>
      )}

      <main className="flex-1 overflow-y-auto flex flex-col relative">
        {!state.isRunning && !state.isFinished ? (
          <Settings state={state} updateState={updateState} />
        ) : (
          <Display state={state} startGame={startGame} />
        )}
      </main>
    </div>
  );
}
