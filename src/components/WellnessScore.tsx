"use client";

import React, { useMemo } from "react";
import { useWellnessData } from "@/context/WellnessContext";
import { format } from "date-fns";
import clsx from "clsx";

export function WellnessScore() {
  const { getWellnessScore, selectedDate } = useWellnessData();
  const score = getWellnessScore(selectedDate);

  const scoreColor = useMemo(() => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 50) return "text-teal-400";
    if (score >= 20) return "text-amber-400";
    return "text-rose-400";
  }, [score]);

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-md flex items-center justify-between">
      <div className="space-y-1">
        <h2 className="text-xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
          Daily Wellness Score
        </h2>
        <p className="text-sm text-slate-400">Keep it up to build your streak!</p>
      </div>
      
      <div className="relative flex items-center justify-center">
        {/* Simple Ring Implementation */}
        <svg className="w-24 h-24 transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r="42"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-slate-800"
          />
          <circle
            cx="48"
            cy="48"
            r="42"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={42 * 2 * Math.PI}
            strokeDashoffset={42 * 2 * Math.PI * (1 - score / 100)}
            className={clsx("transition-all duration-1000 ease-out", scoreColor)}
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center animate-in fade-in duration-500">
          <span className={clsx("text-2xl font-bold tracking-tighter", scoreColor)}>
            {score}
          </span>
          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest -mt-1">
            /100
          </span>
        </div>
      </div>
    </div>
  );
}
