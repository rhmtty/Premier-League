const webPush = require('web-push')

const vapidKeys = {
    'publicKey': 'BDHPg8WZjYPhHE30AleesxpUrdkN9V7S1bxCbiMBz-ykZ1kiq38uzc78CJ0_K8n5mJen-T2C0SAlj7Gz6I0HCnU',
    'privateKey': 'LGC04wBK-nXrY1669a2IPVQgEr-TaX1ZIG2mW_Zi1hE'
}

webPush.setVapidDetails(
    'mailto:example@yourdomain.org',
    vapidKeys.publicKey,
    vapidKeys.privateKey
)

const pushSubscription = {
    'endpoint': 'https://fcm.googleapis.com/fcm/send/fn_DZEO1wyA:APA91bFlgsgnQHwYnp6TC9UgAviL76e4OVSfY4y3HMafUjmrBxVDlNPqVoCx211sIs52Lu3hfXpYTTpAduym9xMW7qcVq7tiJDMD8_JSlJPhRKC6i8T44gjGXZUi6217RvYs4E4_VsFD',
    'keys': {
        'p256dh': 'BNADiK2zjPsM+GHpZaYjPdtgnMf1REk6RjA/BeBy6FUcM8yWxQRTxRlJ29cVylKloC/EcktNXyquZF0kEFkp5KA=',
        'auth': 'fJnfwkcoGQHmkyrh13QqJQ=='
    }
}

const payload = 'Selamat! Aplikasi Anda sudah dapat menerima push notifikasi'
const options = {
    gcmAPIKey: '166041439037',
    TTL: 60
}
webPush.sendNotification(
    pushSubscription,
    payload,
    options
)
