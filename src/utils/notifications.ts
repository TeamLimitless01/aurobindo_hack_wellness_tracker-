// Notification utilities for routine reminders

export interface CustomNotificationOptions extends NotificationOptions {
  vibrate?: number[];
  renotify?: boolean;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  action: string;
  title: string;
}

export interface NotificationPermission {
  granted: boolean;
  denied: boolean;
  default: boolean;
}

export interface ScheduledNotification {
  id: string;
  title: string;
  body: string;
  time: string; // HH:MM format
  routineId: string;
  days: string[]; // Days of week
  enabled: boolean;
}

export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (typeof window === 'undefined') {
    // Server-side rendering, return default state
    return { granted: false, denied: false, default: false };
  }
  
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return { granted: false, denied: false, default: false };
  }

  const permission = await Notification.requestPermission();
  return {
    granted: permission === 'granted',
    denied: permission === 'denied',
    default: permission === 'default'
  };
};

export const getNotificationPermission = (): NotificationPermission => {
  if (typeof window === 'undefined') {
    // Server-side rendering, return default state
    return { granted: false, denied: false, default: false };
  }
  
  if (!('Notification' in window)) {
    return { granted: false, denied: false, default: false };
  }

  const permission = Notification.permission;
  return {
    granted: permission === 'granted',
    denied: permission === 'denied',
    default: permission === 'default'
  };
};

export const showNotification = (title: string, body: string, options?: CustomNotificationOptions) => {
  if (typeof window === 'undefined') {
    // Server-side rendering, cannot show notifications
    return null;
  }
  
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return null;
  }

  const notification = new Notification(title, {
    body,
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    requireInteraction: false,
    ...options
  });

  // Vibrate separately if supported and vibrate option is provided
  if ('vibrate' in navigator && options?.vibrate) {
    navigator.vibrate(options.vibrate);
  }

  return notification;
};

export const scheduleNotification = (notification: ScheduledNotification): void => {
  if (typeof window === 'undefined') {
    // Server-side rendering, cannot schedule notifications
    return;
  }
  
  // Store in localStorage for service worker to access
  const scheduledNotifications = getScheduledNotifications();
  const existingIndex = scheduledNotifications.findIndex(n => n.id === notification.id);
  
  if (existingIndex >= 0) {
    scheduledNotifications[existingIndex] = notification;
  } else {
    scheduledNotifications.push(notification);
  }
  
  localStorage.setItem('scheduledNotifications', JSON.stringify(scheduledNotifications));
  
  // Register with service worker if available
  if ('serviceWorker' in navigator && navigator.serviceWorker.ready) {
    navigator.serviceWorker.ready.then(registration => {
      // Use type assertion to access sync property
      (registration as any).sync.register('sync-notifications');
    });
  }
};

export const getScheduledNotifications = (): ScheduledNotification[] => {
  try {
    const stored = localStorage.getItem('scheduledNotifications');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading scheduled notifications:', error);
    return [];
  }
};

export const removeScheduledNotification = (id: string): void => {
  const scheduledNotifications = getScheduledNotifications();
  const filtered = scheduledNotifications.filter(n => n.id !== id);
  localStorage.setItem('scheduledNotifications', JSON.stringify(filtered));
};

export const updateScheduledNotification = (id: string, updates: Partial<ScheduledNotification>): void => {
  const scheduledNotifications = getScheduledNotifications();
  const index = scheduledNotifications.findIndex(n => n.id === id);
  
  if (index >= 0) {
    scheduledNotifications[index] = { ...scheduledNotifications[index], ...updates };
    localStorage.setItem('scheduledNotifications', JSON.stringify(scheduledNotifications));
  }
};

export const enableNotificationForRoutine = (routineId: string, title: string, time: string, days: string[]): void => {
  const notification: ScheduledNotification = {
    id: `routine-${routineId}`,
    title: `Routine Reminder: ${title}`,
    body: `It's time for ${title}! Stay on track with your daily routine.`,
    time,
    routineId,
    days,
    enabled: true
  };
  
  scheduleNotification(notification);
};

export const disableNotificationForRoutine = (routineId: string): void => {
  removeScheduledNotification(`routine-${routineId}`);
};

export const checkNotificationTime = (): void => {
  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  const currentDay = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][now.getDay()];
  
  const scheduledNotifications = getScheduledNotifications();
  
  scheduledNotifications.forEach(notification => {
    if (notification.enabled && 
        notification.time === currentTime && 
        notification.days.includes(currentDay)) {
      showNotification(notification.title, notification.body, {
        tag: notification.id,
        renotify: true,
        actions: [
          {
            action: 'complete',
            title: 'Mark Complete'
          },
          {
            action: 'snooze',
            title: 'Snooze 5 min'
          }
        ]
      });
    }
  });
};

// Check and trigger notifications
export const startNotificationChecker = (): NodeJS.Timeout | null => {
  if (typeof window === 'undefined') {
    // Server-side rendering, cannot start checker
    return null;
  }
  
  return setInterval(checkNotificationTime, 60000); // Check every minute
};
