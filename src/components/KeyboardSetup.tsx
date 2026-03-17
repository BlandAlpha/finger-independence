import React, { useState } from 'react';
import { GameState } from '../types';

interface KeyboardSetupProps {
  state: GameState;
  updateState: (updates: Partial<GameState>) => void;
}

export function KeyboardSetup({ state, updateState }: KeyboardSetupProps) {
  const [editing, setEditing] = useState<{ hand: 'left' | 'right'; index: number } | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!editing) return;
    e.preventDefault();
    
    const key = e.key.toLowerCase();
    const newMapping = { ...state.keyMapping };
    newMapping[editing.hand] = [...newMapping[editing.hand]];
    newMapping[editing.hand][editing.index] = key;
    
    updateState({ keyMapping: newMapping });
    setEditing(null);
  };

  const renderHand = (hand: 'left' | 'right', title: string) => (
    <div>
      <h3 className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ink-light)] mb-3">
        {title}
      </h3>
      <div className="flex gap-1.5">
        {state.keyMapping[hand].map((key, i) => {
          const isEditing = editing?.hand === hand && editing?.index === i;
          return (
            <button
              key={i}
              onClick={() => setEditing({ hand, index: i })}
              onKeyDown={isEditing ? handleKeyDown : undefined}
              className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-sm font-medium uppercase border transition-all ${
                isEditing 
                  ? 'border-[var(--color-ink)] bg-[var(--color-ink)] text-white animate-pulse' 
                  : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-ink-light)]'
              }`}
            >
              {isEditing ? '?' : key}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="bg-white border border-[var(--color-border)] p-4 md:p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {renderHand('left', '左手 (Left Hand)')}
        {renderHand('right', '右手 (Right Hand)')}
      </div>
      {editing && (
        <p className="mt-4 text-xs font-semibold text-red-600 uppercase tracking-widest">
          请按下任意键以分配...
        </p>
      )}
    </div>
  );
}
