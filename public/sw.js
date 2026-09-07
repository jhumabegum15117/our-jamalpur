// Our Jamalpur Service Worker - Clean Live Pass-Through & Auto-Unregister
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((key) => caches.delete(key)));
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Pass-through fetch handler ensuring zero interference with live preview
self.addEventListener('fetch', (event) => {
  // Always fetch fresh from network
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
