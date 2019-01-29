const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const path = require('path');
const port = 5000;

const app = express();

// Set static path
app.use(express.static(path.join(__dirname, 'client')));

app.use(bodyParser.json());

const publicVapidKey = 'BPuPx77cOjB_dvkGh31bY-0VSbjLhtnWEgn2TNCUdR0lLd9APIOZdtFY_Y3SEyIAL7DwVhj0dtvRqgDUi_1mN6o';
const privateVapidKey = '6QELrY6yigW56dGeoE1PmtQgxuejti1jiHzZr06Nh4k';

webpush.setVapidDetails('mailto:test@test.com', publicVapidKey, privateVapidKey);

// Subscribe route
app.post('/subscribe', (req, res) => {
    // Get push subscription object
    const subscription = req.body;

    // Send 201 status - resource created
    res.status(201).json({});

    // Create payload
    const payload = JSON.stringify({title: 'Push Test'});

    // Pass object into sendNotification
    webpush.sendNotification(subscription, payload).catch(err => console.error(err))
});

app.listen(port, () => console.log(`Server started on port ${port}`));
