"use client";

import React, { useState } from "react";
import { Plus, Clock, Edit2, Trash2, X, Copy } from "lucide-react";
import { RoutineItem, DayOfWeek, getCategoryColor, calculateDuration, formatTimeRange } from "@/types";
import { useRoutineData } from "@/context/RoutineContext";

interface RoutineSetupProps {
  day: DayOfWeek;
}

const RoutineSetup: React.FC<RoutineSetupProps> = ({ day }) => {
  const { 
    getRoutineForDay, 
    addRoutineItem, 
    updateRoutineItem, 
    deleteRoutineItem,
    copyRoutineFromDay
  } = useRoutineData();
  
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState<RoutineItem | null>(null);
  const [showCopyOptions, setShowCopyOptions] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    time: "09:00",
    endTime: "",
    duration: 30,
    category: "other" as RoutineItem['category'],
  });

  const routineItems = getRoutineForDay(day);
  const dayLabel = day.charAt(0).toUpperCase() + day.slice(1);
  
  const daysOfWeek: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const otherDays = daysOfWeek.filter(d => d !== day);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingItem) {
      updateRoutineItem(day, editingItem.id, formData);
      setEditingItem(null);
    } else {
      addRoutineItem(day, formData);
    }
    
    setFormData({
      title: "",
      description: "",
      time: "09:00",
      endTime: "",
      duration: 30,
      category: "other",
    });
    setIsAddingItem(false);
  };

  const handleEdit = (item: RoutineItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || "",
      time: item.time,
      endTime: item.endTime || "",
      duration: item.duration || 30,
      category: item.category,
    });
    setIsAddingItem(true);
  };

  const handleCancel = () => {
    setIsAddingItem(false);
    setEditingItem(null);
    setFormData({
      title: "",
      description: "",
      time: "09:00",
      endTime: "",
      duration: 30,
      category: "other",
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">{dayLabel}</h3>
        {!isAddingItem && (
          <div className="flex gap-2">
            <button
              onClick={() => setIsAddingItem(true)}
              className="flex items-center gap-2 px-2 py-1.5 sm:px-3 sm:py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-xs sm:text-sm"
            >
              <Plus size={14} className="sm:size-16" />
              <span className="hidden sm:inline">Add Item</span>
              <span className="sm:hidden">Add</span>
            </button>
            
            <button
              onClick={() => setShowCopyOptions(!showCopyOptions)}
              className="flex items-center gap-2 px-2 py-1.5 sm:px-3 sm:py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-xs sm:text-sm"
            >
              <Copy size={14} className="sm:size-16" />
              <span className="hidden sm:inline">Copy</span>
              <span className="sm:hidden">Copy</span>
            </button>
          </div>
        )}
      </div>

      {isAddingItem && (
        <form onSubmit={handleSubmit} className="mb-6 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-white"
                placeholder="Morning exercise"
              />
            </div>
            
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Start Time *
              </label>
              <input
                type="time"
                required
                value={formData.time}
                onChange={(e) => {
                  const newStartTime = e.target.value;
                  setFormData({ ...formData, time: newStartTime });
                  
                  // Auto-calculate duration if both times are set
                  if (formData.endTime && newStartTime) {
                    const calculatedDuration = calculateDuration(newStartTime, formData.endTime);
                    setFormData(prev => ({ ...prev, time: newStartTime, duration: calculatedDuration }));
                  }
                }}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                End Time
              </label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => {
                  const newEndTime = e.target.value;
                  setFormData({ ...formData, endTime: newEndTime });
                  
                  // Auto-calculate duration if both times are set
                  if (newEndTime && formData.time) {
                    const calculatedDuration = calculateDuration(formData.time, newEndTime);
                    setFormData(prev => ({ ...prev, endTime: newEndTime, duration: calculatedDuration }));
                  }
                }}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Duration (minutes)
              </label>
              <input
                type="number"
                min="1"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 30 })}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as RoutineItem['category'] })}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-white"
              >
                <option value="health">Health</option>
                <option value="work">Work</option>
                <option value="personal">Personal</option>
                <option value="exercise">Exercise</option>
                <option value="learning">Learning</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="sm:col-span-2">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-white"
                rows={2}
                placeholder="Optional description..."
              />
            </div>
          </div>
          
          <div className="flex gap-2 mt-4">
            <button
              type="submit"
              className="flex-1 px-3 py-2 sm:px-4 sm:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors dark:bg-blue-600 dark:hover:bg-blue-700 text-sm font-medium"
            >
              {editingItem ? "Update" : "Add"} Item
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-3 py-2 sm:px-4 sm:py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Copy Options */}
      {showCopyOptions && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
          <h4 className="text-sm font-semibold text-green-800 dark:text-green-200 mb-3">
            Copy routine from another day
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {otherDays.map((sourceDay) => {
              const sourceRoutine = getRoutineForDay(sourceDay);
              const hasItems = sourceRoutine.length > 0;
              
              return (
                <button
                  key={sourceDay}
                  onClick={() => {
                    if (hasItems) {
                      copyRoutineFromDay(sourceDay, day);
                      setShowCopyOptions(false);
                    }
                  }}
                  disabled={!hasItems}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    hasItems
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-600 dark:text-gray-500"
                  }`}
                >
                  {sourceDay.charAt(0).toUpperCase() + sourceDay.slice(1)}
                  {hasItems && (
                    <span className="block text-xs opacity-75">
                      {sourceRoutine.length} items
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-green-600 dark:text-green-400 mt-2">
            This will replace all existing routine items for {dayLabel}
          </p>
        </div>
      )}

      <div className="space-y-2 sm:space-y-3">
        {routineItems.length === 0 && !isAddingItem && (
          <p className="text-gray-500 dark:text-gray-400 text-center py-6 sm:py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-sm sm:text-base">
            No routine items for {dayLabel}. Click "Add Item" or "Copy" from another day to get started.
          </p>
        )}
        
        {routineItems.map((item) => (
          <div
            key={item.id}
            className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-3 rounded-lg border ${getCategoryColor(item.category)}`}
          >
            <div className="flex items-center gap-3 mb-2 sm:mb-0">
              <Clock size={14} className="sm:size-16" />
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
            
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={() => handleEdit(item)}
                className="p-1.5 hover:bg-white hover:bg-opacity-50 rounded transition-colors dark:hover:bg-gray-700"
              >
                <Edit2 size={12} className="sm:size-14" />
              </button>
              <button
                onClick={() => deleteRoutineItem(day, item.id)}
                className="p-1.5 hover:bg-white hover:bg-opacity-50 rounded transition-colors dark:hover:bg-gray-700"
              >
                <Trash2 size={12} className="sm:size-14" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoutineSetup;
