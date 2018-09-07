var config = {
    apiKey: "AIzaSyAnsTCH8Xvdyms9JHiH5zrDHWsITLDM9lM",
    authDomain: "ned-bot.firebaseapp.com",
    databaseURL: "https://ned-bot.firebaseio.com",
    projectId: "ned-bot",
    storageBucket: "ned-bot.appspot.com",
    messagingSenderId: "406889320506"
};
firebase.initializeApp(config);

/*  ============================
    | FCP Api Request handlers | 
    ============================ */
const FIREBASE_AUTH = firebase.auth();
const FIREBASE_MESSAGING = firebase.messaging();
const FIREBASE_DATABASE = firebase.database();


FIREBASE_MESSAGING.onTokenRefresh(refreshToken);

const signOutButton = document.getElementById('signOutButton');
const subscribeButton = document.getElementById('subscribe');
const unSubscribeButton = document.getElementById('unsubscribe');
const notficationForm = document.getElementById('notfication-form');

// ******* event Listners ***************
signOutButton.addEventListener('click', signOut);
subscribeButton.addEventListener('click', subscribeToNotifications);
unSubscribeButton.addEventListener('click', unSubscribeNotifications);
notficationForm.addEventListener('submit', sendNotificationMessage);
// ************* functions *************
function signOut() {
    FIREBASE_AUTH.signOut();
};

function subscribeToNotifications() {
    FIREBASE_MESSAGING.requestPermission()
        .then(function () {
            refreshToken()
            console.log(FIREBASE_AUTH.currentUser);
        })
        .catch(function (error) {
            console.log(error);
        });
};


function refreshToken() {
    return FIREBASE_MESSAGING.getToken()
        .then(function (token) {
            console.log("Token: ", token);
            FIREBASE_DATABASE.ref("authTokens").push({
                token,
                uid: FIREBASE_AUTH.currentUser.uid
            })
        })
}


function unSubscribeNotifications() {
    FIREBASE_MESSAGING.getToken()
        .then(token => {
            FIREBASE_MESSAGING.deleteToken(token);
        }).then(() => FIREBASE_DATABASE.ref('/authTokens').orderByChild('uid').equalTo(FIREBASE_AUTH.currentUser.uid)
            .once('value')
            .then(snapshot => {
                console.log(FIREBASE_AUTH.currentUser.uid, snapshot.val())
                let key = Object.keys(snapshot.val())[0];

                return FIREBASE_DATABASE.ref('authTokens').child(key).remove();
            })
        )

}

function sendNotificationMessage(event) {
    event.preventDefault();
    currentUser = FIREBASE_AUTH.currentUser;
    let notificationMessage = document.getElementById('todovalue').value;
    FIREBASE_DATABASE.ref('/notifications').push({
        user: currentUser.displayName,
        notificationBodyMessage: notificationMessage,
        userPorfileAvatar: currentUser.photoURL
    }).then(() => document.getElementById('todovalue').value = "");
}

// FIREBASE_MESSAGING.getToken().then(function(currentToken) {
//     if (currentToken) {
//     //   sendTokenToServer(currentToken);
//     //   updateUIForPushEnabled(currentToken);
//     console.log("token : ", currentToken);
//     } else {
//       // Show permission request.
//       console.log('No Instance ID token available. Request permission to generate one.');
//       // Show permission UI.
//     //   updateUIForPushPermissionRequired();
//     //   setTokenSentToServer(false);
//     }
//   }).catch(function(err) {
//     console.log('An error occurred while retrieving token. ', err);
//     // showToken('Error retrieving Instance ID token. ', err);
//     // setTokenSentToServer(false);
//   });

