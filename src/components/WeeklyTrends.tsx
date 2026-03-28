"use client";

import React, { useMemo, useState } from "react";
import { format, subDays, startOfDay } from "date-fns";
import { useWellnessData } from "@/context/WellnessContext";
import { HabitType, Habits } from "@/types";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import clsx from "clsx";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export function WeeklyTrends() {
  const { data } = useWellnessData();
  const [selectedHabit, setSelectedHabit] = useState<HabitType | "score">("score");

  const chartData = useMemo(() => {
    if (!data) return { labels: [], datasets: [] };

    const today = startOfDay(new Date());
    const labels: string[] = [];
    const points: number[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = subDays(today, i);
      const dateStr = format(d, "yyyy-MM-dd");
      labels.push(format(d, "EEE"));

      if (selectedHabit === "score") {
        const log = data.logs[dateStr] || {};
        let score = 0;
        const weightPerHabit = 100 / 6;

        const calcPoints = (key: HabitType) => {
          const g = data.goals[key] as number;
          const v = (log[key] || 0) as number;
          if (g === 0) return weightPerHabit;
          return Math.min(1, v / g) * weightPerHabit;
        };

        score += calcPoints("hydration");
        score += calcPoints("sleep");
        score += calcPoints("activity");
        score += calcPoints("meals");
        score += calcPoints("screenBreaks");
        score += log.stressRelief ? weightPerHabit : 0;
        points.push(Math.round(score));
      } else {
        const val = data.logs[dateStr]?.[selectedHabit];
        if (typeof val === "boolean") {
          points.push(val ? 100 : 0);
        } else {
          points.push((val as number) || 0);
        }
      }
    }

    const isScore = selectedHabit === "score";

    return {
      labels,
      datasets: [
        {
          label: isScore ? "Wellness Score" : "Progress",
          data: points,
          borderColor: isScore ? "rgb(45, 212, 191)" : "rgb(99, 102, 241)",
          backgroundColor: isScore
            ? "rgba(45, 212, 191, 0.2)"
            : "rgba(99, 102, 241, 0.2)",
          tension: 0.4,
          fill: true,
          pointBackgroundColor: isScore ? "rgb(45, 212, 191)" : "rgb(99, 102, 241)",
          pointBorderColor: "rgba(255,255,255,0.5)",
          pointBorderWidth: 2,
        },
      ],
    };
  }, [data, selectedHabit]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        titleColor: "white",
        bodyColor: "rgba(255, 255, 255, 0.8)",
        borderColor: "rgba(71, 85, 105, 0.5)",
        borderWidth: 1,
        padding: 10,
        displayColors: false,
      },
    },
    scales: {
      y: {
        display: true,
        grid: {
          color: "rgba(51, 65, 85, 0.5)",
        },
        ticks: {
          color: "rgb(148, 163, 184)",
        },
        suggestedMin: 0,
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "rgb(148, 163, 184)",
        },
      },
    },
    interaction: {
      mode: "nearest" as const,
      axis: "x" as const,
      intersect: false,
    },
  };

  const tabs = [
    { id: "score", label: "Score" },
    { id: "hydration", label: "Water" },
    { id: "sleep", label: "Sleep" },
    { id: "activity", label: "Activity" },
    { id: "meals", label: "Meals" },
    { id: "screenBreaks", label: "Breaks" },
    { id: "stressRelief", label: "Stress" },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-sm space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-slate-100 text-lg">Weekly Trends</h3>
      </div>

      <div className="flex overflow-x-auto pb-2 space-x-2 scrollbar-none snap-x mask-fade-edges">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedHabit(tab.id as HabitType | "score")}
            className={clsx(
              "px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors snap-start focus:outline-none",
              selectedHabit === tab.id
                ? "bg-teal-500/20 text-teal-400 border border-teal-500/30"
                : "bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700 border border-transparent"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="h-64 w-full relative">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
