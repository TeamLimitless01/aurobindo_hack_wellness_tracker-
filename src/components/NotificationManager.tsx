"use client";

import React, { useEffect, useState } from "react";
import { startNotificationChecker } from "@/utils/notifications";

interface NotificationManagerProps {
  children: React.ReactNode;
}

const NotificationManager: React.FC<NotificationManagerProps> = ({ children }) => {
  const [isServiceWorkerRegistered, setIsServiceWorkerRegistered] = useState(false);

  useEffect(() => {
    // Register service worker
    const registerServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          console.log('Service Worker registered with scope:', registration.scope);
          setIsServiceWorkerRegistered(true);
          
          // Listen for messages from service worker
          navigator.serviceWorker.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'GET_SCHEDULED_NOTIFICATIONS') {
              // Send scheduled notifications to service worker
              import('@/utils/notifications').then(({ getScheduledNotifications }) => {
                const notifications = getScheduledNotifications();
                event.ports[0].postMessage({
                  type: 'SCHEDULED_NOTIFICATIONS',
                  notifications
                });
              });
            }
          });
        } catch (error) {
          console.error('Service Worker registration failed:', error);
        }
      }
    };

    registerServiceWorker();
    
    // Start notification checker
    const checkerInterval = startNotificationChecker();
    
    return () => {
      if (checkerInterval) {
        clearInterval(checkerInterval);
      }
    };
  }, []);

  return <>{children}</>;
};

export default NotificationManager;
