"use client";

import React from "react";
import { HabitType } from "@/types";
import { Plus, Minus, Check } from "lucide-react";
import clsx from "clsx";

interface HabitCardProps {
  type: HabitType;
  label: string;
  value: number | boolean;
  goal: number | boolean;
  unit: string;
  color: string;
  icon: React.ReactNode;
  onUpdate: (type: HabitType, value: number | boolean) => void;
}

export function HabitCard({
  type,
  label,
  value,
  goal,
  unit,
  color,
  icon,
  onUpdate,
}: HabitCardProps) {
  const isBoolean = typeof value === "boolean" && typeof goal === "boolean";
  const numValue = value as number;
  const numGoal = goal as number;

  const progress = isBoolean
    ? value
      ? 100
      : 0
    : Math.min(100, (numValue / numGoal) * 100);

  const isCompleted = isBoolean ? value === true : numValue >= numGoal;

  const handleIncrement = () => {
    if (!isBoolean) {
      onUpdate(type, numValue + 1);
    }
  };

  const handleDecrement = () => {
    if (!isBoolean && numValue > 0) {
      onUpdate(type, numValue - 1);
    }
  };

  const handleToggle = () => {
    if (isBoolean) {
      onUpdate(type, !value);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm transition-all hover:border-slate-700 relative overflow-hidden group">
      {/* Background Progress Bar */}
      <div
        className={clsx(
          "absolute left-0 bottom-0 h-1 transition-all duration-500",
          color
        )}
        style={{ width: `${progress}%` }}
      />
      
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className={clsx("p-2 rounded-xl bg-slate-800", color)}>
            {icon}
          </div>
          <div>
            <h3 className="font-semibold text-slate-100">{label}</h3>
            <p className="text-xs text-slate-400">
              {isBoolean ? "Daily check-in" : `Goal: ${numGoal} ${unit}`}
            </p>
          </div>
        </div>
        {isCompleted && (
          <div className="text-emerald-400 animate-in zoom-in spin-in-12 duration-300">
            <Check size={20} strokeWidth={3} />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="text-3xl font-bold tracking-tight text-white flex items-end">
          {isBoolean ? (value ? "Yes" : "No") : numValue}
          {!isBoolean && <span className="text-base text-slate-500 font-normal ml-2 mb-1">{unit}</span>}
        </div>

        <div className="flex space-x-2">
          {isBoolean ? (
            <button
              onClick={handleToggle}
              className={clsx(
                "px-5 py-2 rounded-xl font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900",
                value
                  ? "bg-slate-800 text-slate-300 hover:bg-slate-700 focus:ring-slate-700"
                  : `bg-teal-500/10 text-teal-400 hover:bg-teal-500/20 focus:ring-teal-500 ${color}`
              )}
            >
              {value ? "Undo" : "Done"}
            </button>
          ) : (
            <div className="flex items-center space-x-2 bg-slate-800/50 p-1 rounded-xl">
              <button
                onClick={handleDecrement}
                disabled={numValue <= 0}
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-50 transition-colors focus:outline-none"
              >
                <Minus size={18} />
              </button>
              <button
                onClick={handleIncrement}
                className={clsx(
                  "w-10 h-10 flex items-center justify-center rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors focus:outline-none text-teal-400 focus:ring-2 focus:ring-inset focus:ring-teal-500",
                  color
                )}
              >
                <Plus size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
