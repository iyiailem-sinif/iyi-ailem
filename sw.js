/* İnternetsiz çalışma: uygulama dosyaları telefona saklanır.
   Dosyalar değişince SURUM'u bir artırın. */
const SURUM = 'iyiailem-1.0.1';
const DOSYALAR = [
  './', './index.html', './style.css', './app.js', './manifest.json',
  './ikon/ikon-192.png', './ikon/ikon-512.png', './ikon/ikon-maskable-512.png', './ikon/apple-touch-icon.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(SURUM).then(c => c.addAll(DOSYALAR)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(adlar => Promise.all(adlar.filter(a => a !== SURUM).map(a => caches.delete(a))))
    .then(() => self.clients.claim()));
});

// Önce saklanan kopya (hızlı ve internetsiz), arkada sessizce tazelenir.
self.addEventListener('fetch', e => {
  const istek = e.request;
  if (istek.method !== 'GET' || new URL(istek.url).origin !== self.location.origin) return;
  e.respondWith(caches.open(SURUM).then(async c => {
    const saklanan = await c.match(istek, { ignoreSearch: true });
    const ag = fetch(istek).then(y => { if (y && y.ok) c.put(istek, y.clone()); return y; }).catch(() => null);
    if (saklanan) { e.waitUntil(ag); return saklanan; }
    const y = await ag;
    if (y) return y;
    if (istek.mode === 'navigate') return c.match('./index.html');
    return new Response('', { status: 504 });
  }));
});
