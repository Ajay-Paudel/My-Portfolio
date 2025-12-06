import { useState, useEffect, useCallback } from 'react';
import { useSound } from './useSound';

interface GamificationState {
  xp: number;
  level: number;
  progress: number;
  isLevelUp: boolean;
  addXP: (amount: number) => void;
  resetLevelUp: () => void;
  resetProgress: () => void;
}

export const useGamification = (): GamificationState => {
  const [xp, setXp] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('user_xp') || '0', 10);
    }
    return 0;
  });

  const [level, setLevel] = useState<number>(0);
  const [isLevelUp, setIsLevelUp] = useState<boolean>(false);
  const { playLevelUp } = useSound();

  // Constants
  const XP_PER_LEVEL = 100;

  useEffect(() => {
    // Calculate level based on XP formula: Level = floor(XP / 100)
    const newLevel = Math.floor(xp / XP_PER_LEVEL);
    
    // Check for level up (only if strictly greater and not initial load 0->0)
    if (newLevel > level && level !== 0) {
      setIsLevelUp(true);
      playLevelUp();
    } else if (newLevel > level && xp > 0) {
       // Initial load or first level up might just sync
       if (xp >= XP_PER_LEVEL) {
         // If we loaded with high XP, don't trigger animation, just sync
       }
    }
    
    setLevel(newLevel);
    localStorage.setItem('user_xp', xp.toString());
  }, [xp]);

  // Calculate progress within current level (0% to 100%)
  // e.g. 150 XP -> Level 1 (50 XP into level) -> 50%
  const progress = (xp % XP_PER_LEVEL) / XP_PER_LEVEL * 100;

  const addXP = useCallback((amount: number) => {
    setXp(prev => prev + amount);
  }, []);

  const resetProgress = useCallback(() => {
    setXp(0);
    setLevel(0);
    localStorage.setItem('user_xp', '0');
  }, []);

  const resetLevelUp = useCallback(() => {
    setIsLevelUp(false);
  }, []);

  return {
    xp,
    level,
    progress,
    isLevelUp,
    addXP,
    resetLevelUp,
    resetProgress
  };
};
