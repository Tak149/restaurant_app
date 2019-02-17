console.log('sw.js found');

const cacheName = 'v1';
const cacheList = [
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
        	console.log(cache);
        	return cache.addAll(cacheList);
    	})
      .catch(function(err) {
        console.log('ServiceWorker install failed', err);
      })
	);
});

//activates the service worker
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(nameChecking) {
      return Promise.all(nameChecking.map(function(name){
        console.log('activating');
        if (cacheName !== name) return caches.delete(name);
      }));
    })
    .catch(function(err) {
      console.log('ServiceWorker activation failed', err);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if(response){
        console.log('fetching from cache', response);
        return response;
      }
      return fetch(event.request).then(function(response){
        console.log('fetching from network', response);
        return response;
      })
    })
  );
});
