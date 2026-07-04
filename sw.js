// sw.js
const CACHE_NAME = 'calc-drill-v1.1'; // バージョンを少し上げました

// tree 構造と 100% 完全一致させたキャッシュリスト
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './manifest.json',
    
    // 🎵 音声ファイル（フォルダ名小文字、Short も網羅して完全一致）
    './sound/Correct_Fast-Short.mp3',
    './sound/Correct_Fast-Single.mp3',
    './sound/Countdown.mp3',
    './sound/Incorrect.mp3',
    
    // 📱 favicons フォルダ内のコアアイコン群（index.html等で読み込んでいるもの）
    './favicons/favicon.ico',
    './favicons/apple-touch-icon-57x57.png',
    './favicons/apple-touch-icon-60x60.png',
    './favicons/apple-touch-icon-72x72.png',
    './favicons/apple-touch-icon-76x76.png',
    './favicons/apple-touch-icon-114x114.png',
    './favicons/apple-touch-icon-120x120.png',
    './favicons/apple-touch-icon-144x144.png',
    './favicons/apple-touch-icon-152x152.png',
    './favicons/apple-touch-icon-180x180.png',
    './favicons/android-chrome-36x36.png',
    './favicons/android-chrome-48x48.png',
    './favicons/android-chrome-72x72.png',
    './favicons/android-chrome-96x96.png',
    './favicons/android-chrome-128x128.png',
    './favicons/android-chrome-144x144.png',
    './favicons/android-chrome-152x152.png',
    './favicons/android-chrome-192x192.png',
    './favicons/android-chrome-256x256.png',
    './favicons/android-chrome-384x384.png',
    './favicons/android-chrome-512x512.png'
];

// 1. インストール
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// 2. アクティベート（古いキャッシュの掃除）
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

// 3. フェッチ（キャッシュファースト）
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || fetch(event.request);
        })
    );
});
