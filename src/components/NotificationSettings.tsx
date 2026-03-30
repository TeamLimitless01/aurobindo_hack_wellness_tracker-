"use client";

import React, { useState, useEffect } from "react";
import { Bell, BellOff, Clock, Check, X } from "lucide-react";
import { 
  requestNotificationPermission, 
  getNotificationPermission,
  enableNotificationForRoutine,
  disableNotificationForRoutine,
  getScheduledNotifications,
  type ScheduledNotification
} from "@/utils/notifications";

interface NotificationSettingsProps {
  routineId: string;
  title: string;
  time: string;
  days: string[];
  onNotificationChange?: (enabled: boolean) => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  routineId,
  title,
  time,
  days,
  onNotificationChange
}) => {
  const [enabled, setEnabled] = useState(false);
  const [permission, setPermission] = useState(getNotificationPermission());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if notification is already enabled for this routine
    const scheduledNotifications = getScheduledNotifications();
    const existingNotification = scheduledNotifications.find(n => n.routineId === routineId);
    setEnabled(existingNotification?.enabled || false);
  }, [routineId]);

  const handleEnableNotifications = async () => {
    setIsLoading(true);
    
    try {
      if (!permission.granted) {
        const result = await requestNotificationPermission();
        setPermission(result);
        
        if (!result.granted) {
          setIsLoading(false);
          return;
        }
      }

      if (enabled) {
        disableNotificationForRoutine(routineId);
        setEnabled(false);
      } else {
        enableNotificationForRoutine(routineId, title, time, days);
        setEnabled(true);
      }
      
      onNotificationChange?.(!enabled);
    } catch (error) {
      console.error('Error toggling notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPermissionMessage = () => {
    if (permission.granted) return null;
    if (permission.denied) return "Notifications are blocked in your browser settings";
    return "Enable notifications to get routine reminders";
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${enabled ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-gray-700'}`}>
            {enabled ? <Bell size={16} className="text-green-600 dark:text-green-400" /> : <BellOff size={16} className="text-gray-500" />}
          </div>
          <div>
            <div className="font-medium text-gray-900 dark:text-white">Routine Reminders</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Get notified at {time} on {days.map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(', ')}
            </div>
          </div>
        </div>
        
        <button
          onClick={handleEnableNotifications}
          disabled={permission.denied || isLoading}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            enabled ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-600'
          } ${permission.denied ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              enabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-2 w-2 animate-pulse rounded-full bg-white opacity-75" />
            </div>
          )}
        </button>
      </div>
      
      {getPermissionMessage() && (
        <div className="mt-3 text-xs text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 p-2 rounded">
          {getPermissionMessage()}
        </div>
      )}
      
      {enabled && (
        <div className="mt-3 flex items-center gap-2 text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-2 rounded">
          <Check size={12} />
          <span>Notifications enabled - you'll be reminded at the scheduled time</span>
        </div>
      )}
    </div>
  );
};

export default NotificationSettings;
