const CACHE_PREFIX = 'travel-map-studio-'
const CACHE_VERSION = `${CACHE_PREFIX}shell-v2`
const STATIC_SHELL = ['./manifest.webmanifest', './favicon.svg']

async function precacheAppShell() {
  const cache = await caches.open(CACHE_VERSION)
  const appResponse = await fetch('./', { cache: 'reload' })
  if (!appResponse.ok) throw new Error('Unable to fetch the app shell')
  const html = await appResponse.clone().text()
  await cache.put('./', appResponse)

  const assetUrls = Array.from(
    html.matchAll(/(?:src|href)=["']([^"']+\.(?:js|css))["']/gi),
    (match) => new URL(match[1], self.location.href).href,
  ).filter((url) => new URL(url).origin === self.location.origin)
  await cache.addAll([...STATIC_SHELL, ...new Set(assetUrls)])
}

self.addEventListener('install', (event) => {
  event.waitUntil(precacheAppShell().then(() => self.skipWaiting()))
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_VERSION)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const request = event.request
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone()
          void caches.open(CACHE_VERSION).then((cache) => cache.put('./', copy))
          return response
        })
        .catch(() => caches.match('./')),
    )
    return
  }

  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ??
        fetch(request).then((response) => {
          if (response.ok) {
            const copy = response.clone()
            void caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy))
          }
          return response
        }),
    ),
  )
})
