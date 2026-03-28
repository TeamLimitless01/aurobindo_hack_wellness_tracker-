"use client";

import React, { useMemo } from "react";
import { format, subDays, startOfDay } from "date-fns";
import { useWellnessData } from "@/context/WellnessContext";
import { HabitType } from "@/types";
import { Lightbulb } from "lucide-react";

export function WeeklyInsights() {
  const { data } = useWellnessData();

  const insight = useMemo(() => {
    if (!data) return "Keep tracking your habits to get personalized insights!";

    const today = startOfDay(new Date());
    const scores = {
      hydration: 0,
      sleep: 0,
      activity: 0,
      meals: 0,
      screenBreaks: 0,
      stressRelief: 0,
    };

    let daysTracked = 0;

    for (let i = 6; i >= 0; i--) {
      const d = subDays(today, i);
      const dateStr = format(d, "yyyy-MM-dd");
      const log = data.logs[dateStr];
      if (log && Object.keys(log).length > 0) {
        daysTracked++;
        scores.hydration += (log.hydration as number) || 0;
        scores.sleep += (log.sleep as number) || 0;
        scores.activity += (log.activity as number) || 0;
        scores.meals += (log.meals as number) || 0;
        scores.screenBreaks += (log.screenBreaks as number) || 0;
        scores.stressRelief += log.stressRelief ? 1 : 0;
      }
    }

    if (daysTracked < 3) {
      return "Track for a few more days to unlock deeper insights.";
    }

    // Simple Rule-Based Lookup
    const avgSleep = scores.sleep / daysTracked;
    const avgHydration = scores.hydration / daysTracked;
    const avgActivity = scores.activity / daysTracked;
    
    // Explicit thresholds based on actual values (e.g. < 6 hours of sleep)
    if (avgSleep < 6) {
      return "I noticed your sleep has been a bit low this week. Try setting a relaxing wind-down routine 30 mins before bed to improve your rest.";
    }
    if (avgActivity < 20) {
      return "You've been a little less active lately! Try adding a quick 10-minute stretch or walk to your daily routine.";
    }
    if (avgHydration < 5) {
      return "Your water intake is looking a bit light. Try keeping a full water bottle on your desk as a visual reminder to stay hydrated.";
    }

    // Fallback to weakest habit relative to goal
    let weakest: HabitType = "hydration";
    let minScore = (scores.hydration / daysTracked) / (data.goals.hydration as number || 1);

    (Object.entries(scores) as [HabitType, number][]).forEach(([key, val]) => {
      const goal = data.goals[key] as number || 1;
      const ratio = (val / daysTracked) / goal;
      if (ratio < minScore) {
        minScore = ratio;
        weakest = key;
      }
    });

    const tips = {
      hydration: "You're running low on water intake. Bottoms up!",
      sleep: "Your sleep seems compromised. Prioritize rest.",
      activity: "You haven't been moving much! Time to stretch.",
      meals: "Healthy eating slipped this week. Consider meal prepping.",
      screenBreaks: "Too much screen time! Follow the 20-20-20 rule to rest your eyes.",
      stressRelief: "Stress relief activities are missing. Try a 5-minute deep breathing session.",
    };

    return tips[weakest] || "You're doing great! Keep it up.";
  }, [data]);

  return (
    <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 p-6 rounded-3xl shadow-md space-y-4">
      <div className="flex items-center space-x-3 text-indigo-400">
        <Lightbulb size={24} className="animate-pulse" />
        <h3 className="font-bold text-lg text-slate-100">AI Insight</h3>
      </div>
      <p className="text-slate-300 leading-relaxed font-medium">
        {insight}
      </p>
    </div>
  );
}
