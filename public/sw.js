// Arogyam Clinic Service Worker
// Version: 1.0.0
// Purpose: Caching, offline support, and performance optimization

// Simple logger for service worker
const logger = {
  info: (msg, ...args) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[SW] ${msg}`, ...args);
    }
  },
  error: (msg, ...args) => {
    console.error(`[SW] ${msg}`, ...args);
  }
};

const CACHE_NAME = 'arogyam-clinic-v1.0.0';
const STATIC_CACHE = 'arogyam-static-v1.0.0';
const DYNAMIC_CACHE = 'arogyam-dynamic-v1.0.0';

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/apple-touch-icon.png',
  '/manifest.json',
  '/images/medical-consultation-room.jpg'
];

// Images to cache on demand (not immediately)
const IMAGE_FILES = [
  '/images/dr-kajal-kumari.jpg'
];

// Critical CSS and JS files
const CRITICAL_FILES = [
  '/assets/index.css',
  '/assets/index.js'
];

// API endpoints to cache
const API_CACHE = [
  '/api/consultations',
  '/api/treatments',
  '/api/contact'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => {
        logger.info('Service Worker: Caching static files');
        return cache.addAll(STATIC_FILES);
      }),
      caches.open('critical-cache').then(cache => {
        logger.info('Service Worker: Caching critical files');
        return cache.addAll(CRITICAL_FILES);
      })
    ])
  );
  
  // Activate immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
                     if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
           logger.info('Service Worker: Deleting old cache', cacheName);
           return caches.delete(cacheName);
         }
          })
        );
      })
             .then(() => {
         logger.info('Service Worker: Activated and ready');
         return self.clients.claim();
       })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle different types of requests
  if (url.origin === self.location.origin) {
    // Same origin requests
    event.respondWith(handleSameOriginRequest(request));
  } else if (url.origin.includes('supabase.co')) {
    // Supabase API requests
    event.respondWith(handleSupabaseRequest(request));
  } else if (url.origin.includes('fonts.googleapis.com') || url.origin.includes('fonts.gstatic.com')) {
    // Google Fonts
    event.respondWith(handleFontRequest(request));
  } else {
    // Other external requests
    event.respondWith(handleExternalRequest(request));
  }
});

// Handle same origin requests
async function handleSameOriginRequest(request) {
  try {
    // Try cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Try network
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
      
      // Special handling for doctor's image - cache it for future use
      if (request.url.includes('dr-kajal-kumari.jpg')) {
        const imageCache = await caches.open(STATIC_CACHE);
        imageCache.put(request, networkResponse.clone());
      }
    }
    
    return networkResponse;
  } catch (error) {
    // Return cached version if available
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page
    return caches.match('/offline.html');
  }
}

// Handle Supabase requests
async function handleSupabaseRequest(request) {
  try {
    // Try network first for real-time data
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Try cache as fallback
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// Handle font requests
async function handleFontRequest(request) {
  try {
    // Try cache first for fonts
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Try network
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Return cached version if available
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// Handle external requests
async function handleExternalRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Try cache as fallback
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

// Background sync function
async function doBackgroundSync() {
  try {
         // Sync offline data when connection is restored
     logger.info('Service Worker: Background sync started');
    
    // You can implement offline data sync here
    // For example, sync consultation bookings made offline
    
     } catch (error) {
     logger.error('Service Worker: Background sync failed', error);
   }
}

// Push notification handling
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/favicon.svg',
      badge: '/favicon.svg',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      }
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')
  );
});

// Message handling from main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});
