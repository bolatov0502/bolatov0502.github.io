// КТ М125 квиз — работа без сети. Сначала сеть (чтобы сразу видеть обновления), при её отсутствии — сохранённая копия.
const C = 'm125-v3.0';
const FILES = ['./', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(C).then(c => c.addAll(FILES)).catch(() => {})); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== self.location.origin) return;
  e.respondWith(fetch(r).then(resp => { if (resp.ok) { const cp = resp.clone(); caches.open(C).then(c => c.put(r, cp)); } return resp; })
    .catch(() => caches.match(r, { ignoreSearch: true }).then(m => m || caches.match('./'))));
});
