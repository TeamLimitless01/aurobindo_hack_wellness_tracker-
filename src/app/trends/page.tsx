"use client";

import React from "react";
import { WeeklyTrends } from "@/components/WeeklyTrends";
import { WeeklyInsights } from "@/components/WeeklyInsights";

export default function TrendsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8 animate-in fly-in-b-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold text-slate-100">Insights & Trends</h1>
        <p className="text-slate-400 mt-2">Analyze your weekly progress</p>
      </header>
      
      <WeeklyInsights />
      <WeeklyTrends />
    </div>
  );
}
