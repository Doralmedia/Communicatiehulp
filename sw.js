var CACHE = 'communicatiehulp-v1';
var FILES = [
  '/communicatiehulp.html',
  '/communicatiehulp-zakelijk.html',
  '/manifest.json',
  '/manifest-zakelijk.json'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return cache.addAll(FILES);
    })
  );
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request).then(function(networkResponse) {
        return caches.open(CACHE).then(function(cache) {
          cache.put(e.request, networkResponse.clone());
          return networkResponse;
        });
      });
    }).catch(function() {
      return caches.match(e.request);
    })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE; })
            .map(function(k) { return caches.delete(k); })
      );
    })
  );
});
