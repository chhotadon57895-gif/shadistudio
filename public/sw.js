// Tiny offline cache: after the page (or any ?g= family link) has been opened once online,
// it opens again with no internet. Stale-while-revalidate for same-origin GETs.
const CACHE = 'shaadi-studio-v1';
const SCOPE = self.registration.scope;

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then((c) => c.add(new Request(SCOPE, { cache: 'reload' }))).catch(() => {}));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  const isNav = req.mode === 'navigate';
  const key = isNav ? new Request(SCOPE) : req;
  e.respondWith(
    caches.match(key, { ignoreSearch: isNav }).then((hit) => {
      const fresh = fetch(req)
        .then((res) => {
          if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(key, copy)); }
          return res;
        })
        .catch(() => hit);
      return hit || fresh;
    })
  );
});
