/* ============================================================
 * Service Worker —— 让工作台可「安装为 App」且离线可用
 * 策略：HTML 走网络优先（保证内容最新），静态资源走缓存优先
 * ============================================================ */
const CACHE = 'wb-shell-v6';
const ASSETS = [
  './',
  './index.html',
  './app.html',
  './manifest.json',
  './assets/css/style.css',
  './assets/js/core.js',
  './assets/js/data/content.js',
  './assets/js/data/extra.js',
  './assets/js/data/scripts.js',
  './assets/js/data/v2.js',
  './assets/js/app.js',
  './assets/js/modules/todo.js',
  './assets/js/modules/invest.js',
  './assets/js/modules/lang.js',
  './assets/js/modules/express.js',
  './assets/js/modules/sport.js',
  './assets/js/modules/library.js',
  './assets/js/modules/beauty.js',
  './assets/js/modules/ideas.js',
  './assets/js/modules/settings.js',
  './assets/js/modules/quotes.js',
  './assets/icons/icon-512.png',
  './assets/icons/icon-192.png',
  './assets/icons/apple-touch-icon-180.png',
  './assets/icons/favicon-32.png',
  './assets/icons/icon-maskable-512.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) { return c.addAll(ASSETS); }).then(function () {
      return self.skipWaiting();
    }).catch(function () { /* 个别资源缺失也不阻断安装 */ })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) {
        return caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);

  // 跨域请求（JSONBin 等同步接口）直接走网络，失败回退缓存
  if (url.hostname !== self.location.hostname) {
    e.respondWith(fetch(req).catch(function () { return caches.match(req); }));
    return;
  }

  // HTML：网络优先，失败回退缓存（保证下次打开仍有内容）
  var accept = req.headers.get('accept') || '';
  if (accept.indexOf('text/html') !== -1) {
    e.respondWith(
      fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copy); });
        return res;
      }).catch(function () { return caches.match(req).then(function (r) { return r || caches.match('./index.html'); }); })
    );
    return;
  }

  // 静态资源：缓存优先，未命中再取网络并缓存
  e.respondWith(
    caches.match(req).then(function (r) {
      return r || fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copy); });
        return res;
      }).catch(function () { return caches.match('./index.html'); });
    })
  );
});
