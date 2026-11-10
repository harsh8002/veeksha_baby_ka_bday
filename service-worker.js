const CACHE_NAME = 'veeksha-birthday-v7';
const CORE_FILES = [
  './index.html',
  './styles.css',
  './script.js',
  './manifest.webmanifest'
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(CORE_FILES);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map((key) => {
      if (key.startsWith('little-moments-') || key.startsWith('veeksha-birthday-')) {
        return caches.delete(key);
      }
      return Promise.resolve(false);
    }));
    await self.clients.claim();
  })());
});

// Always check the network first for the page shell so fresh HTML, CSS and JS
// appear after a GitHub Pages commit. Fall back to the last cached copy offline.
self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  const isAppShell = request.mode === 'navigate' ||
    url.pathname.endsWith('/index.html') ||
    url.pathname.endsWith('/styles.css') ||
    url.pathname.endsWith('/script.js') ||
    url.pathname.endsWith('/manifest.webmanifest');

  if (!isAppShell) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    try {
      const freshResponse = await fetch(request, { cache: 'no-store' });
      if (freshResponse && freshResponse.ok) {
        await cache.put(request, freshResponse.clone());
      }
      return freshResponse;
    } catch (error) {
      const cachedResponse = await cache.match(request);
      if (cachedResponse) return cachedResponse;
      if (request.mode === 'navigate') {
        const cachedHome = await cache.match('./index.html');
        if (cachedHome) return cachedHome;
      }
      return Response.error();
    }
  })());
});
