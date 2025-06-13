const CACHE_NAME = 'smartcity-v3';
const STATIC_CACHE = 'smartcity-static-v3';
const DYNAMIC_CACHE = 'smartcity-dynamic-v3';
const OFFLINE_PAGE = '/offline';

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
  '/settings',
  '/admin/login',
  '/employee/login',
  '/signup'
];

// Essential resources for offline functionality
const ESSENTIAL_RESOURCES = [
  '/',
  '/manifest.json',
  '/smartcity-icon-192.png',
  '/smartcity-icon-512.png'
];

// Install Service Worker
self.addEventListener('install', function(event) {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => {
        return cache.addAll(ESSENTIAL_RESOURCES);
      }),
      caches.open(DYNAMIC_CACHE).then(cache => {
        return cache.addAll(urlsToCache.filter(url => !ESSENTIAL_RESOURCES.includes(url)));
      })
    ])
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

// Enhanced Fetch Strategy for PWA compliance
self.addEventListener('fetch', function(event) {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (request.url.startsWith('http') && !request.url.startsWith(self.location.origin)) {
    return;
  }

  // API requests - Network First with Cache Fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Only cache successful responses
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE)
              .then(cache => cache.put(request, responseClone));
          }
          return response;
        })
        .catch(() => {
          return caches.match(request)
            .then(response => {
              if (response) {
                return response;
              }
              // Return meaningful offline response
              return new Response(
                JSON.stringify({ 
                  error: 'Offline mode - Data may be outdated',
                  offline: true,
                  timestamp: Date.now()
                }),
                { 
                  headers: { 'Content-Type': 'application/json' },
                  status: 503,
                  statusText: 'Service Unavailable'
                }
              );
            });
        })
    );
    return;
  }

  // Static assets and navigation - Cache First with Network Fallback
  event.respondWith(
    caches.match(request)
      .then(function(response) {
        if (response) {
          // Serve from cache and update in background
          fetch(request)
            .then(fetchResponse => {
              if (fetchResponse.status === 200) {
                caches.open(DYNAMIC_CACHE)
                  .then(cache => cache.put(request, fetchResponse));
              }
            })
            .catch(() => {});
          return response;
        }

        // Not in cache, try network
        return fetch(request)
          .then(response => {
            // Cache successful responses
            if (response.status === 200) {
              const responseClone = response.clone();
              caches.open(DYNAMIC_CACHE)
                .then(cache => cache.put(request, responseClone));
            }
            return response;
          })
          .catch(() => {
            // Offline fallback for navigation requests
            if (request.mode === 'navigate') {
              return caches.match('/').then(response => {
                return response || new Response(
                  `<!DOCTYPE html>
                  <html>
                    <head>
                      <title>SmartCity - Offline</title>
                      <meta name="viewport" content="width=device-width, initial-scale=1">
                      <style>
                        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                        .offline { color: #666; }
                      </style>
                    </head>
                    <body>
                      <h1>SmartCity</h1>
                      <div class="offline">
                        <h2>You're offline</h2>
                        <p>Please check your internet connection and try again.</p>
                      </div>
                    </body>
                  </html>`,
                  { headers: { 'Content-Type': 'text/html' } }
                );
              });
            }
            throw error;
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