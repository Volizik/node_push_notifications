self.addEventListener('push', (e) => {
    const data = e.data.json();
    console.log('Push Recieved!', data);
    self.registration.showNotification(data.title, {
        body: 'Notified by Volizik',
        icon: 'https://habrastorage.org/getpro/moikrug/uploads/user/100/016/679/4/avatar/medium_99d6de95885be8eecf5b42459c6028ec.jpg'
    })
});
