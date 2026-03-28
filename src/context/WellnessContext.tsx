"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { format, subDays, isSameDay, startOfDay } from "date-fns";
import { Habits, HabitType, WellnessData, DEFAULT_GOALS, getEmptyHabits } from "@/types";

interface WellnessContextType {
  data: WellnessData | null; // null during hydration wait
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  getSelectedLog: () => Habits;
  updateLog: (habit: HabitType, value: number | boolean) => void;
  updateGoal: (habit: HabitType, value: number | boolean) => void;
  getWellnessScore: (date: string) => number;
  getCurrentStreak: () => number;
  getFirstTime: () => boolean;
  completeOnboarding: () => void;
}

const WellnessContext = createContext<WellnessContextType | undefined>(undefined);

export const WellnessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<WellnessData | null>(null);
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd")
  );

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("wellnessData");
        const onboarded = localStorage.getItem("wellnessOnboarded");
        
        if (!onboarded) {
          setIsFirstTime(true);
        }

        if (stored) {
          setData(JSON.parse(stored));
        } else {
          setData({ goals: DEFAULT_GOALS, logs: {} });
        }
      }
    } catch (error) {
      console.error("Failed to parse wellness data", error);
      setData({ goals: DEFAULT_GOALS, logs: {} });
    }
  }, []);

  const saveToStorage = (newData: WellnessData) => {
    setData(newData);
    try {
      localStorage.setItem("wellnessData", JSON.stringify(newData));
    } catch (e) {
      console.error("Local storage error:", e);
    }
  };

  const getTodayDateStr = () => format(new Date(), "yyyy-MM-dd");

  const getSelectedLog = () => {
    if (!data) return getEmptyHabits();
    return { ...getEmptyHabits(), ...(data.logs[selectedDate] || {}) };
  };

  const updateLog = (habit: HabitType, value: number | boolean) => {
    if (!data) return;
    const currentLog = { ...getEmptyHabits(), ...(data.logs[selectedDate] || {}) };
    const newData = {
      ...data,
      logs: {
        ...data.logs,
        [selectedDate]: { ...currentLog, [habit]: value },
      },
    };
    saveToStorage(newData);
  };

  const updateGoal = (habit: HabitType, value: number | boolean) => {
    if (!data) return;
    const newData = {
      ...data,
      goals: { ...data.goals, [habit]: value },
    };
    saveToStorage(newData);
  };

  const completeOnboarding = () => {
    setIsFirstTime(false);
    localStorage.setItem("wellnessOnboarded", "true");
  };

  const getWellnessScore = (date: string) => {
    if (!data) return 0;
    const log = { ...getEmptyHabits(), ...(data.logs[date] || {}) };
    const goals = data.goals;

    let score = 0;
    const weightPerHabit = 100 / 6;

    const calcPoints = (key: HabitType) => {
      const g = goals[key] as number;
      const v = log[key] as number;
      if (g === 0) return weightPerHabit; // prevent division by zero gracefully
      return Math.min(1, v / g) * weightPerHabit;
    };

    score += calcPoints("hydration");
    score += calcPoints("sleep");
    score += calcPoints("activity");
    score += calcPoints("meals");
    score += calcPoints("screenBreaks");
    score += log.stressRelief ? weightPerHabit : 0;

    return Math.round(score);
  };

  const getCurrentStreak = () => {
    if (!data) return 0;
    let streak = 0;
    let date = startOfDay(new Date());

    while (true) {
      const dateStr = format(date, "yyyy-MM-dd");
      const score = getWellnessScore(dateStr);
      // Let's say a streak means score > 50
      if (score >= 50) {
        streak++;
        date = subDays(date, 1);
      } else {
        break;
      }
    }
    return streak;
  };

  const value = {
    data,
    selectedDate,
    setSelectedDate,
    getSelectedLog,
    updateLog,
    updateGoal,
    getWellnessScore,
    getCurrentStreak,
    getFirstTime: () => isFirstTime,
    completeOnboarding,
  };

  return <WellnessContext.Provider value={value}>{children}</WellnessContext.Provider>;
};

export const useWellnessData = () => {
  const context = useContext(WellnessContext);
  if (!context) {
    throw new Error("useWellnessData must be used within WellnessProvider");
  }
  return context;
};
