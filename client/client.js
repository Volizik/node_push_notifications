const publicVapidKey = 'BPuPx77cOjB_dvkGh31bY-0VSbjLhtnWEgn2TNCUdR0lLd9APIOZdtFY_Y3SEyIAL7DwVhj0dtvRqgDUi_1mN6o';

// Check for service worker
if ('serviceWorker' in navigator) {
    send().catch(err => console.error(err))
}

// Register service worker, register push, send push
async function send() {
    // Register SW
    console.log('Registering SW');
    const register = await navigator.serviceWorker.register('./sw.js', {
        scope: '/'
    });
    console.log('Service worker registered!');

    // Register Push
    console.log('Register Push');
    const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
    });
    console.log('Push registered!');

    // Sending Push Notification
    console.log('Sending Push Notification');
    await fetch('/subscribe', {
        method: 'POST',
        body: JSON.stringify(subscription),
        headers: {
            'content-type': 'application/json'
        }
    });
    console.log('Push sent!');

}

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
