//Building the project with firebase can have some compatibility issues with electron,
//In case of having OS architecture errors on build, run this command
// npm rebuild --runtime=electron --target=3.0.4 --disturl=https://atom.io/download/electron

var firebase = exports.firebase = require('firebase');
var key = require('./firebase_keys.json');

var config = {
    apiKey: key.API_KEY,
    authDomain: key.AUTH_DOMAIN,
    databaseURL: key.DATABASE_URL,
    projectId: key.PROJECT_ID,
    storageBucket: key.STORAGE_BUCKET,
    messagingSenderId: key.MESSAGING_SENDER_ID
  };

firebase.initializeApp(config);
