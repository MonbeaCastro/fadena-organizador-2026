const CACHE_NAME = 'fadena-organizador-v25';
const STATIC_ASSETS = [
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png'
];

async function cacheFreshIndex() {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch('./index.html?v=22', { cache: 'no-store' });
    if (response && response.ok) await cache.put('./index.html', response.clone());
  } catch (_) {
    // Si estamos sin conexión durante la instalación, se usará una copia previa si existiera.
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(STATIC_ASSETS);
    await cacheFreshIndex();
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key.startsWith('fadena-organizador-') && key !== CACHE_NAME).map((key) => caches.delete(key)));
    await cacheFreshIndex();
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  // Firebase/Auth/CDN y otros orígenes siguen directamente por red.
  if (url.origin !== self.location.origin) return;

  // Para documentos HTML/navegación: siempre red primero y sin caché HTTP.
  if (event.request.mode === 'navigate' || url.pathname.endsWith('/index.html')) {
    event.respondWith((async () => {
      try {
        const request = new Request(event.request, { cache: 'no-store' });
        const response = await fetch(request);
        if (response && response.ok) {
          const cache = await caches.open(CACHE_NAME);
          await cache.put('./index.html', response.clone());
        }
        return response;
      } catch (_) {
        return (await caches.match('./index.html')) || Response.error();
      }
    })());
    return;
  }

  // Activos estáticos: caché primero, red como respaldo.
  event.respondWith((async () => {
    const cached = await caches.match(event.request);
    if (cached) return cached;
    const response = await fetch(event.request);
    if (response && response.ok) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(event.request, response.clone());
    }
    return response;
  })());
});
