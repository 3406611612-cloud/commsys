// Service Worker for AMap offline caching
var CACHE = 'amap-offline-v1';

self.addEventListener('install', function(e) {
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function(e) {
  var url = e.request.url;

  // Cache AMap tiles + building PBF + JS API
  if (url.includes('amap.com') || url.includes('autonavi.com')) {
    e.respondWith(
      caches.open(CACHE).then(function(cache) {
        return cache.match(e.request).then(function(cached) {
          if (cached) return cached;
          return fetch(e.request).then(function(resp) {
            if (resp.ok) cache.put(e.request, resp.clone());
            return resp;
          }).catch(function() {
            return cached || new Response('offline', {status: 503});
          });
        });
      })
    );
  }
});
