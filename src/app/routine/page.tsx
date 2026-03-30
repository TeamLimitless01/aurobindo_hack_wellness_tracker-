"use client";

import React, { useState } from "react";
import { Calendar, Settings, ListTodo } from "lucide-react";
import RoutineSetup from "@/components/RoutineSetup";
import MonthlyRoutineTable from "@/components/MonthlyRoutineTable";
import DailyRoutineTracker from "@/components/DailyRoutineTracker";
import { DayOfWeek } from "@/types";

const RoutinePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'setup' | 'monthly' | 'daily'>('monthly');
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('monday');

  const tabs = [
    { id: 'monthly' as const, label: 'Monthly View', icon: Calendar },
    { id: 'daily' as const, label: 'Daily Tracker', icon: ListTodo },
    { id: 'setup' as const, label: 'Setup Routine', icon: Settings },
  ];

  const daysOfWeek: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Daily Routine Tracker</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
            Plan your weekly routine and track your daily progress throughout the month.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-6 sm:mb-8 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg overflow-x-auto">
          <div className="flex space-x-1 min-w-max sm:min-w-0 sm:w-full sm:justify-around">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-white text-blue-600 shadow-sm dark:bg-gray-700 dark:text-blue-400"
                      : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                  }`}
                >
                  <Icon size={18} />
                  <span className="hidden xs:inline">{tab.label}</span>
                  <span className="xs:hidden">{tab.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'monthly' && (
            <MonthlyRoutineTable 
              onDateSelect={(date) => {
                setActiveTab('daily');
              }}
            />
          )}

          {activeTab === 'daily' && (
            <DailyRoutineTracker />
          )}

          {activeTab === 'setup' && (
            <div>
              {/* Day selector */}
              <div className="mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 dark:text-white">Setup Weekly Routine</h2>
                <div className="flex flex-wrap gap-2">
                  {daysOfWeek.map((day) => (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      className={`px-3 py-2 sm:px-4 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                        selectedDay === day
                          ? "bg-blue-500 text-white"
                          : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                      }`}
                    >
                      {day.charAt(0).toUpperCase() + day.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Routine setup for selected day */}
              <RoutineSetup day={selectedDay} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoutinePage;
