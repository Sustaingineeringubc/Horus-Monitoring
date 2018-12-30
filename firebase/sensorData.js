var firebase = require('./init').firebase
var firestore = firebase.firestore()
firestore.settings({
    timestampsInSnapshots: true
});
var uploadData = exports.uploadData = function(data) {
    firestore.collection('sensorData').add(data)
        .then(function(documentReference){
            //In case of needing reference to the document uploaded
        })
}
