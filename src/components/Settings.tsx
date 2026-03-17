import React from 'react';
import { GameState, DifficultyMode, TrainingCountMode } from '../types';
import { KeyboardSetup } from './KeyboardSetup';

interface SettingsProps {
  state: GameState;
  updateState: (updates: Partial<GameState>) => void;
}

export function Settings({ state, updateState }: SettingsProps) {
  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto">
      <div className="max-w-3xl mx-auto w-full space-y-12">
        {/* Difficulty Section */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ink-light)] mb-4 border-b border-[var(--color-border)] pb-2">
            难度设置 (Difficulty)
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {(['easy', 'medium', 'hard', 'custom'] as DifficultyMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => updateState({ difficultyMode: mode })}
                className={`py-3 px-4 text-sm font-medium border transition-all ${
                  state.difficultyMode === mode 
                    ? 'border-[var(--color-ink)] bg-[var(--color-ink)] text-white' 
                    : 'border-[var(--color-border)] bg-white text-[var(--color-ink)] hover:border-[var(--color-ink-light)]'
                }`}
              >
                {mode === 'easy' && '简单'}
                {mode === 'medium' && '中等'}
                {mode === 'hard' && '困难'}
                {mode === 'custom' && '自定义'}
              </button>
            ))}
          </div>
          
          {state.difficultyMode === 'custom' && (
            <div className="mt-4 p-4 md:p-6 bg-white border border-[var(--color-border)] grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-[var(--color-ink-light)] mb-3">时间间隔 (Interval)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={state.customTime}
                    onChange={(e) => updateState({ customTime: Math.max(500, parseInt(e.target.value) || 1500) })}
                    className="border border-[var(--color-border)] px-3 py-2 w-24 text-sm focus:outline-none focus:border-[var(--color-ink)]"
                    min="500"
                    step="100"
                  />
                  <span className="text-sm text-[var(--color-ink-light)]">毫秒</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-[var(--color-ink-light)] mb-3">单手手指数量 (Fingers)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={state.customFingerCount[0]}
                    onChange={(e) => updateState({ customFingerCount: [Math.max(1, Math.min(5, parseInt(e.target.value) || 1)), state.customFingerCount[1]] })}
                    className="border border-[var(--color-border)] px-3 py-2 w-16 text-sm focus:outline-none focus:border-[var(--color-ink)] text-center"
                    min="1" max="5"
                  />
                  <span className="text-sm text-[var(--color-ink-light)]">-</span>
                  <input
                    type="number"
                    value={state.customFingerCount[1]}
                    onChange={(e) => updateState({ customFingerCount: [state.customFingerCount[0], Math.max(1, Math.min(5, parseInt(e.target.value) || 5))] })}
                    className="border border-[var(--color-border)] px-3 py-2 w-16 text-sm focus:outline-none focus:border-[var(--color-ink)] text-center"
                    min="1" max="5"
                  />
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Training Count Section */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ink-light)] mb-4 border-b border-[var(--color-border)] pb-2">
            训练次数 (Rounds)
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {([5, 15, 25, 'custom'] as TrainingCountMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => updateState({ trainingCountMode: mode })}
                className={`py-3 px-4 text-sm font-medium border transition-all ${
                  state.trainingCountMode === mode 
                    ? 'border-[var(--color-ink)] bg-[var(--color-ink)] text-white' 
                    : 'border-[var(--color-border)] bg-white text-[var(--color-ink)] hover:border-[var(--color-ink-light)]'
                }`}
              >
                {mode === 'custom' ? '自定义' : `${mode} 次`}
              </button>
            ))}
          </div>
          {state.trainingCountMode === 'custom' && (
            <div className="mt-4 flex items-center gap-3">
              <input
                type="number"
                value={state.customTrainingCount}
                onChange={(e) => updateState({ customTrainingCount: Math.max(1, parseInt(e.target.value) || 10) })}
                className="border border-[var(--color-border)] px-3 py-2 w-24 text-sm focus:outline-none focus:border-[var(--color-ink)]"
                min="1"
              />
              <span className="text-sm text-[var(--color-ink-light)]">次</span>
            </div>
          )}
        </section>

        {/* Device / Keyboard Setup */}
        <section>
          <div className="flex items-center justify-between mb-4 border-b border-[var(--color-border)] pb-2">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ink-light)]">
              输入设备 (Input Device)
            </h2>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={state.hasKeyboard}
                onChange={(e) => updateState({ hasKeyboard: e.target.checked })}
                className="w-4 h-4 accent-[var(--color-ink)]"
              />
              <span className="text-sm font-medium">使用实体键盘</span>
            </label>
          </div>
          
          {state.hasKeyboard && (
            <KeyboardSetup state={state} updateState={updateState} />
          )}
        </section>
      </div>
    </div>
  );
}
