import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, DifficultyMode, TrainingCountMode } from '../types';

const DEFAULT_LEFT_KEYS = ['c', 'r', 'e', 'w', 'q'];
const DEFAULT_RIGHT_KEYS = ['n', 'u', 'i', 'o', 'p'];

export function useGameLogic() {
  const [state, setState] = useState<GameState>({
    isRunning: false,
    isFinished: false,
    countdown: null,
    hasKeyboard: true,
    difficultyMode: 'medium',
    timeMode: 2500,
    customTime: 1500,
    fingerCountMode: '1-2',
    customFingerCount: [1, 4],
    trainingCountMode: 15,
    customTrainingCount: 10,
    keyMapping: { left: DEFAULT_LEFT_KEYS, right: DEFAULT_RIGHT_KEYS },
    currentPrompt: null,
    feedback: null,
    stats: { correct: 0, total: 0, avgReactionTime: 0 },
  });

  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const timeoutRef = useRef<number | null>(null);
  const pressedKeysRef = useRef<Set<string>>(new Set());
  const evaluatedRef = useRef<boolean>(false);

  const getIntervalTime = () => {
    if (stateRef.current.difficultyMode === 'easy') return 3000;
    if (stateRef.current.difficultyMode === 'medium') return 2500;
    if (stateRef.current.difficultyMode === 'hard') return 2000;
    return stateRef.current.timeMode === 'custom' ? stateRef.current.customTime : stateRef.current.timeMode;
  };

  const getFingerCountRange = (): [number, number] => {
    if (stateRef.current.difficultyMode === 'easy') return [1, 1];
    if (stateRef.current.difficultyMode === 'medium') return [1, 2];
    if (stateRef.current.difficultyMode === 'hard') return [1, 3];
    
    switch (stateRef.current.fingerCountMode) {
      case '1': return [1, 1];
      case '1-2': return [1, 2];
      case '1-3': return [1, 3];
      case 'custom': return stateRef.current.customFingerCount;
      default: return [1, 1];
    }
  };

  const getTargetCount = () => {
    return stateRef.current.trainingCountMode === 'custom' 
      ? stateRef.current.customTrainingCount 
      : stateRef.current.trainingCountMode;
  };

  const generatePrompt = useCallback(() => {
    if (stateRef.current.stats.total >= getTargetCount()) {
      setState(s => ({ ...s, isFinished: true, isRunning: false, currentPrompt: null }));
      return;
    }

    const [min, max] = getFingerCountRange();
    
    const getHandPrompt = (count: number) => {
      const fingers = [1, 2, 3, 4, 5];
      const result: number[] = [];
      for (let i = 0; i < count; i++) {
        const idx = Math.floor(Math.random() * fingers.length);
        result.push(fingers[idx]);
        fingers.splice(idx, 1);
      }
      return result.sort((a, b) => a - b);
    };

    const leftCount = Math.floor(Math.random() * (max - min + 1)) + min;
    const rightCount = Math.floor(Math.random() * (max - min + 1)) + min;

    const newPrompt = {
      left: getHandPrompt(leftCount),
      right: getHandPrompt(rightCount),
      timestamp: Date.now(),
    };

    setState(s => ({
      ...s,
      currentPrompt: newPrompt,
      feedback: null,
    }));
    
    pressedKeysRef.current.clear();
    evaluatedRef.current = false;

    // Schedule next prompt
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      if (stateRef.current.isRunning && stateRef.current.countdown === null) {
        let currentTotal = stateRef.current.stats.total;
        
        if (stateRef.current.hasKeyboard) {
          // If not evaluated by the end of interval, it's a miss
          if (!evaluatedRef.current && stateRef.current.currentPrompt) {
            currentTotal += 1;
            setState(s => ({
              ...s,
              feedback: { isCorrect: false, reactionTime: null },
              stats: { ...s.stats, total: currentTotal }
            }));
          }
        } else {
          // No keyboard mode, just progress the round
          currentTotal += 1;
          setState(s => ({
            ...s,
            stats: { ...s.stats, total: currentTotal }
          }));
        }
        
        if (currentTotal >= getTargetCount()) {
          setState(s => ({ ...s, isFinished: true, isRunning: false, currentPrompt: null }));
        } else {
          generatePrompt();
        }
      }
    }, getIntervalTime() as number);

  }, []);

  const startGame = useCallback(() => {
    setState(s => ({
      ...s,
      isRunning: true,
      isFinished: false,
      countdown: 3,
      stats: { correct: 0, total: 0, avgReactionTime: 0 },
      feedback: null,
      currentPrompt: null,
    }));

    let count = 3;
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    
    const tick = () => {
      count--;
      if (count > 0) {
        setState(s => ({ ...s, countdown: count }));
        timeoutRef.current = window.setTimeout(tick, 1000);
      } else {
        setState(s => ({ ...s, countdown: null }));
        generatePrompt();
      }
    };
    
    timeoutRef.current = window.setTimeout(tick, 1000);
  }, [generatePrompt]);

  const stopGame = useCallback(() => {
    setState(s => ({ ...s, isRunning: false, isFinished: false, countdown: null, currentPrompt: null, feedback: null }));
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!stateRef.current.isRunning || stateRef.current.countdown !== null || !stateRef.current.hasKeyboard || !stateRef.current.currentPrompt || evaluatedRef.current) return;
      
      const key = e.key.toLowerCase();
      const { keyMapping, currentPrompt } = stateRef.current;
      
      const isMappedKey = keyMapping.left.includes(key) || keyMapping.right.includes(key);
      if (!isMappedKey) return;

      pressedKeysRef.current.add(key);

      const requiredLeftKeys = currentPrompt.left.map(f => keyMapping.left[f - 1]);
      const requiredRightKeys = currentPrompt.right.map(f => keyMapping.right[f - 1]);
      const allRequiredKeys = new Set([...requiredLeftKeys, ...requiredRightKeys]);

      if (pressedKeysRef.current.size === allRequiredKeys.size) {
        let isCorrect = true;
        for (const k of pressedKeysRef.current) {
          if (!allRequiredKeys.has(k)) {
            isCorrect = false;
            break;
          }
        }

        const reactionTime = Date.now() - currentPrompt.timestamp;
        evaluatedRef.current = true;

        setState(s => {
          const newTotal = s.stats.total + 1;
          const newCorrect = isCorrect ? s.stats.correct + 1 : s.stats.correct;
          const newAvg = isCorrect 
            ? s.stats.correct === 0 ? reactionTime : ((s.stats.avgReactionTime * s.stats.correct) + reactionTime) / newCorrect 
            : s.stats.avgReactionTime;

          return {
            ...s,
            feedback: { isCorrect, reactionTime },
            stats: { correct: newCorrect, total: newTotal, avgReactionTime: newAvg }
          };
        });
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      pressedKeysRef.current.delete(key);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const updateState = (updates: Partial<GameState>) => {
    setState(s => ({ ...s, ...updates }));
  };

  return { state, startGame, stopGame, updateState };
}
