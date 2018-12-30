var firebase = require('./init').firebase

exports.createUser = function(email, password, username, organization, clientId) {
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(function(credential) {
            firebase.firestore().collection('users').doc(credential.user.uid).set({
                email: email,
                username: username,
                organization: organization,
                clientId: clientId
            })
            console.log(credential)
        })
        .catch(function(error) {
            console.log(error)
        })
}

exports.signInUser = function(email, password) {
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
      });
}

exports.logOutUser = function() {
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
      }).catch(function(error) {
        // An error happened.
      });
}