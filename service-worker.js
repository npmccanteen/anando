const CACHE = "medterm-v1";
const ASSETS = [
  "/",
  "/index.html",
  "/dictionary.html",
  "/quiz.html",
  "/profile.html",
  "/css/style.css",
  "/js/firebase-config.js",
  "/js/auth.js",
  "/js/dictionary.js",
  "/js/quiz.js",
  "/js/profile.js",
  "/data/anatomy-terms.json",
  "/manifest.json"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});
