import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface GameState {
  xp: number;
  level: string;
  completedLaws: string[];
  quizResults: Record<string, boolean>;
}

interface GameContextType extends GameState {
  addXP: (points: number) => void;
  completeLaw: (lawId: string) => void;
  recordQuiz: (lawId: string, passed: boolean) => void;
  resetProgress: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const getLevel = (xp: number): string => {
  if (xp >= 500) return 'UX Architect';
  if (xp >= 200) return 'Apprentice';
  return 'Novice';
};

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(() => {
    const saved = localStorage.getItem('heuristics-game');
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...parsed, level: getLevel(parsed.xp) };
    }
    return { xp: 0, level: 'Novice', completedLaws: [], quizResults: {} };
  });

  const persist = (newState: GameState) => {
    localStorage.setItem('heuristics-game', JSON.stringify(newState));
  };

  const addXP = useCallback((points: number) => {
    setState(prev => {
      const newXP = prev.xp + points;
      const newState = { ...prev, xp: newXP, level: getLevel(newXP) };
      persist(newState);
      return newState;
    });
  }, []);

  const completeLaw = useCallback((lawId: string) => {
    setState(prev => {
      if (prev.completedLaws.includes(lawId)) return prev;
      const newState = { ...prev, completedLaws: [...prev.completedLaws, lawId] };
      persist(newState);
      return newState;
    });
  }, []);

  const recordQuiz = useCallback((lawId: string, passed: boolean) => {
    setState(prev => {
      const newState = { ...prev, quizResults: { ...prev.quizResults, [lawId]: passed } };
      persist(newState);
      return newState;
    });
  }, []);

  const resetProgress = useCallback(() => {
    const newState: GameState = { xp: 0, level: 'Novice', completedLaws: [], quizResults: {} };
    persist(newState);
    setState(newState);
  }, []);

  return (
    <GameContext.Provider value={{ ...state, addXP, completeLaw, recordQuiz, resetProgress }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
