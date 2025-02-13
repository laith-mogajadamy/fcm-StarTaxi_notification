const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Path to your service account key JSON file
const SERVICE_ACCOUNT_KEY_PATH = path.join(__dirname, 'star-taxi-bfd86-firebase-adminsdk-fbsvc-cfa4c39e32.json');

// Load the service account key JSON file
const serviceAccount = JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_KEY_PATH, 'utf8'));

// Create JWT Client (signed JWT) using google-auth-library
const jwtClient = new google.auth.JWT(
    serviceAccount.client_email,  // Issuer (client_email)
    null,  // No key file required, using private key from service account
    serviceAccount.private_key,   // Private key from the service account JSON
    ['https://www.googleapis.com/auth/firebase.messaging'], // Required scope
    null  // No subject
);

// Generate the JWT assertion and authorize to get an access token
jwtClient.authorize(function (err, tokens) {
    if (err) {
        console.error('Error generating JWT:', err);
    } else {
        const accessToken = tokens.access_token;  // JWT assertion as access token

        console.log('Access Token:', accessToken);  // Logging access token

        // Now use the access token to send an FCM notification
        sendNotification(accessToken);
    }
});

// Function to send a notification via FCM
function sendNotification(accessToken) {
    const notificationPayload = {
        message: {
            topic: 'customer',
            // token: 'cdG-br62QVmY35xnnnu3Wc:APA91bEfLERJWUXwm8VnoWjZfBrw4IPj03-9e1u8qPRoFLwsEKa95iIpTHnviG5GZ_HEktrbsYhVicYGLg4jg2rP0Yi9d1sxQxuprP20iW7zKOcUsSLoSAA',  // Replace with your recipient device's FCM token
            notification: {
                title: 'Hello!',
                body: 'This is a test notification sent via FCM HTTP v1 API.',
            },
            android: {
                notification: {
                    channel_id: "channel_id",
                    title: "new test laith",
                    body: "android body ",
                    sound: "default", // Play the default notification sound
                    // sound: "car_horn_notification_sound",
                    notification_priority: "PRIORITY_HIGH",
                    visibility: "PUBLIC",
                },
            },
        }
    };

    // Use axios to send the notification
    axios.post('https://fcm.googleapis.com/v1/projects/star-taxi-bfd86/messages:send', notificationPayload, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            console.log('Notification sent successfully:', response.data);
        })
        .catch(error => {
            console.error('Error sending notification:', error.response ? error.response.data : error);
        });
}
//mobile
//eLK2rpzNRImJPXPiRliaFB:APA91bGHY_805MCEbVhBfI8wffb2Ur5pxpkSu48yC-jusmVTmuPU0zuUg0PqGDxgd4zwN5OSvBae3QK4RDCWfiUdD5L7BDiOP-ExV8i__QaVaopymsjkvOg
//lap
//dMUBD6zMQWSr2LGjh1t2tW:APA91bFN7L-9XUeOdi8ZlTg1jQzGKFn2rd1HxjpcZwmS_Gh4cUfe5Lr6TpVsoaw-0HPtFT9oz9FcOwm7srAtYXm1S6zZT53W_IfwQ5vsJ4G4PCGbY93-jUI