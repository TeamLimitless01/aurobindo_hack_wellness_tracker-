const CACHE_NAME = "wellness-tracker-v1";
const STATIC_ASSETS = ["/", "/routine", "/trends", "/settings"];

// Install event - cache resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch event - serve from cache when offline
self.addEventListener("fetch", (event) => {
  // Only handle GET requests
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const networkFetch = fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => cached);

      return cached || networkFetch;
    })
  );
});

// Background sync for notifications
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-notifications') {
    event.waitUntil(syncNotifications());
  }
});

// Push notification event
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      data: data.data,
      actions: data.actions || []
    };
    
    // Add vibrate if supported and provided
    if (data.vibrate) {
      options.vibrate = data.vibrate;
    }
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action) {
    // Handle notification actions
    switch (event.action) {
      case 'complete':
        // Open the app and mark routine as complete
        event.waitUntil(
          clients.openWindow('/routine')
        );
        break;
      case 'snooze':
        // Snooze for 5 minutes
        setTimeout(() => {
          self.registration.showNotification(event.notification.title, {
            body: event.notification.body,
            icon: '/favicon.ico',
            tag: event.notification.tag,
            renotify: true
          });
        }, 5 * 60 * 1000);
        break;
      default:
        // Open the app
        event.waitUntil(
          clients.openWindow('/routine')
        );
    }
  } else {
    // Just open the app
    event.waitUntil(
      clients.openWindow('/routine')
    );
  }
});

// Sync notifications from localStorage
async function syncNotifications() {
  try {
    // This would typically sync with a server
    // For now, we'll just ensure notifications are scheduled
    console.log('Syncing notifications...');
  } catch (error) {
    console.error('Error syncing notifications:', error);
  }
}

// Check and trigger notifications
setInterval(() => {
  checkAndTriggerNotifications();
}, 60000); // Check every minute

async function checkAndTriggerNotifications() {
  try {
    // Get scheduled notifications from IndexedDB or sync with client
    const scheduledNotifications = await getScheduledNotifications();
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const currentDay = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][now.getDay()];
    
    scheduledNotifications.forEach(notification => {
      if (notification.enabled && 
          notification.time === currentTime && 
          notification.days.includes(currentDay)) {
        
        self.registration.showNotification(notification.title, {
          body: notification.body,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          vibrate: [200, 100, 200],
          tag: notification.id,
          renotify: true,
          requireInteraction: true,
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
  } catch (error) {
    console.error('Error checking notifications:', error);
  }
}

// Helper function to get scheduled notifications
async function getScheduledNotifications() {
  // In a real implementation, this would sync with IndexedDB
  // For now, we'll use a message-based approach to get data from client
  const allClients = await clients.matchAll();
  
  for (const client of allClients) {
    // Send message to client to get scheduled notifications
    client.postMessage({
      type: 'GET_SCHEDULED_NOTIFICATIONS'
    });
  }
  
  return [];
}

// Listen for messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SCHEDULED_NOTIFICATIONS') {
    // Store notifications for checking
    globalThis.scheduledNotifications = event.data.notifications;
  }
});
