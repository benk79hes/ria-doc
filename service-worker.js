let CACHE_NAME = 'snake-the-teacher-v1';
var urlsToCache = [
  '/',
  '/ressources/css/structure.css',
  '/ressources/js/jquery-3.5.0.min.js',
  '/ressources/js/navigation.js',
  '/ressources/js/app.js',
  '/game/game.js'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});