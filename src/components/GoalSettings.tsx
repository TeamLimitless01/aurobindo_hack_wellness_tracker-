"use client";

import React, { useState } from "react";
import { useWellnessData } from "@/context/WellnessContext";
import { HabitType, Habits } from "@/types";
import { Check, X } from "lucide-react";

export function GoalSettings() {
  const { data, getFirstTime, completeOnboarding, updateGoal } = useWellnessData();
  const [localGoals, setLocalGoals] = useState<Habits>(
    data?.goals || {
      hydration: 8,
      sleep: 8,
      activity: 30,
      meals: 3,
      screenBreaks: 5,
      stressRelief: true,
    }
  );

  const isFirstTime = getFirstTime();

  if (!data) return null;

  const handleGoalChange = (type: HabitType, value: number) => {
    setLocalGoals((prev) => ({ ...prev, [type]: value }));
  };

  const handleSave = () => {
    Object.entries(localGoals).forEach(([key, val]) => {
      updateGoal(key as HabitType, val);
    });
    if (isFirstTime) completeOnboarding();
  };

  const content = (
    <div className="w-full max-w-lg mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
          {isFirstTime ? "Set Your Daily Goals" : "Update Your Goals"}
        </h2>
        <p className="text-slate-400 mt-2 text-sm">
          Customize your targets for a better lifestyle
        </p>
      </div>

      <div className="space-y-4">
        {[
          { key: "hydration", label: "Hydration (glasses)", min: 1, max: 20 },
          { key: "sleep", label: "Sleep (hours)", min: 4, max: 12 },
          { key: "activity", label: "Physical Activity (min)", min: 10, max: 180, step: 10 },
          { key: "meals", label: "Healthy Meals (count)", min: 1, max: 10 },
          { key: "screenBreaks", label: "Screen Breaks (count)", min: 1, max: 20 },
        ].map(({ key, label, min, max, step = 1 }) => (
          <div key={key} className="flex flex-col space-y-2">
            <div className="flex justify-between items-center text-sm font-medium">
              <span className="text-slate-200">{label}</span>
              <span className="text-teal-400 text-lg">
                {localGoals[key as keyof Habits]}
              </span>
            </div>
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={localGoals[key as keyof Habits] as number}
              onChange={(e) => handleGoalChange(key as HabitType, Number(e.target.value))}
              className="w-full accent-teal-500 bg-slate-800 h-2 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold py-3 px-6 rounded-xl transition duration-300 transform active:scale-95"
      >
        <Check size={20} />
        <span>{isFirstTime ? "Start Tracking" : "Save Changes"}</span>
      </button>
    </div>
  );

  if (isFirstTime) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
        {content}
      </div>
    );
  }

  return content;
}
