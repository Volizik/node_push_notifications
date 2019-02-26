const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const path = require('path');
const port = 5000;
const app = express();

app.use(express.static(path.join(__dirname, 'client')));
app.use(bodyParser.json());

const publicVapidKey = 'BPuPx77cOjB_dvkGh31bY-0VSbjLhtnWEgn2TNCUdR0lLd9APIOZdtFY_Y3SEyIAL7DwVhj0dtvRqgDUi_1mN6o';
const privateVapidKey = '6QELrY6yigW56dGeoE1PmtQgxuejti1jiHzZr06Nh4k';

webpush.setVapidDetails('mailto:test@test.com', publicVapidKey, privateVapidKey);

let subscriptions = {};

// Subscribe route
app.post('/subscribe', (req, res) => {
    // Get push subscription object
    const subscription = req.body;

    subscriptions[subscription.endpoint] = subscription;

    // Send 201 status - resource created
    res.status(201).json({});

});

app.post('/unsubscribe', (req, res) => {
    // Get push subscription object
    const subscription = req.body;

    delete subscriptions[subscription.endpoint];

    // Send 200 status - OK
    res.status(200).json({});
});

app.post('/send', (req, res) => {

    // Get push subscription object
    const subscription = req.body;
    console.log(subscription)

    // Create payload
    const payload = JSON.stringify({title: 'Push Test'});

    // Pass object into sendNotification
    webpush.sendNotification(subscription, payload)
        .then(() => res.status(200).json({}))
        .catch(err => res.status(err.statusCode).json(err));
});

app.listen(port, () => console.log(`Server started on port ${port}`));
