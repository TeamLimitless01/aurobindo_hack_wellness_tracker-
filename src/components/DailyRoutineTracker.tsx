"use client";

import React from "react";
import { Check, X, SkipForward, Clock, RotateCcw } from "lucide-react";
import { format } from "date-fns";
import { useRoutineData } from "@/context/RoutineContext";
import { getCategoryColor, formatTimeRange } from "@/types";

interface DailyRoutineTrackerProps {
  date?: Date;
}

const DailyRoutineTracker: React.FC<DailyRoutineTrackerProps> = ({ date }) => {
  const { 
    selectedDate, 
    getRoutineForDate,
    getCompletionForDate,
    toggleRoutineCompletion,
    skipRoutineItem,
    unskipRoutineItem,
    getCompletionStats
  } = useRoutineData();
  
  const trackDate = date || selectedDate;
  const routine = getRoutineForDate(trackDate);
  const completion = getCompletionForDate(trackDate);
  const stats = getCompletionStats(trackDate);
  
  const isToday = format(trackDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
  const isPast = trackDate < new Date();

  const getItemStatus = (itemId: string) => {
    if (completion.completedItems.includes(itemId)) return "completed";
    if (completion.skippedItems.includes(itemId)) return "skipped";
    return "pending";
  };

  const handleItemClick = (itemId: string) => {
    const status = getItemStatus(itemId);
    if (status === "completed") {
      toggleRoutineCompletion(trackDate, itemId);
    } else if (status === "skipped") {
      unskipRoutineItem(trackDate, itemId);
    } else {
      toggleRoutineCompletion(trackDate, itemId);
    }
  };

  const handleSkip = (e: React.MouseEvent, itemId: string) => {
    e.stopPropagation();
    const status = getItemStatus(itemId);
    if (status === "skipped") {
      unskipRoutineItem(trackDate, itemId);
    } else {
      skipRoutineItem(trackDate, itemId);
    }
  };

  const handleReset = () => {
    // Reset all items to pending
    completion.completedItems.forEach(itemId => {
      toggleRoutineCompletion(trackDate, itemId);
    });
    completion.skippedItems.forEach(itemId => {
      unskipRoutineItem(trackDate, itemId);
    });
  };

  const getProgressPercentage = () => {
    if (stats.total === 0) return 0;
    return Math.round((stats.completed / stats.total) * 100);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              {format(trackDate, "EEEE, MMMM d, yyyy")}
            </h2>
            {isToday && (
              <span className="inline-block mt-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-full">
                Today
              </span>
            )}
          </div>
          
          {stats.total > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <div className="text-2xl sm:text-2xl font-bold text-gray-900 dark:text-white">{getProgressPercentage()}%</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Complete</div>
              </div>
              
              {stats.completed > 0 && (
                <button
                  onClick={handleReset}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:text-gray-300 dark:hover:bg-gray-700 rounded-lg transition-colors self-center sm:self-auto"
                  title="Reset all items"
                >
                  <RotateCcw size={18} />
                </button>
              )}
            </div>
          )}
        </div>
        
        {/* Progress bar */}
        {stats.total > 0 && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              <span>{stats.completed} completed</span>
              <span>{stats.skipped} skipped</span>
              <span>{stats.total - stats.completed - stats.skipped} pending</span>
            </div>
          </div>
        )}
      </div>

      {/* Routine Items */}
      <div className="p-4 sm:p-6">
        {routine.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <Clock size={40} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2 dark:text-white">No routine for this day</h3>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
              Set up your weekly routine to start tracking your daily progress.
            </p>
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {routine.map((item) => {
              const status = getItemStatus(item.id);
              
              return (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    status === "completed" 
                      ? "border-green-200 bg-green-50 dark:border-green-700 dark:bg-green-900/20" 
                      : status === "skipped"
                      ? "border-orange-200 bg-orange-50 dark:border-orange-700 dark:bg-orange-900/20"
                      : "border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3 sm:mb-0">
                    {/* Status icon */}
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      status === "completed"
                        ? "bg-green-500 text-white"
                        : status === "skipped"
                        ? "bg-orange-500 text-white"
                        : "bg-gray-200 text-gray-400"
                    }`}>
                      {status === "completed" ? (
                        <Check size={16} />
                      ) : status === "skipped" ? (
                        <SkipForward size={14} />
                      ) : (
                        <div className="w-2 h-2 bg-current rounded-full" />
                      )}
                    </div>
                    
                    {/* Item details */}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 dark:text-white text-sm sm:text-base truncate">{item.title}</div>
                      <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                        <span className="whitespace-nowrap">{formatTimeRange(item.time, item.endTime)}</span>
                        {item.duration && <span className="whitespace-nowrap">• {item.duration}min</span>}
                        <span className={`px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                          {item.category}
                        </span>
                      </div>
                      {item.description && (
                        <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{item.description}</div>
                      )}
                    </div>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    {status === "pending" && (
                      <button
                        onClick={(e) => handleSkip(e, item.id)}
                        className="p-2 text-orange-500 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded-lg transition-colors"
                        title="Skip this item"
                      >
                        <SkipForward size={16} />
                      </button>
                    )}
                    
                    {status === "completed" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleRoutineCompletion(trackDate, item.id);
                        }}
                        className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        title="Mark as incomplete"
                      >
                        <X size={16} />
                      </button>
                    )}
                    
                    {status === "skipped" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          unskipRoutineItem(trackDate, item.id);
                        }}
                        className="p-2 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                        title="Unskip this item"
                      >
                        <RotateCcw size={16} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyRoutineTracker;
