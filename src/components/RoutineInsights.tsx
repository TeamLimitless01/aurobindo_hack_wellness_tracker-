"use client";

import React, { useState, useMemo } from "react";
import { BarChart3, Calendar, Clock, Target, TrendingUp, Award, Activity } from "lucide-react";
import { format, subDays, startOfMonth, endOfMonth } from "date-fns";
import { useRoutineData } from "@/context/RoutineContext";
import { calculateRoutineInsights, getWeeklyCompletionData, type RoutineInsights } from "@/types";

const RoutineInsights: React.FC = () => {
  const { routineData, selectedMonth } = useRoutineData();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('month');

  const insights = useMemo(() => {
    if (!routineData) return null;
    
    let startDate: Date;
    let endDate: Date = new Date();
    
    switch (timeRange) {
      case 'week':
        startDate = subDays(endDate, 7);
        break;
      case 'month':
        startDate = startOfMonth(selectedMonth);
        endDate = endOfMonth(selectedMonth);
        break;
      case 'all':
        startDate = new Date(0); // Beginning of time
        break;
    }
    
    return calculateRoutineInsights(routineData, startDate, endDate);
  }, [routineData, selectedMonth, timeRange]);

  const weeklyData = useMemo(() => {
    if (!routineData) return [];
    return getWeeklyCompletionData(routineData, 8);
  }, [routineData]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'health': return '🏃';
      case 'work': return '💼';
      case 'personal': return '👤';
      case 'exercise': return '💪';
      case 'learning': return '📚';
      default: return '📋';
    }
  };

  const getCompletionColor = (rate: number) => {
    if (rate >= 80) return 'text-green-600 dark:text-green-400';
    if (rate >= 60) return 'text-yellow-600 dark:text-yellow-400';
    if (rate >= 40) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getProgressBarColor = (rate: number) => {
    if (rate >= 80) return 'bg-green-500';
    if (rate >= 60) return 'bg-yellow-500';
    if (rate >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  if (!insights) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="text-center py-8">
          <BarChart3 size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2 dark:text-white">No Data Available</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Start tracking your routine to see insights here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Time Range Selector */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Routine Insights</h2>
          <div className="flex gap-2">
            {(['week', 'month', 'all'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <Target className="text-blue-500" size={20} />
            <span className={`text-2xl font-bold ${getCompletionColor(insights.weeklyStats.averageCompletion)}`}>
              {insights.weeklyStats.averageCompletion}%
            </span>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Completion Rate</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <Activity className="text-green-500" size={20} />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {insights.weeklyStats.activeDays}
            </span>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Active Days</div>
        </div>

    {/*     <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <Award className="text-purple-500" size={20} />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {insights.streakData.currentStreak}
            </span>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Current Streak</div>
        </div> */}

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <Clock className="text-orange-500" size={20} />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {insights.timeStats.averageDuration}m
            </span>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Avg Duration</div>
        </div>
      </div>

      {/* Category Performance */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Category Performance</h3>
        <div className="space-y-3">
          {Object.entries(insights.categoryStats)
            .filter(([_, stats]) => stats.total > 0)
            .sort((a, b) => b[1].total - a[1].total)
            .map(([category, stats]) => (
              <div key={category} className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-lg">{getCategoryIcon(category)}</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                    {category}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    ({stats.completed}/{stats.total})
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${getProgressBarColor(stats.completionRate)}`}
                      style={{ width: `${stats.completionRate}%` }}
                    />
                  </div>
                  <span className={`text-sm font-medium ${getCompletionColor(stats.completionRate)}`}>
                    {stats.completionRate}%
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>

     

      {/* Day of Week Analysis */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Day of Week Analysis</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {Object.entries(insights.dayOfWeekStats)
            .sort((a, b) => {
              const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
              return days.indexOf(a[0]) - days.indexOf(b[0]);
            })
            .map(([day, stats]) => (
              <div key={day} className="border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                <div className="text-sm font-medium text-gray-900 dark:text-white capitalize mb-1">
                  {day}
                </div>
                <div className={`text-lg font-bold ${getCompletionColor(stats.completionRate)}`}>
                  {stats.completionRate}%
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {stats.totalRoutines} routines
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Time Analysis */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Time Analysis</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {insights.timeStats.earliestRoutine}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Earliest Start</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {insights.timeStats.latestRoutine}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Latest Start</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {Math.round(insights.timeStats.totalDuration / 60)}h {insights.timeStats.totalDuration % 60}m
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Time</div>
          </div>
        </div>
      </div>

      {/* Streak Information */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Streak Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/*     <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {insights.streakData.currentStreak}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Current Streak</div>
          </div> */}
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {insights.streakData.longestStreak}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Longest Streak</div>
          </div>
        </div>
        {insights.streakData.lastActiveDate && (
          <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
            Last active: {format(new Date(insights.streakData.lastActiveDate), 'MMM d, yyyy')}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoutineInsights;
