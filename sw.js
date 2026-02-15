// 1. كل مرة ترفع تحديث، غير الرقم ده (v1 -> v2 -> v3)
const CACHE_NAME = 'shift-point-v6'; 

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
  // لو عندك ملفات CSS أو صور تانية ضيفها هنا
];

self.addEventListener('install', (event) => {
  // 2. السطر ده بيجبر المتصفح يسيب النسخة القديمة فوراً
  self.skipWaiting(); 
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('activate', (event) => {
  // 3. الكود ده بيمسح الكاش القديم عشان مياخدش مساحة من موبايل الموظف
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Cleaning old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});