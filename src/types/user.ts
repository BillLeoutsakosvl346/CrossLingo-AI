export interface UserStatistics {
  streak: number;
  xp: number;
  level: number;
  lastActiveDate?: string;
}

export interface UserProfile {
  id?: string;
  name?: string;
  email?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  soundEnabled: boolean;
  teacherPersonality?: string;
}
