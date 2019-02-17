console.log('sw.js found');

var cacheName = 'cache-v1';
var cacheList = [
  '/',
  '/index.html',
  '/restaurant.html',
  '/css/styles.css',
  '/data/restaurants.json',
  '/js/dbhelper.js',
  '/js/main.js',
  '/js/restaurant_info.js',
  '/img/1.jpg',
  '/img/2.jpg',
  '/img/3.jpg',
  '/img/4.jpg',
  '/img/5.jpg',
  '/img/6.jpg',
  '/img/7.jpg',
  '/img/8.jpg',
  '/img/9.jpg',
  '/img/10.jpg'
];


//setting up the service worker
self.addEventListener('install', function(event) {
	event.waitUntil(
    	caches.open(cacheName).then(function(cache) {
        	console.log('Caching files');
        	return cache.addAll(cacheList);
    	})
	);
});

//activates the service worker
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.map(function(key, i) {
          if (key !== cacheName) {
            return caches.delete(keys[i]);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
        if (response) {
          return response;
        }
        requestClone(event);
      })
    );
});

function requestClone(event) {
	var url = event.request.clone();
	return fetch(url).then(function(response){
		if(!response || response.status !== 200 || response.type !== 'basic'){
			return response;
		}

		var clonedRes = response.clone();

		caches.open(cacheName).then(function(cache){
			cache.put(event.request, clonedRes);
		});
		return response;
	})
}
