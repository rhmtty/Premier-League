importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js')

if(workbox) {
    console.log('Workbox berhasil dimuat');
} else{
    console.log('Workbox gagal dimuat');
}

workbox.precaching.precacheAndRoute([
    { url: '/', revision: '1' },
    { url: '/index.html', revision: '1' },
    { url: '/detail.html', revision: '1' },
    { url: '/nav.html', revision: '1' },
    { url: '/manifest.json', revision: '1' },
    { url: '/assets/css/materialize.min.css', revision: '1' },
    { url: '/assets/css/style.css', revision: '1' },
    { url: '/assets/icon/icon-48.png', revision: '1' },
    { url: '/assets/icon/icon-96.png', revision: '1' },
    { url: '/assets/icon/icon-192.png', revision: '1' },
    { url: '/assets/icon/icon.png', revision: '1' },
    { url: '/assets/js/api.js', revision: '1' },
    { url: '/assets/js/db.js', revision: '1' },
    { url: '/assets/js/idb.js', revision: '1' },
    { url: '/assets/js/main.js', revision: '1' },
    { url: '/assets/js/materialize.min.js', revision: '1' },
    { url: '/assets/js/nav.js', revision: '1' },
], {
    ignoreUrlParametersMatching: [/.*/]
})

// Caching Halaman
workbox.routing.registerRoute(
    new RegExp('/pages/'),
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'pages'
    }),
)

// Menyimpan cache gambar selama 30 hari
workbox.routing.registerRoute(
    /\.(?:png|gif|jpg|jpeg|svg|)$/,
    workbox.strategies.cacheFirst({
        cacheName: 'images',
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Hari
            })
        ]
    }),
)

// Menyimpan cache dari CSS Google Fonts
workbox.routing.registerRoute(
    /^https:\/\/fonts\.googleapis\.com/,
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'google-fonts-stylesheets',
    })
);
 
// Menyimpan cache untuk file font selama 1 tahun
workbox.routing.registerRoute(
    /^https:\/\/fonts\.gstatic\.com/,
    workbox.strategies.cacheFirst({
        cacheName: 'google-fonts-webfonts',
        plugins: [
            new workbox.cacheableResponse.Plugin({
                statuses: [0, 200],
            }),
            new workbox.expiration.Plugin({
                maxAgeSeconds: 60 * 60 * 24 * 365,
                maxEntries: 40,
            }),
        ],
    })
);

workbox.routing.registerRoute(
    /^https:\/\/api\.football-data\.org/,
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'english-league',
        plugins: [
            new workbox.expiration.Plugin({
                maxAgeSeconds: 60 * 30
            })
        ]
    })
);

// Mendeteksi event click ketika pengguna melakukan sesuatu
self.addEventListener('notificationclick', event => {
    event.notification.close()
    
    if(!event.action) {
        // Pengguna menyentuh area notif di luar action 
        console.log('Notification Click');
        return
    }

    switch (event.action) {
        case 'yes-action':
            console.log('Pengguna memilih action yes');
            // buka tab baru
            clients.openWindow('https://google.com')
            break;

        case 'no-action':
            console.log('Pengguna memilih action no');
            break;
    
        default:
            console.log(`Action yang di pilih tidak dikenal: ${event.action}`);
            break;
    }
})

// Kode untuk event push agar service worker dapat menerima push notification
self.addEventListener('push', event => {
    let body;
    if(event.data) {
        body = event.data.text()
    } else{
        body = 'Push message no payload'
    }

    const options = {
        body: body,
        icon: 'assets/images/icon.png',
        vibrate: [100, 50, 100],
        badge: 'assets/images/icon.png',
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        }
    }
    event.waitUntil(
        self.registration.showNotification('Push Notification', options)
    )
})