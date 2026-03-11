// Service Worker pour cache des images et assets statiques
// CACHE_NAME : incrémenter lors d'un déploiement pour invalider l'ancien cache
const CACHE_NAME = 'mynotary-v2';

const PRECACHE_ASSETS = [
  '/favicon.svg',
];

// Patterns à cacher — exclure /_next/static/ (déjà couvert par Cache-Control immutable)
const CACHE_PATTERNS = [
  /^https:\/\/imagedelivery\.net\//,
  /\.(webp|avif|png|jpg|jpeg|svg)$/i,
];

const shouldSkip = (url) => url.includes('/_next/static/');

// Installation — skipWaiting dans waitUntil pour garantir l'activation après précache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activation — nettoyage des anciens caches + claim immédiat
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      ))
      .then(() => self.clients.claim())
  );
});

// Fetch — Cache-First pour les images distantes, réseau pour tout le reste
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  if (shouldSkip(request.url)) return;

  const shouldCache = CACHE_PATTERNS.some((pattern) => pattern.test(request.url));
  if (!shouldCache) return;

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) =>
      cache.match(request).then((cachedResponse) => {
        // Stale-while-revalidate : retourne le cache immédiatement + mise à jour en fond
        if (cachedResponse) {
          fetch(request)
            .then((res) => { if (res.ok) cache.put(request, res.clone()) })
            .catch(() => {});
          return cachedResponse;
        }

        // Pas en cache : fetch + mise en cache
        return fetch(request)
          .then((res) => {
            if (res.ok) cache.put(request, res.clone());
            return res;
          })
          .catch(() => new Response('Network error', { status: 503 }));
      })
    )
  );
});
