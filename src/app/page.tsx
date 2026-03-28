"use client";

import React from "react";
import { useWellnessData } from "@/context/WellnessContext";
import { GoalSettings } from "@/components/GoalSettings";
import { WellnessScore } from "@/components/WellnessScore";
import { HabitCard } from "@/components/HabitCard";
import { StreakCalendar } from "@/components/StreakCalendar";
import { Droplet, Moon, Activity, Utensils, MonitorOff, Smile } from "lucide-react";

export default function DashboardPage() {
  const { data, getFirstTime, getSelectedLog, updateLog, selectedDate } = useWellnessData();

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400">Loading your habits...</p>
        </div>
      </div>
    );
  }

  const isFirstTime = getFirstTime();
  if (isFirstTime) {
    return <GoalSettings />;
  }

  const log = getSelectedLog();
  const goals = data.goals;

  const habitsList = [
    {
      type: "hydration" as const,
      label: "Hydration",
      value: log.hydration || 0,
      goal: goals.hydration,
      unit: "glasses",
      color: "text-blue-400 bg-blue-500",
      icon: <Droplet size={20} className="text-blue-400" />,
    },
    {
      type: "sleep" as const,
      label: "Sleep",
      value: log.sleep || 0,
      goal: goals.sleep,
      unit: "hours",
      color: "text-indigo-400 bg-indigo-500",
      icon: <Moon size={20} className="text-indigo-400" />,
    },
    {
      type: "activity" as const,
      label: "Activity",
      value: log.activity || 0,
      goal: goals.activity,
      unit: "mins",
      color: "text-orange-400 bg-orange-500",
      icon: <Activity size={20} className="text-orange-400" />,
    },
    {
      type: "meals" as const,
      label: "Healthy Meals",
      value: log.meals || 0,
      goal: goals.meals,
      unit: "meals",
      color: "text-green-400 bg-green-500",
      icon: <Utensils size={20} className="text-green-400" />,
    },
    {
      type: "screenBreaks" as const,
      label: "Screen Breaks",
      value: log.screenBreaks || 0,
      goal: goals.screenBreaks,
      unit: "breaks",
      color: "text-purple-400 bg-purple-500",
      icon: <MonitorOff size={20} className="text-purple-400" />,
    },
    {
      type: "stressRelief" as const,
      label: "Stress Relief",
      value: log.stressRelief || false,
      goal: goals.stressRelief,
      unit: "",
      color: "text-pink-400 bg-pink-500",
      icon: <Smile size={20} className="text-pink-400" />,
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
          Hello, Well-being 👋
        </h1>
        <p className="text-slate-400 mt-2">
          {selectedDate === new Date().toISOString().split('T')[0] 
            ? "Here is your daily overview" 
            : `Viewing history for ${selectedDate}`}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <WellnessScore />
        </div>
        
        <div className="md:col-span-2">
          <StreakCalendar />
        </div>

        {habitsList.map((habit) => (
          <HabitCard
            key={habit.type}
            type={habit.type}
            label={habit.label}
            value={habit.value}
            goal={habit.goal}
            unit={habit.unit}
            color={habit.color}
            icon={habit.icon}
            onUpdate={updateLog}
          />
        ))}
      </div>
    </div>
  );
}
