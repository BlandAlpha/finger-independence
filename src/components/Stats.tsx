import React from 'react';
import { GameState } from '../types';

interface StatsProps {
  state: GameState;
}

export function Stats({ state }: StatsProps) {
  const { correct, total, avgReactionTime } = state.stats;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
  
  const targetCount = state.trainingCountMode === 'custom' ? state.customTrainingCount : state.trainingCountMode;

  return (
    <div className="flex divide-x divide-[var(--color-border)] bg-white">
      <div className="flex-1 py-3 px-4 md:px-6 flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ink-light)]">进度</span>
        <span className="font-mono text-sm">{total} / {targetCount}</span>
      </div>
      <div className="flex-1 py-3 px-4 md:px-6 flex items-center justify-between hidden sm:flex">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ink-light)]">得分</span>
        <span className="font-mono text-sm">{correct}</span>
      </div>
      <div className="flex-1 py-3 px-4 md:px-6 flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ink-light)]">准确率</span>
        <span className="font-mono text-sm">{accuracy}%</span>
      </div>
      <div className="flex-1 py-3 px-4 md:px-6 flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ink-light)]">平均反应</span>
        <span className="font-mono text-sm">{Math.round(avgReactionTime)}ms</span>
      </div>
    </div>
  );
}
