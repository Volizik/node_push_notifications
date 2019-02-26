const publicVapidKey = 'BPuPx77cOjB_dvkGh31bY-0VSbjLhtnWEgn2TNCUdR0lLd9APIOZdtFY_Y3SEyIAL7DwVhj0dtvRqgDUi_1mN6o';
let subscription = {};

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

// Проверяем поддержку SW браузером
if ('serviceWorker' in navigator) {
    // Регистрируем SW
    navigator.serviceWorker
        .register('./sw.js', {
            scope: '/'
        })
        .catch(err => console.error(err))
}

document.querySelector('#subscribe').addEventListener('click', function () {
    // Регистрируем Push
    console.log('Регистрируем Push подписку');
    navigator.serviceWorker.ready.then(
        (registration) => {
            // Service Worker зарегистрирован, подписываемся на уведомления
            registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
            }).then((subscriptionObj) => {
                subscription = subscriptionObj;
                fetch('/subscribe', {
                    method: 'POST',
                    body: JSON.stringify(subscriptionObj),
                    headers: {
                        'content-type': 'application/json'
                    }
                }).then(() => console.log('Push подписка зарегистрирована!'));
            });
        },
        () => { console.error('Service Worker не зарегистрирован!') }
    );
});

document.querySelector('#send').addEventListener('click', function () {
    navigator.serviceWorker.ready.then(
        () => {
            // Отправляем Push Notification
            console.log('Отправляем Push Notification');
            fetch('/send', {
                method: 'POST',
                body: JSON.stringify(subscription),
                headers: {
                    'content-type': 'application/json'
                }
            }).then(() => console.log('Push отправлен!'));
        },
        () => { console.error('Service Worker не зарегистрирован!') }
    )

});

document.querySelector('#unsubscribe').addEventListener('click', function () {
    navigator.serviceWorker.ready.then(
        () => {
            // Отписываемся от Push Notification
            console.log('Отписываемся от Push Notification');
            fetch('/unsubscribe', {
                method: 'POST',
                body: JSON.stringify(subscription),
                headers: {
                    'content-type': 'application/json'
                }
            }).then(() => {
                subscription.unsubscribe().then(() => {
                    console.log('Отписка от Push выполнена!')
                });
            });
        },
        () => { console.error('Service Worker не зарегистрирован!') }
    )
});
