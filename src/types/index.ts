import { format, eachDayOfInterval, subDays } from "date-fns";

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

// Insights utilities
export interface RoutineInsights {
  weeklyStats: {
    totalDays: number;
    activeDays: number;
    averageCompletion: number;
    totalRoutines: number;
    completedRoutines: number;
  };
  categoryStats: {
    [category: string]: {
      total: number;
      completed: number;
      completionRate: number;
    };
  };
  timeStats: {
    earliestRoutine: string;
    latestRoutine: string;
    averageDuration: number;
    totalDuration: number;
  };
  streakData: {
    currentStreak: number;
    longestStreak: number;
    lastActiveDate: string | null;
  };
  dayOfWeekStats: {
    [day: string]: {
      completionRate: number;
      totalRoutines: number;
    };
  };
}

export interface WeeklyCompletionData {
  week: string;
  completionRate: number;
  totalRoutines: number;
}

export const calculateRoutineInsights = (routineData: RoutineData, startDate: Date, endDate: Date): RoutineInsights => {
  const dates = eachDayOfInterval({ start: startDate, end: endDate });
  let totalDays = 0;
  let activeDays = 0;
  let totalRoutines = 0;
  let completedRoutines = 0;
  let totalDuration = 0;
  let durations: number[] = [];
  let earliestTime = '23:59';
  let latestTime = '00:00';
  
  const categoryStats: { [category: string]: { total: number; completed: number } } = {};
  const dayOfWeekStats: { [day: string]: { total: number; completed: number } } = {};
  
  // Initialize category stats
  const categories: RoutineItem['category'][] = ['health', 'work', 'personal', 'exercise', 'learning', 'other'];
  categories.forEach(cat => {
    categoryStats[cat] = { total: 0, completed: 0 };
  });
  
  // Calculate stats for each day
  dates.forEach(date => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const completion = routineData.completions[dateKey];
    const dayOfWeek = getDayOfWeek(date);
    const dayRoutines = routineData.weeklyRoutine[dayOfWeek];
    
    if (dayRoutines.length > 0) {
      totalDays++;
      const dayCompleted = completion?.completedItems.length || 0;
      totalRoutines += dayRoutines.length;
      completedRoutines += dayCompleted;
      
      if (dayCompleted > 0) {
        activeDays++;
      }
      
      // Category stats
      dayRoutines.forEach(routine => {
        categoryStats[routine.category].total++;
        if (completion?.completedItems.includes(routine.id)) {
          categoryStats[routine.category].completed++;
        }
        
        // Time stats
        if (routine.duration) {
          durations.push(routine.duration);
          totalDuration += routine.duration;
        }
        
        // Track earliest and latest times
        if (routine.time < earliestTime) earliestTime = routine.time;
        if (routine.time > latestTime) latestTime = routine.time;
      });
      
      // Day of week stats
      if (!dayOfWeekStats[dayOfWeek]) {
        dayOfWeekStats[dayOfWeek] = { total: 0, completed: 0 };
      }
      dayOfWeekStats[dayOfWeek].total += dayRoutines.length;
      dayOfWeekStats[dayOfWeek].completed += dayCompleted;
    }
  });
  
  // Calculate streaks
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let lastActiveDate: string | null = null;
  
  // Reverse order to calculate streaks from most recent
  dates.reverse().forEach(date => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const completion = routineData.completions[dateKey];
    const dayOfWeek = getDayOfWeek(date);
    const dayRoutines = routineData.weeklyRoutine[dayOfWeek];
    
    if (dayRoutines.length > 0 && completion?.completedItems.length > 0) {
      if (!lastActiveDate) lastActiveDate = dateKey;
      tempStreak++;
      if (tempStreak > longestStreak) longestStreak = tempStreak;
    } else {
      tempStreak = 0;
    }
  });
  
  currentStreak = tempStreak;
  
  // Calculate average duration
  const averageDuration = durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : 0;
  
  // Calculate completion rates
  const averageCompletion = totalRoutines > 0 ? Math.round((completedRoutines / totalRoutines) * 100) : 0;
  
  const categoryCompletionRates: { [category: string]: { total: number; completed: number; completionRate: number } } = {};
  Object.entries(categoryStats).forEach(([category, stats]) => {
    categoryCompletionRates[category] = {
      ...stats,
      completionRate: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0
    };
  });
  
  const dayOfWeekCompletionRates: { [day: string]: { completionRate: number; totalRoutines: number } } = {};
  Object.entries(dayOfWeekStats).forEach(([day, stats]) => {
    dayOfWeekCompletionRates[day] = {
      completionRate: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0,
      totalRoutines: stats.total
    };
  });
  
  return {
    weeklyStats: {
      totalDays,
      activeDays,
      averageCompletion,
      totalRoutines,
      completedRoutines
    },
    categoryStats: categoryCompletionRates,
    timeStats: {
      earliestRoutine: earliestTime,
      latestRoutine: latestTime,
      averageDuration: Math.round(averageDuration),
      totalDuration
    },
    streakData: {
      currentStreak,
      longestStreak,
      lastActiveDate
    },
    dayOfWeekStats: dayOfWeekCompletionRates
  };
};

export const getWeeklyCompletionData = (routineData: RoutineData, weeks: number = 4): WeeklyCompletionData[] => {
  const data: WeeklyCompletionData[] = [];
  const today = new Date();
  
  for (let i = weeks - 1; i >= 0; i--) {
    const weekStart = subDays(today, i * 7);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Start of week (Sunday)
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6); // End of week (Saturday)
    
    const weekDates = eachDayOfInterval({ start: weekStart, end: weekEnd });
    let weekTotal = 0;
    let weekCompleted = 0;
    
    weekDates.forEach(date => {
      const dateKey = format(date, 'yyyy-MM-dd');
      const completion = routineData.completions[dateKey];
      const dayOfWeek = getDayOfWeek(date);
      const dayRoutines = routineData.weeklyRoutine[dayOfWeek];
      
      if (dayRoutines.length > 0) {
        weekTotal += dayRoutines.length;
        weekCompleted += completion?.completedItems.length || 0;
      }
    });
    
    data.push({
      week: format(weekStart, 'MMM d'),
      completionRate: weekTotal > 0 ? Math.round((weekCompleted / weekTotal) * 100) : 0,
      totalRoutines: weekTotal
    });
  }
  
  return data;
};
