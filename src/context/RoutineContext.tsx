"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns";
import { 
  RoutineData, 
  RoutineItem, 
  RoutineCompletion, 
  DayOfWeek, 
  getEmptyRoutineData, 
  getEmptyRoutineCompletion,
  getDayOfWeek 
} from "@/types";

interface RoutineContextType {
  routineData: RoutineData | null;
  selectedMonth: Date;
  setSelectedMonth: (date: Date) => void;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  
  // Weekly routine management
  addRoutineItem: (day: DayOfWeek, item: Omit<RoutineItem, 'id'>) => void;
  updateRoutineItem: (day: DayOfWeek, itemId: string, updates: Partial<RoutineItem>) => void;
  deleteRoutineItem: (day: DayOfWeek, itemId: string) => void;
  getRoutineForDay: (day: DayOfWeek) => RoutineItem[];
  getRoutineForDate: (date: Date) => RoutineItem[];
  copyRoutineFromDay: (fromDay: DayOfWeek, toDay: DayOfWeek) => void;
  
  // Completion tracking
  toggleRoutineCompletion: (date: Date, itemId: string) => void;
  skipRoutineItem: (date: Date, itemId: string) => void;
  unskipRoutineItem: (date: Date, itemId: string) => void;
  getCompletionForDate: (date: Date) => RoutineCompletion;
  getCompletionStats: (date: Date) => { completed: number; total: number; skipped: number };
  
  // Monthly data
  getMonthlyStats: (month: Date) => { totalDays: number; completedDays: number; averageCompletion: number };
}

const RoutineContext = createContext<RoutineContextType | undefined>(undefined);

export const RoutineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [routineData, setRoutineData] = useState<RoutineData | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("routineData");
        
        if (stored) {
          setRoutineData(JSON.parse(stored));
        } else {
          setRoutineData(getEmptyRoutineData());
        }
      }
    } catch (error) {
      console.error("Failed to parse routine data", error);
      setRoutineData(getEmptyRoutineData());
    }
  }, []);

  const saveToStorage = (newData: RoutineData) => {
    setRoutineData(newData);
    try {
      localStorage.setItem("routineData", JSON.stringify(newData));
    } catch (e) {
      console.error("Local storage error:", e);
    }
  };

  const getDateKey = (date: Date): string => format(date, "yyyy-MM-dd");

  // Weekly routine management
  const addRoutineItem = (day: DayOfWeek, item: Omit<RoutineItem, 'id'>) => {
    if (!routineData) return;
    
    const newItem: RoutineItem = {
      ...item,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };

    const newData = {
      ...routineData,
      weeklyRoutine: {
        ...routineData.weeklyRoutine,
        [day]: [...routineData.weeklyRoutine[day], newItem].sort((a, b) => a.time.localeCompare(b.time)),
      },
    };
    
    saveToStorage(newData);
  };

  const updateRoutineItem = (day: DayOfWeek, itemId: string, updates: Partial<RoutineItem>) => {
    if (!routineData) return;
    
    const newData = {
      ...routineData,
      weeklyRoutine: {
        ...routineData.weeklyRoutine,
        [day]: routineData.weeklyRoutine[day].map(item => 
          item.id === itemId ? { ...item, ...updates } : item
        ).sort((a, b) => a.time.localeCompare(b.time)),
      },
    };
    
    saveToStorage(newData);
  };

  const deleteRoutineItem = (day: DayOfWeek, itemId: string) => {
    if (!routineData) return;
    
    const newData = {
      ...routineData,
      weeklyRoutine: {
        ...routineData.weeklyRoutine,
        [day]: routineData.weeklyRoutine[day].filter(item => item.id !== itemId),
      },
    };
    
    saveToStorage(newData);
  };

  const getRoutineForDay = (day: DayOfWeek): RoutineItem[] => {
    return routineData?.weeklyRoutine[day] || [];
  };

  const getRoutineForDate = (date: Date): RoutineItem[] => {
    const dayOfWeek = getDayOfWeek(date);
    return getRoutineForDay(dayOfWeek);
  };

  const copyRoutineFromDay = (fromDay: DayOfWeek, toDay: DayOfWeek) => {
    if (!routineData) return;
    
    const sourceRoutine = routineData.weeklyRoutine[fromDay];
    const copiedItems: RoutineItem[] = sourceRoutine.map(item => ({
      ...item,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }));
    
    const newData = {
      ...routineData,
      weeklyRoutine: {
        ...routineData.weeklyRoutine,
        [toDay]: copiedItems.sort((a, b) => a.time.localeCompare(b.time)),
      },
    };
    
    saveToStorage(newData);
  };

  // Completion tracking
  const toggleRoutineCompletion = (date: Date, itemId: string) => {
    if (!routineData) return;
    
    const dateKey = getDateKey(date);
    const currentCompletion = routineData.completions[dateKey] || getEmptyRoutineCompletion(dateKey);
    
    let newCompletion: RoutineCompletion;
    
    if (currentCompletion.completedItems.includes(itemId)) {
      // Remove from completed
      newCompletion = {
        ...currentCompletion,
        completedItems: currentCompletion.completedItems.filter(id => id !== itemId),
      };
    } else {
      // Add to completed and remove from skipped if present
      newCompletion = {
        ...currentCompletion,
        completedItems: [...currentCompletion.completedItems, itemId],
        skippedItems: currentCompletion.skippedItems.filter(id => id !== itemId),
      };
    }

    const newData = {
      ...routineData,
      completions: {
        ...routineData.completions,
        [dateKey]: newCompletion,
      },
    };
    
    saveToStorage(newData);
  };

  const skipRoutineItem = (date: Date, itemId: string) => {
    if (!routineData) return;
    
    const dateKey = getDateKey(date);
    const currentCompletion = routineData.completions[dateKey] || getEmptyRoutineCompletion(dateKey);
    
    const newCompletion = {
      ...currentCompletion,
      skippedItems: [...currentCompletion.skippedItems, itemId],
      completedItems: currentCompletion.completedItems.filter(id => id !== itemId),
    };

    const newData = {
      ...routineData,
      completions: {
        ...routineData.completions,
        [dateKey]: newCompletion,
      },
    };
    
    saveToStorage(newData);
  };

  const unskipRoutineItem = (date: Date, itemId: string) => {
    if (!routineData) return;
    
    const dateKey = getDateKey(date);
    const currentCompletion = routineData.completions[dateKey] || getEmptyRoutineCompletion(dateKey);
    
    const newCompletion = {
      ...currentCompletion,
      skippedItems: currentCompletion.skippedItems.filter(id => id !== itemId),
    };

    const newData = {
      ...routineData,
      completions: {
        ...routineData.completions,
        [dateKey]: newCompletion,
      },
    };
    
    saveToStorage(newData);
  };

  const getCompletionForDate = (date: Date): RoutineCompletion => {
    if (!routineData) return getEmptyRoutineCompletion(getDateKey(date));
    
    const dateKey = getDateKey(date);
    return routineData.completions[dateKey] || getEmptyRoutineCompletion(dateKey);
  };

  const getCompletionStats = (date: Date) => {
    const routine = getRoutineForDate(date);
    const completion = getCompletionForDate(date);
    
    return {
      total: routine.length,
      completed: completion.completedItems.length,
      skipped: completion.skippedItems.length,
    };
  };

  // Monthly data
  const getMonthlyStats = (month: Date) => {
    if (!routineData) return { totalDays: 0, completedDays: 0, averageCompletion: 0 };
    
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    let totalCompletion = 0;
    let completedDays = 0;
    
    daysInMonth.forEach(day => {
      const stats = getCompletionStats(day);
      if (stats.total > 0) {
        totalCompletion += (stats.completed / stats.total) * 100;
        completedDays++;
      }
    });
    
    return {
      totalDays: daysInMonth.length,
      completedDays,
      averageCompletion: completedDays > 0 ? Math.round(totalCompletion / completedDays) : 0,
    };
  };

  const value = {
    routineData,
    selectedMonth,
    setSelectedMonth,
    selectedDate,
    setSelectedDate,
    addRoutineItem,
    updateRoutineItem,
    deleteRoutineItem,
    getRoutineForDay,
    getRoutineForDate,
    copyRoutineFromDay,
    toggleRoutineCompletion,
    skipRoutineItem,
    unskipRoutineItem,
    getCompletionForDate,
    getCompletionStats,
    getMonthlyStats,
  };

  return <RoutineContext.Provider value={value}>{children}</RoutineContext.Provider>;
};

export const useRoutineData = () => {
  const context = useContext(RoutineContext);
  if (!context) {
    throw new Error("useRoutineData must be used within RoutineProvider");
  }
  return context;
};
