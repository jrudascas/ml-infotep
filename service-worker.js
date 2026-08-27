/**
 * ============================================================
 * SERVICE WORKER — GeneTech Pro (Offline-First PWA)
 * ============================================================
 * Estrategia: Cache-First para todos los assets estáticos.
 * Al instalar, se pre-cachean todos los recursos del proyecto.
 * Al activar, se eliminan versiones antiguas del cache.
 * Al hacer fetch, se sirve desde cache; si falla, desde red.
 */

const CACHE_NAME = 'genetech-v1';

// Lista completa de todos los assets a pre-cachear
const ASSETS_TO_CACHE = [
  './',
  './index.html',

  // CSS
  './css/styles.css',
  './css/fonts-local.css',

  // Fuentes locales
  './fonts/uU9NCBsR6Z2vfE9aq3bh3dSD.woff2',
  './fonts/uU9NCBsR6Z2vfE9aq3bh09SDulI.woff2',
  './fonts/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7.woff2',
  './fonts/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa25L7SUc.woff2',
  './fonts/QGYvz_MVcBeNP4NJtEtq.woff2',
  './fonts/QGYvz_MVcBeNP4NJuktqQ4E.woff2',

  // JavaScript
  './js/ga-engine.js',
  './js/simulator-string.js',
  './js/simulator-tsp.js',
  './js/simulator-math.js',
  './js/course.js',
  './js/quiz.js',
  './js/code-examples.js',
  './js/app.js',

  // Iconos PWA
  './icons/icon-192.png',
  './icons/icon-512.png',

  // Manifest
  './manifest.json'
];

// ── INSTALL: Pre-cachear todos los assets ─────────────────────────────────
self.addEventListener('install', (event) => {
  console.log('[SW] Instalando GeneTech Service Worker...');

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-cacheando assets...');
      // Usamos addAll con manejo individual para no fallar si un ícono no existe aún
      return Promise.allSettled(
        ASSETS_TO_CACHE.map((url) =>
          cache.add(url).catch((err) => {
            console.warn(`[SW] No se pudo cachear: ${url}`, err.message);
          })
        )
      );
    }).then(() => {
      console.log('[SW] ✅ Pre-cache completado.');
      // Forzar activación inmediata sin esperar a que se cierren pestañas antiguas
      return self.skipWaiting();
    })
  );
});

// ── ACTIVATE: Limpiar caches viejos ──────────────────────────────────────
self.addEventListener('activate', (event) => {
  console.log('[SW] Activando GeneTech Service Worker...');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log(`[SW] Eliminando cache antiguo: ${name}`);
            return caches.delete(name);
          })
      );
    }).then(() => {
      console.log('[SW] ✅ Service Worker activo y controlando todas las páginas.');
      // Tomar control de todas las pestañas abiertas inmediatamente
      return self.clients.claim();
    })
  );
});

// ── FETCH: Cache-First con fallback a Red ────────────────────────────────
self.addEventListener('fetch', (event) => {
  // Solo manejar peticiones GET (ignorar POST, etc.)
  if (event.request.method !== 'GET') return;

  // Ignorar extensiones de Chrome y similares
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // ✅ Si está en cache, servir instantáneamente (sin red)
      if (cachedResponse) {
        return cachedResponse;
      }

      // 🌐 No está en cache: intentar desde la red y guardar para después
      return fetch(event.request).then((networkResponse) => {
        // Solo cachear respuestas válidas
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          networkResponse.type !== 'opaque'
        ) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // ❌ Sin caché y sin red: mostrar página de error offline para HTML
        if (event.request.headers.get('accept')?.includes('text/html')) {
          return caches.match('./index.html');
        }
        // Para otros recursos (imágenes, etc.) devolver respuesta vacía
        return new Response('', {
          status: 503,
          statusText: 'Sin conexión y sin cache disponible'
        });
      });
    })
  );
});

// ── MESSAGE: Forzar actualización desde la app ────────────────────────────
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});
