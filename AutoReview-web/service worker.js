const CACHE_NAME = `autoreview v1`;

// Use the install event to pre-cache all initial resources.
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    cache.addAll([
      '/',
      'assets/css/mui.min-ar.css',
      'assets/fontawsome/css/fontawesome.css',
      'assets/fontawsome/css/solid.min.css',
      'assets/css/style-ar.css',
      'http://fonts.googleapis.com/css?family=Open+Sans',
      'https://fonts.googleapis.com/css?family=Maven+Pro|Muli|Droid+Sans+Mono|Istok+Web',
      'assets/js/xmlToJson.js',
      'assets/js/jquery-1.10.2.js',
      'assets/js/zip.min.js',
      'assets/js/script.js',
      'assets/js/script.js',
      'assets/js/mui.min.js',
      'icon v2 128.png"'
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