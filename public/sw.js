// Service worker minimal untuk installability PWA.
// Sengaja TIDAK meng-cache halaman (network-only) supaya artikel
// selalu segar dan tidak ada bug konten basi.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", (e) => {
  e.respondWith(fetch(e.request));
});
