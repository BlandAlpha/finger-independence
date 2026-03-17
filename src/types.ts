export type TimeMode = 3000 | 2500 | 2000 | 'custom';
export type FingerCountMode = '1' | '1-2' | '1-3' | 'custom';
export type DifficultyMode = 'easy' | 'medium' | 'hard' | 'custom';
export type TrainingCountMode = 5 | 15 | 25 | 'custom';

export interface GameState {
  isRunning: boolean;
  isFinished: boolean;
  countdown: number | null;
  hasKeyboard: boolean;
  difficultyMode: DifficultyMode;
  timeMode: TimeMode;
  customTime: number;
  fingerCountMode: FingerCountMode;
  customFingerCount: [number, number];
  trainingCountMode: TrainingCountMode;
  customTrainingCount: number;
  keyMapping: { left: string[]; right: string[] };
  currentPrompt: { left: number[]; right: number[]; timestamp: number } | null;
  feedback: { isCorrect: boolean; reactionTime: number | null } | null;
  stats: { correct: number; total: number; avgReactionTime: number };
}
