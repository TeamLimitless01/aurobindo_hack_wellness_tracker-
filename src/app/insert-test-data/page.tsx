"use client";

import React, { useState } from "react";
import { format, subDays, startOfDay } from "date-fns";
import { useRouter } from "next/navigation";
import { WellnessData, DEFAULT_GOALS, Habits } from "@/types";

export default function InsertTestDataPage() {
  const router = useRouter();
  const [status, setStatus] = useState("");

  const injectData = (scenario: "perfect" | "lowSleep" | "lowActivity" | "lowHydration" | "random") => {
    const today = startOfDay(new Date());
    const newLogs: Record<string, Partial<Habits>> = {};

    for (let i = 6; i >= 0; i--) {
      const d = subDays(today, i);
      const dateStr = format(d, "yyyy-MM-dd");

      let hydration = 8;
      let sleep = 8;
      let activity = 30;
      let meals = 3;
      let screenBreaks = 5;
      let stressRelief = true;

      if (scenario === "perfect") {
        // all goals met
      } else if (scenario === "lowSleep") {
        sleep = Math.floor(Math.random() * 2) + 4; // 4 or 5 hours
      } else if (scenario === "lowActivity") {
        activity = Math.floor(Math.random() * 10) + 5; // 5 to 14 mins
      } else if (scenario === "lowHydration") {
        hydration = Math.floor(Math.random() * 3) + 1; // 1 to 3 glasses
      } else if (scenario === "random") {
        hydration = Math.floor(Math.random() * 10);
        sleep = Math.floor(Math.random() * 5) + 4;
        activity = Math.floor(Math.random() * 40);
        meals = Math.floor(Math.random() * 4);
        screenBreaks = Math.floor(Math.random() * 6);
        stressRelief = Math.random() > 0.5;
      }

      newLogs[dateStr] = {
        hydration,
        sleep,
        activity,
        meals,
        screenBreaks,
        stressRelief,
      };
    }

    const testData: WellnessData = {
      goals: DEFAULT_GOALS,
      logs: newLogs,
    };

    localStorage.setItem("wellnessData", JSON.stringify(testData));
    localStorage.setItem("wellnessOnboarded", "true");
    
    setStatus(`Successfully injected "${scenario}" data! Redirecting...`);
    
    setTimeout(() => {
      window.location.href = "/trends";
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-emerald-400">
          Developer Tools 🛠️
        </h1>
        <p className="text-slate-400 mt-2">
          Overwrite LocalStorage with 7 days of test data to observe the Streak Calendar and AI Insights.
        </p>
      </header>

      {status && (
        <div className="p-4 bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 rounded-xl font-medium">
          {status}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => injectData("perfect")}
          className="p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition text-left space-y-1"
        >
          <div className="font-semibold text-emerald-400">Perfect Week</div>
          <div className="text-xs text-slate-400">Hits 100% of all goals every day.</div>
        </button>

        <button
          onClick={() => injectData("lowSleep")}
          className="p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition text-left space-y-1"
        >
          <div className="font-semibold text-indigo-400">Low Sleep Scenario</div>
          <div className="text-xs text-slate-400">Averages 4-5 hours of sleep. Triggers sleep insight.</div>
        </button>

        <button
          onClick={() => injectData("lowActivity")}
          className="p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition text-left space-y-1"
        >
          <div className="font-semibold text-orange-400">Low Activity Scenario</div>
          <div className="text-xs text-slate-400">Averages ~10 mins of activity. Triggers activity insight.</div>
        </button>

        <button
          onClick={() => injectData("lowHydration")}
          className="p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition text-left space-y-1"
        >
          <div className="font-semibold text-blue-400">Low Hydration Scenario</div>
          <div className="text-xs text-slate-400">Averages 1-3 glasses. Triggers hydration insight.</div>
        </button>

        <button
          onClick={() => injectData("random")}
          className="p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition md:col-span-2 text-center"
        >
          <div className="font-semibold text-purple-400">Completely Random Week</div>
          <div className="text-xs text-slate-400">Might trigger fallback insights.</div>
        </button>
      </div>
    </div>
  );
}
