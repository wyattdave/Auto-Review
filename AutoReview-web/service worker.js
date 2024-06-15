const CACHE_NAME = `autoreview v1`;

// Use the install event to pre-cache all initial resources.
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    cache.addAll([
      '/',
      '/AutoReview-web/assets/css/mui.min-ar.css',
      '/AutoReview-web/assets/fontawsome/css/fontawesome.css',
      '/AutoReview-web/assets/fontawsome/css/solid.min.css',
      '/AutoReview-web/assets/css/style-ar.css',
      'https://fonts.googleapis.com/css?family=Open+Sans',
      'https://fonts.googleapis.com/css?family=Maven+Pro|Muli|Droid+Sans+Mono|Istok+Web',
      '/AutoReview-web/assets/js/xmlToJson.js',
      '/AutoReview-web/assets/js/jquery-1.10.2.js',
      '/AutoReview-web/assets/js/zip.min.js',
      '/AutoReview-web/assets/js/script.js',
      '/AutoReview-web/assets/js/mui.min.js',
      '/AutoReview-web/icon v2 128.png"'
    ]);
  })());
});

self.addEventListener('fetch', event => {
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);

    // Get the resource from the cache.
    const cachedResponse = await cache.match(event.request);
    if (cachedResponse) {
      return cachedResponse;
    } else {
        try {
          // If the resource was not in the cache, try the network.
          const fetchResponse = await fetch(event.request);

          // Save the resource in the cache and return it.
          cache.put(event.request, fetchResponse.clone());
          return fetchResponse;
        } catch (e) {
          // The network failed.
        }
    }
  })());
});