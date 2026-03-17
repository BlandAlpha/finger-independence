import React from 'react';
import { GameState } from '../types';

interface DisplayProps {
  state: GameState;
  startGame: () => void;
}

export function Display({ state, startGame }: DisplayProps) {
  const { currentPrompt, feedback, countdown, isFinished, stats } = state;

  if (isFinished) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white">
        <h2 className="font-serif text-4xl md:text-6xl mb-8">训练完成</h2>
        <div className="grid grid-cols-3 gap-8 md:gap-16 mb-12 text-center">
          <div>
            <p className="text-xs uppercase tracking-widest text-[var(--color-ink-light)] mb-2">得分</p>
            <p className="text-3xl md:text-5xl font-light">{stats.correct}/{stats.total}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-[var(--color-ink-light)] mb-2">准确率</p>
            <p className="text-3xl md:text-5xl font-light">{stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0}%</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-[var(--color-ink-light)] mb-2">平均反应</p>
            <p className="text-3xl md:text-5xl font-light">{Math.round(stats.avgReactionTime)}<span className="text-lg">ms</span></p>
          </div>
        </div>
        <button 
          onClick={startGame} 
          className="px-8 py-3 bg-[var(--color-ink)] text-white text-sm font-medium uppercase tracking-widest hover:bg-black transition-colors"
        >
          重新开始
        </button>
      </div>
    );
  }

  if (countdown !== null) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[var(--color-surface)]">
        <span className="font-serif text-[12rem] md:text-[20rem] leading-none text-[var(--color-ink)] animate-pulse">
          {countdown}
        </span>
      </div>
    );
  }

  if (!state.isRunning) return null;

  const renderHandPrompt = (hand: 'left' | 'right', numbers: number[]) => {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
        <span className={`absolute top-6 ${hand === 'left' ? 'left-6' : 'right-6'} text-xs font-semibold uppercase tracking-widest text-[var(--color-ink-light)]`}>
          {hand === 'left' ? '左手 Left' : '右手 Right'}
        </span>
        <div className="flex gap-4 md:gap-8 flex-wrap justify-center items-center">
          {numbers.length > 0 ? (
            numbers.map((num, i) => (
              <span key={i} className="font-serif text-7xl md:text-9xl lg:text-[12rem] leading-none text-[var(--color-ink)]">
                {num}
              </span>
            ))
          ) : (
            <span className="font-serif text-5xl md:text-7xl lg:text-9xl leading-none text-[var(--color-border)]">
              -
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col relative bg-white">
      <div className="flex-1 flex flex-row divide-x divide-[var(--color-border)]">
        {renderHandPrompt('left', currentPrompt?.left || [])}
        {renderHandPrompt('right', currentPrompt?.right || [])}
      </div>

      {/* Feedback overlay - elegant toast style */}
      {feedback && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none">
          <span className={`text-sm font-bold uppercase tracking-widest px-6 py-2 rounded-full shadow-lg ${
            feedback.isCorrect ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {feedback.isCorrect ? '正确' : '错误'}
          </span>
          {feedback.reactionTime !== null && (
            <span className="mt-3 text-xs font-mono text-[var(--color-ink-light)] bg-white/90 px-3 py-1 rounded shadow-sm backdrop-blur-sm border border-[var(--color-border)]">
              {feedback.reactionTime}ms
            </span>
          )}
        </div>
      )}
    </div>
  );
}
