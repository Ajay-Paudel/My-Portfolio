import { useState, useEffect, useCallback } from 'react';
import { useSound } from './useSound';

interface GamificationState {
  xp: number;
  level: number;
  progress: number;
  isLevelUp: boolean;
  addXP: (amount: number, actionId?: string) => void;
  resetLevelUp: () => void;
  resetProgress: () => void;
}

interface ActionHistory {
  [actionId: string]: {
    count: number;
    lastUsed: number;
  };
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

  // Persistent action history for anti-spam (survives refresh)
  const [actionHistory, setActionHistory] = useState<ActionHistory>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('xp_action_history');
        return saved ? JSON.parse(saved) : {};
      } catch {
        return {};
      }
    }
    return {};
  });

  // Constants
  const XP_PER_LEVEL = 100;
  const DECAY_RESET_TIME = 60 * 60 * 1000; // 1 hour - after this time, decay resets

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

  // Save action history to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('xp_action_history', JSON.stringify(actionHistory));
    }
  }, [actionHistory]);

  // Calculate progress within current level (0% to 100%)
  const progress = (xp % XP_PER_LEVEL) / XP_PER_LEVEL * 100;

  const addXP = useCallback((amount: number, actionId?: string) => {
    let finalAmount = amount;

    if (actionId) {
      const now = Date.now();
      const existingAction = actionHistory[actionId];
      
      // Check if action exists and hasn't expired (within 1 hour)
      if (existingAction && (now - existingAction.lastUsed) < DECAY_RESET_TIME) {
        // Diminishing returns: 100% -> 50% -> 33% -> 25% ...
        const repeatCount = existingAction.count;
        const decay = 1 / (repeatCount + 1);
        finalAmount = Math.floor(amount * decay);
        
        // Minimum 0 XP for repeated actions
        if (finalAmount < 1 && amount > 0) finalAmount = 0; 
        
        // Update count
        setActionHistory(prev => ({
          ...prev,
          [actionId]: {
            count: repeatCount + 1,
            lastUsed: now
          }
        }));
      } else {
        // First time or expired - reset count
        setActionHistory(prev => ({
          ...prev,
          [actionId]: {
            count: 1,
            lastUsed: now
          }
        }));
      }
    }

    if (finalAmount !== 0) {
      setXp(prev => Math.max(0, prev + finalAmount));
    }
  }, [actionHistory]);

  const resetProgress = useCallback(() => {
    setXp(0);
    setLevel(0);
    setActionHistory({});
    localStorage.setItem('user_xp', '0');
    localStorage.setItem('xp_action_history', '{}');
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
