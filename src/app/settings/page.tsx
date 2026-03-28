"use client";

import React from "react";
import { GoalSettings } from "@/components/GoalSettings";

export default function SettingsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8 animate-in fly-in-b-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold text-slate-100">Settings</h1>
        <p className="text-slate-400 mt-2">Manage your goals and preferences</p>
      </header>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <GoalSettings />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm mt-8 space-y-4">
        <h3 className="font-semibold text-lg text-rose-400">Danger Zone</h3>
        <p className="text-sm text-slate-400">
          This will permanently delete all your tracking data and goals.
        </p>
        <button
          onClick={() => {
            if (window.confirm("Are you sure? This cannot be undone.")) {
              localStorage.removeItem("wellnessData");
              localStorage.removeItem("wellnessOnboarded");
              window.location.href = "/";
            }
          }}
          className="bg-rose-500/10 text-rose-400 border border-rose-500/30 font-medium px-4 py-2 rounded-xl hover:bg-rose-500/20 transition-colors"
        >
          Reset All Data
        </button>
      </div>
    </div>
  );
}
