"use client";

import React from "react";
import { format, subDays, startOfDay } from "date-fns";
import { useWellnessData } from "@/context/WellnessContext";
import clsx from "clsx";

export function StreakCalendar() {
  const { getWellnessScore, selectedDate, setSelectedDate } = useWellnessData();
  const today = startOfDay(new Date());

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = subDays(today, 6 - i);
    const dateStr = format(d, "yyyy-MM-dd");
    const label = format(d, "EEE");
    const score = getWellnessScore(dateStr);
    return { dateStr, label, score };
  });

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-slate-100">7-Day Streak</h3>
        <button 
          onClick={() => setSelectedDate(format(new Date(), "yyyy-MM-dd"))}
          className="text-xs font-medium text-teal-400 bg-teal-500/10 hover:bg-teal-500/20 px-2 py-1 rounded-md transition-colors"
        >
          Go to Today
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2 sm:gap-3">
        {days.map(({ dateStr, label, score }) => {
          const isSelected = selectedDate === dateStr;
          let colorClass = "bg-rose-500/20 border-rose-500/50 text-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.15)]"; // Red for missed
          if (score >= 90) colorClass = "bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]"; // Green for complete
          else if (score > 0) colorClass = "bg-amber-500/20 border-amber-500/50 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]"; // Amber for partial

          return (
            <button 
              key={dateStr} 
              onClick={() => setSelectedDate(dateStr)}
              className="flex flex-col items-center space-y-2 group outline-none focus:ring-2 focus:ring-teal-500/50 rounded-lg p-0.5"
            >
              <span className={clsx(
                "text-[10px] sm:text-xs font-medium uppercase transition-colors",
                isSelected ? "text-teal-400" : "text-slate-500"
              )}>
                {label}
              </span>
              <div
                className={clsx(
                  "w-full aspect-square max-w-[40px] rounded-lg sm:rounded-xl border flex flex-col items-center justify-center transition-all duration-300 transform",
                  colorClass,
                  isSelected ? "scale-110 -translate-y-1 ring-2 ring-white/20 border-white/40" : "group-hover:-translate-y-0.5"
                )}
                title={`Score: ${score}`}
              >
                <span className="text-[10px] sm:text-xs font-bold opacity-80">{score || "-"}</span>
              </div>
              {isSelected && <div className="w-1 h-1 bg-teal-400 rounded-full animate-pulse" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
