const CACHE_NAME = 'smartcity-v2';
const STATIC_CACHE = 'smartcity-static-v2';
const DYNAMIC_CACHE = 'smartcity-dynamic-v2';

const urlsToCache = [
  '/',
  '/manifest.json',
  '/smartcity-icon-192.png',
  '/smartcity-icon-512.png',
  '/login',
  '/dashboard',
  '/report',
  '/cases',
  '/map',
  '/rewards',
  '/settings'
];

// Install Service Worker
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Activate Service Worker
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Strategy: Network First for API, Cache First for Static
self.addEventListener('fetch', function(event) {
  const { request } = event;
  const url = new URL(request.url);

  // API requests - Network First with Cache Fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE)
            .then(cache => cache.put(request, responseClone));
          return response;
        })
        .catch(() => {
          return caches.match(request)
            .then(response => {
              if (response) {
                return response;
              }
              // Return offline page for API failures
              return new Response(
                JSON.stringify({ error: 'Offline - Please try again when connected' }),
                { headers: { 'Content-Type': 'application/json' } }
              );
            });
        })
    );
    return;
  }

  // Static assets - Cache First
  event.respondWith(
    caches.match(request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(request)
          .then(response => {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE)
              .then(cache => cache.put(request, responseClone));
            return response;
          })
          .catch(() => {
            // Return offline page for navigation requests
            if (request.mode === 'navigate') {
              return caches.match('/');
            }
          });
      })
  );
});

// Push Notification Handler
self.addEventListener('push', function(event) {
  const options = {
    body: event.data ? event.data.text() : 'New update from SmartCity',
    icon: '/smartcity-icon-192.png',
    badge: '/smartcity-icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore', 
        title: 'View Details',
        icon: '/smartcity-icon-192.png'
      },
      {
        action: 'close', 
        title: 'Close',
        icon: '/smartcity-icon-192.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('SmartCity Alert', options)
  );
});

// Notification Click Handler
self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/dashboard')
    );
  }
});

// Background Sync for Offline Reports
self.addEventListener('sync', function(event) {
  if (event.tag === 'background-sync-reports') {
    event.waitUntil(syncReports());
  }
});

async function syncReports() {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    const requests = await cache.keys();
    
    for (const request of requests) {
      if (request.url.includes('/api/v1/cases') && request.method === 'POST') {
        try {
          await fetch(request);
          await cache.delete(request);
        } catch (error) {
          console.log('Sync failed for request:', request.url);
        }
      }
    }
  } catch (error) {
    console.log('Background sync failed:', error);
  }
}