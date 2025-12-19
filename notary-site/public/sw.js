// Service Worker pour cache des images et assets statiques
const CACHE_NAME = 'mynotary-v1';

// Assets à précacher
const PRECACHE_ASSETS = [
  '/favicon.svg',
];

// Patterns à cacher dynamiquement
const CACHE_PATTERNS = [
  /^https:\/\/imagedelivery\.net\//,  // Images Cloudflare
  /\.(webp|avif|png|jpg|jpeg|svg)$/i, // Toutes les images
];

// Installation - précache des assets critiques
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activation - nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch - stratégie Cache-First pour les images
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Vérifier si c'est une ressource à cacher
  const shouldCache = CACHE_PATTERNS.some((pattern) => pattern.test(event.request.url));
  
  if (shouldCache && event.request.method === 'GET') {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            // Retourner depuis le cache immédiatement
            // Mettre à jour le cache en arrière-plan (stale-while-revalidate)
            fetch(event.request).then((networkResponse) => {
              if (networkResponse.ok) {
                cache.put(event.request, networkResponse.clone());
              }
            }).catch(() => {});
            
            return cachedResponse;
          }
          
          // Pas en cache - fetch et cache
          return fetch(event.request).then((networkResponse) => {
            if (networkResponse.ok) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          });
        });
      })
    );
  }
});

