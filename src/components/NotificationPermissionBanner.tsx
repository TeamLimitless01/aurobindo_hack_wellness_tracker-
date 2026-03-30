"use client";

import React, { useState, useEffect } from "react";
import { Bell, X, AlertCircle } from "lucide-react";
import { getNotificationPermission, requestNotificationPermission } from "@/utils/notifications";

const NotificationPermissionBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [permission, setPermission] = useState(getNotificationPermission());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Show banner if permission is default (not requested yet) and user hasn't dismissed it
    const hasDismissed = localStorage.getItem('notificationBannerDismissed');
    if (permission.default && !hasDismissed) {
      setShowBanner(true);
    }
  }, [permission]);

  const handleEnableNotifications = async () => {
    setIsLoading(true);
    try {
      const result = await requestNotificationPermission();
      setPermission(result);
      if (result.granted) {
        setShowBanner(false);
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('notificationBannerDismissed', 'true');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
            <Bell size={16} className="text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100">
              Enable Routine Reminders
            </h3>
            <button
              onClick={handleDismiss}
              className="p-1 hover:bg-blue-100 dark:hover:bg-blue-800 rounded transition-colors"
            >
              <X size={14} className="text-blue-600 dark:text-blue-400" />
            </button>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Get notified at your scheduled routine times, even when your device is locked. Never miss a routine again!
            </p>
            
            <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-300">
              <AlertCircle size={12} />
              <span>Works in background and when app is closed</span>
            </div>
          </div>
          
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleEnableNotifications}
              disabled={isLoading}
              className="px-3 py-1.5 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Enabling...' : 'Enable Notifications'}
            </button>
            <button
              onClick={handleDismiss}
              className="px-3 py-1.5 bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 text-sm font-medium rounded-lg hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPermissionBanner;
