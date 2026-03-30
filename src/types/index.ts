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

// Routine System Types
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface RoutineItem {
  id: string;
  title: string;
  description?: string;
  time: string; // HH:MM format (start time)
  endTime?: string; // HH:MM format (end time)
  duration?: number; // in minutes (calculated if endTime provided)
  category: 'health' | 'work' | 'personal' | 'exercise' | 'learning' | 'other';
}

export type WeeklyRoutine = {
  [key in DayOfWeek]: RoutineItem[];
};

export interface RoutineCompletion {
  date: string; // YYYY-MM-DD
  completedItems: string[]; // routine item IDs
  skippedItems: string[]; // routine item IDs
}

export interface RoutineData {
  weeklyRoutine: WeeklyRoutine;
  completions: Record<string, RoutineCompletion>; // date -> completion data
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

// Routine System Utilities
export const DEFAULT_WEEKLY_ROUTINE: WeeklyRoutine = {
  monday: [],
  tuesday: [],
  wednesday: [],
  thursday: [],
  friday: [],
  saturday: [],
  sunday: [],
};

export const getEmptyRoutineCompletion = (date: string): RoutineCompletion => ({
  date,
  completedItems: [],
  skippedItems: [],
});

export const getEmptyRoutineData = (): RoutineData => ({
  weeklyRoutine: DEFAULT_WEEKLY_ROUTINE,
  completions: {},
});

export const getDayOfWeek = (date: Date): DayOfWeek => {
  const days: DayOfWeek[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[date.getDay()];
};

export const getCategoryColor = (category: RoutineItem['category']): string => {
  const colors = {
    health: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700',
    work: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700',
    personal: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700',
    exercise: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700',
    learning: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700',
    other: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600',
  };
  return colors[category];
};

export const calculateDuration = (startTime: string, endTime: string): number => {
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;
  
  // Handle overnight case (e.g., 22:00 to 01:00)
  if (endMinutes < startMinutes) {
    return (24 * 60 - startMinutes) + endMinutes;
  }
  
  return endMinutes - startMinutes;
};

export const formatTimeRange = (startTime: string, endTime?: string): string => {
  if (!endTime) return startTime;
  return `${startTime} to ${endTime}`;
};

export const sortRoutineItemsByTime = (items: RoutineItem[]): RoutineItem[] => {
  return items.sort((a, b) => {
    // Convert time strings to minutes for proper sorting
    const [aHour, aMin] = a.time.split(':').map(Number);
    const [bHour, bMin] = b.time.split(':').map(Number);
    const aMinutes = aHour * 60 + aMin;
    const bMinutes = bHour * 60 + bMin;
    return aMinutes - bMinutes;
  });
};
