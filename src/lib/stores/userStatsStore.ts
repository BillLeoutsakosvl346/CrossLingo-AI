import { create } from 'zustand';
import { UserStatistics } from '../../types';
import { logger } from '../utils/logger';

interface UserStatsState extends UserStatistics {
  // Actions
  updateStreak: (value: number) => void;
  addXP: (points: number) => void;
  setXP: (value: number) => void;
  setLevel: (value: number) => void;
  resetStats: () => void;
}

export const useUserStatsStore = create<UserStatsState>()((set, get) => ({
      streak: 0,
      xp: 0,
      level: 0,
      
      updateStreak: (value: number) => {
        set({ streak: Math.max(0, value) });
      },
      
      addXP: (points: number) => {
        const currentXP = get().xp;
        const currentLevel = get().level;
        const newXP = currentXP + points;
        const newLevel = Math.floor(newXP / 100); // Level up every 100 XP
        
        logger.stateChange('UserStats', 'addXP', { 
          points, 
          previousXP: currentXP, 
          newXP,
          leveledUp: newLevel > currentLevel 
        });
        
        set({ 
          xp: newXP,
          level: newLevel > currentLevel ? newLevel : currentLevel
        });
      },
      
      setXP: (value: number) => {
        const newXP = Math.max(0, value);
        const newLevel = Math.floor(newXP / 100);
        
        set({ 
          xp: newXP,
          level: newLevel
        });
      },
      
      setLevel: (value: number) => {
        set({ level: Math.max(0, value) });
      },
      
      resetStats: () => {
        const currentStats = get();
        logger.stateChange('UserStats', 'resetAll', { 
          previousStats: { 
            streak: currentStats.streak, 
            xp: currentStats.xp, 
            level: currentStats.level 
          }
        });
        set({
          streak: 0,
          xp: 0,
          level: 0,
        });
      },
    }));
