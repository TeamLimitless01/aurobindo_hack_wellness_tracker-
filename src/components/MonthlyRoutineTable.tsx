"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar, Check, X, SkipForward } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";
import { useRoutineData } from "@/context/RoutineContext";
import { getCategoryColor, formatTimeRange, sortRoutineItemsByTime } from "@/types";

interface MonthlyRoutineTableProps {
  onDateSelect?: (date: Date) => void;
}

const MonthlyRoutineTable: React.FC<MonthlyRoutineTableProps> = ({ onDateSelect }) => {
  const { 
    selectedMonth, 
    setSelectedMonth, 
    selectedDate, 
    setSelectedDate,
    getRoutineForDate,
    getCompletionStats,
    getMonthlyStats
  } = useRoutineData();
  
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set());

  const monthStart = startOfMonth(selectedMonth);
  const monthEnd = endOfMonth(selectedMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const monthlyStats = getMonthlyStats(selectedMonth);
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const toggleDayExpansion = (dayNumber: number) => {
    const newExpanded = new Set(expandedDays);
    if (newExpanded.has(dayNumber)) {
      newExpanded.delete(dayNumber);
    } else {
      newExpanded.add(dayNumber);
    }
    setExpandedDays(newExpanded);
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    onDateSelect?.(date);
  };

  const getCompletionColor = (completed: number, total: number) => {
    if (total === 0) return "bg-gray-100";
    const percentage = (completed / total) * 100;
    if (percentage === 100) return "bg-green-500";
    if (percentage >= 75) return "bg-green-400";
    if (percentage >= 50) return "bg-yellow-400";
    if (percentage >= 25) return "bg-orange-400";
    return "bg-red-400";
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
          <div className="flex items-center justify-between sm:justify-start gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedMonth(subMonths(selectedMonth, 1))}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="flex items-center gap-2">
                <Calendar size={20} className="text-blue-500" />
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                  {monthNames[selectedMonth.getMonth()]} {selectedMonth.getFullYear()}
                </h2>
              </div>
              <button
                onClick={() => setSelectedMonth(addMonths(selectedMonth, 1))}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
          
          <button
            onClick={() => setSelectedMonth(new Date())}
            className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
          >
            Today
          </button>
        </div>
        
        {/* Monthly Stats */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{monthlyStats.totalDays}</div>
            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Total Days</div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">{monthlyStats.completedDays}</div>
            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Active Days</div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">{monthlyStats.averageCompletion}%</div>
            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Avg Completion</div>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-3 sm:p-6">
        {/* Week day headers */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 sm:mb-4">
          {weekDays.map(day => (
            <div key={day} className="text-center text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400">
              {day}
            </div>
          ))}
        </div>
        
        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {daysInMonth.map((date, index) => {
            const dayNumber = date.getDate();
            const routine = getRoutineForDate(date);
            const stats = getCompletionStats(date);
            const isExpanded = expandedDays.has(dayNumber);
            const isSelected = isSameDay(date, selectedDate);
            const isToday = isSameDay(date, new Date());
            
            return (
              <div
                key={date.toISOString()}
                className={`relative border rounded-lg p-1 sm:p-2 min-h-[60px] sm:min-h-[100px] cursor-pointer transition-all hover:shadow-md ${
                  isSelected ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-200 dark:border-gray-600"
                } ${isToday ? "ring-2 ring-blue-300" : ""}`}
                onClick={() => handleDateClick(date)}
              >
                {/* Day number and completion indicator */}
                <div className="flex items-center justify-between mb-1 sm:mb-2">
                  <span className={`text-xs sm:text-sm font-semibold ${
                    isToday ? "text-blue-600 dark:text-blue-400" : "text-gray-900 dark:text-white"
                  }`}>
                    {dayNumber}
                  </span>
                  {stats.total > 0 && (
                    <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${getCompletionColor(stats.completed, stats.total)}`} />
                  )}
                </div>
                
                {/* Completion stats */}
                {stats.total > 0 && (
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1 sm:mb-2 hidden sm:block">
                    <div className="flex items-center gap-1">
                      <Check size={10} className="text-green-500" />
                      <span>{stats.completed}/{stats.total}</span>
                    </div>
                    {stats.skipped > 0 && (
                      <div className="flex items-center gap-1">
                        <SkipForward size={10} className="text-orange-500" />
                        <span>{stats.skipped}</span>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Routine items preview */}
                <div className="space-y-0.5 sm:space-y-1">
                  {sortRoutineItemsByTime(routine).slice(0, isExpanded ? routine.length : 1).map(item => (
                    <div
                      key={item.id}
                      className={`text-xs p-0.5 sm:p-1 rounded truncate ${getCategoryColor(item.category)}`}
                    >
                      <div className="flex items-center gap-0.5 sm:gap-1">
                        <span className="font-medium text-xs hidden sm:inline">{formatTimeRange(item.time, item.endTime)}</span>
                        <span className="font-medium text-xs sm:hidden">{item.time}</span>
                        {item.duration && <span className="hidden sm:inline">• {item.duration}min</span>}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Expand/Collapse button - only show on desktop */}
                {routine.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDayExpansion(dayNumber);
                    }}
                    className="mt-1 text-xs text-blue-500 hover:text-blue-700 hidden sm:block"
                  >
                    {isExpanded ? "Show less" : `+${routine.length - 1} more`}
                  </button>
                )}
                
                {/* Empty state */}
                {routine.length === 0 && (
                  <div className="text-xs text-gray-400 dark:text-gray-500 text-center py-1 sm:py-2 hidden sm:block">
                    No routine
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MonthlyRoutineTable;
