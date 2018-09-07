const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);


exports.sendNotifications = functions.database.ref('/notifications/{notifictionsId}').onWrite((event) => {
    console.info(event.data);
    if (event.data.previous.val()) {
        return;
    }

    if (!event.data.exists()) {
        return;
    }


    const NOTIFICATION_SNAPSHOT = event.data;
    const payload = {
        notification: {
            title: `New task from ${NOTIFICATION_SNAPSHOT.val().user}`,
            body: NOTIFICATION_SNAPSHOT.val().notificationBodyMessage,
            icons: NOTIFICATION_SNAPSHOT.val().userPorfileAvatar,
            click_action: `https://${fucntions.config().firebase.authDomain}`
        }
    }
    console.info(payload);
});
