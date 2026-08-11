var CACHE_NAME = 'bsk-cache-v3';
var ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', function(event){
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){ return cache.addAll(ASSETS); })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(event){
  event.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.filter(function(k){ return k !== CACHE_NAME; }).map(function(k){ return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(event){
  if(event.request.method !== 'GET') return;

  // Never touch cross-origin requests (e.g. the translation API) — they must always
  // go straight to the network and must never be cached or served stale.
  try {
    if(new URL(event.request.url).origin !== self.location.origin) return;
  } catch(e){ return; }

  var isHTML = event.request.mode === 'navigate' ||
    (event.request.headers.get('accept') || '').indexOf('text/html') !== -1;

  if(isHTML){
    // Network-first for the app shell: always get the latest version when online,
    // fall back to whatever's cached only when offline.
    event.respondWith(
      fetch(event.request).then(function(response){
        var copy = response.clone();
        caches.open(CACHE_NAME).then(function(cache){ cache.put(event.request, copy); });
        return response;
      }).catch(function(){
        return caches.match(event.request).then(function(cached){ return cached || caches.match('./index.html'); });
      })
    );
    return;
  }

  // Static assets (icons, manifest): serve from cache instantly, refresh in the background.
  event.respondWith(
    caches.match(event.request).then(function(cached){
      var fetchPromise = fetch(event.request).then(function(response){
        var copy = response.clone();
        caches.open(CACHE_NAME).then(function(cache){ cache.put(event.request, copy); });
        return response;
      }).catch(function(){ return cached; });
      return cached || fetchPromise;
    })
  );
});
