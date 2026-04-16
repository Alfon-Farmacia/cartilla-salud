// Service Worker — Cartilla de Salud
const CACHE = 'cartilla-v5';
const FILES = [
  '/CARTILLA-SALUD-FARMACIA/',
  '/CARTILLA-SALUD-FARMACIA/index.html',
  '/CARTILLA-SALUD-FARMACIA/manifest.json',
  '/CARTILLA-SALUD-FARMACIA/icon.svg'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Cache-first: sirve sin internet, actualiza en segundo plano
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      const net = fetch(e.request).then(res => {
        if (res && res.status === 200) {
          caches.open(CACHE).then(c => c.put(e.request, res.clone()));
        }
        return res;
      }).catch(() => cached);
      return cached || net;
    })
  );
});
