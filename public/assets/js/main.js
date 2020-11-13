if(!('serviceWorker' in navigator)) {
    console.log('ServiceWorker: Browser tidak di dukung');
} else {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('../../sw.js')
        .then(registration => {
            console.log(`Service Worker terdaftar. Scope: ${registration.scope}`);
        })
        .catch(error => {
            console.log(`ServiceWorker: Pendaftaran gagal. Error: ${error}`);
        })
    })
}

// Periksa fitur notifikasi
if('Notification' in window) {
    requestPermission()
} else {
    console.log('Browser tidak mendukung notifikasi.');
}

// Meminta izin menggunakan Notification API
function requestPermission() {
    Notification.requestPermission().then(result => {
        if(result === 'denied') {
            console.log('Fitur notifikasi tidak di ijinkan.');
            return
        } else if(result === 'default') {
            console.error('Pengguna menutup kotak dialog permintaan izin');
            return
        }

        navigator.serviceWorker.ready.then(() => {
            if(('PushManager' in window)) {
                navigator.serviceWorker.getRegistration().then(registration => {
                    registration.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: urlBase64ToUint8Array('BDHPg8WZjYPhHE30AleesxpUrdkN9V7S1bxCbiMBz-ykZ1kiq38uzc78CJ0_K8n5mJen-T2C0SAlj7Gz6I0HCnU')
                    })
                    .then(subscribe => {
                        console.log('Berhasil melakukan subscribe dengan endpoint: ', subscribe.endpoint);
                        console.log('Berhasil melakukan subscibe dengan p256dh key: ', btoa(String.fromCharCode.apply(
                            null, new Uint8Array(subscribe.getKey('p256dh'))
                        )));
                        console.log('Berhasil melakukan subsribe dengan auth key: ', btoa(String.fromCharCode.apply(
                            null, new Uint8Array(subscribe.getKey('auth'))
                        )));
                    })
                    .catch(error => {
                        console.error('Tidak dapat melakukan subscribe: ', error.message);
                    })
                })
            }
        })
    })
}

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/')
    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    for(let i = 0; i < rawData.length; i++) {
        outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
}