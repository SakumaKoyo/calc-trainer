// sw.js
const CACHE_NAME = 'calc-drill-v1';

// オフライン時でも動かすためにローカルに保存しておくファイル達
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './manifest.json',
    // 音声ファイル（パスは実際の配置に合わせて調整してください）
    './sound/Correct_Fast-Single.mp3',
    './sound/Incorrect.mp3',
    './sound/Countdown.mp3'
];

// 1. インストール時にファイルをキャッシュに叩き込む
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// 2. アクティベート時に古いキャッシュを掃除する
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
});

// 3. 画面からのファイル要求（fetch）をインターセプトして、キャッシュから爆速で返す
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // キャッシュがあればそれを返す、なければ通常通りネットに繋いで取りに行く
            return cachedResponse || fetch(event.request);
        })
    );
});
