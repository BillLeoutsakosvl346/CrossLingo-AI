export interface UserStatistics {
  streak: number;
  xp: number;
  level: number;
}

export class UserStatsService {
  private static instance: UserStatsService;
  private stats: UserStatistics = {
    streak: 0,
    xp: 0,
    level: 0,
  };

  public static getInstance(): UserStatsService {
    if (!UserStatsService.instance) {
      UserStatsService.instance = new UserStatsService();
    }
    return UserStatsService.instance;
  }

  /**
   * Get current user statistics
   */
  public getStats(): UserStatistics {
    return { ...this.stats };
  }

  /**
   * Update streak
   */
  public updateStreak(value: number): void {
    this.stats.streak = Math.max(0, value);
  }

  /**
   * Add XP points
   */
  public addXP(points: number): void {
    this.stats.xp += points;
    this.checkLevelUp();
  }

  /**
   * Set XP directly
   */
  public setXP(value: number): void {
    this.stats.xp = Math.max(0, value);
    this.checkLevelUp();
  }

  /**
   * Set level directly
   */
  public setLevel(value: number): void {
    this.stats.level = Math.max(0, value);
  }

  /**
   * Check if user should level up based on XP
   */
  private checkLevelUp(): void {
    const newLevel = Math.floor(this.stats.xp / 100); // Level up every 100 XP
    if (newLevel > this.stats.level) {
      this.stats.level = newLevel;
    }
  }

  /**
   * Reset all statistics (for start over functionality)
   */
  public resetStats(): void {
    this.stats = {
      streak: 0,
      xp: 0,
      level: 0,
    };
  }

  /**
   * Get individual stat values
   */
  public getStreak(): number {
    return this.stats.streak;
  }

  public getXP(): number {
    return this.stats.xp;
  }

  public getLevel(): number {
    return this.stats.level;
  }
}

export default UserStatsService;
