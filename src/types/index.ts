export type HabitType = "hydration" | "sleep" | "activity" | "meals" | "screenBreaks" | "stressRelief";

export interface Habits {
  hydration: number;
  sleep: number;
  activity: number;
  meals: number;
  screenBreaks: number;
  stressRelief: boolean;
}

export type Goals = {
  [K in HabitType]: Extract<Habits[K], number | boolean>;
};

export interface DailyLog {
  date: string; // YYYY-MM-DD
  habits: Partial<Habits>;
}

export interface WellnessData {
  goals: Habits;
  logs: Record<string, Partial<Habits>>;
}

export const DEFAULT_GOALS: Habits = {
  hydration: 8,
  sleep: 8,
  activity: 30,
  meals: 3,
  screenBreaks: 5,
  stressRelief: true,
};

// Utilities for generating empty logs
export const getEmptyHabits = (): Habits => ({
  hydration: 0,
  sleep: 0,
  activity: 0,
  meals: 0,
  screenBreaks: 0,
  stressRelief: false,
});
