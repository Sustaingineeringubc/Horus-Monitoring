var firebase = require('./init').firebase
var firestore = firebase.firestore()
firestore.settings({
    timestampsInSnapshots: true
});

var susbcribeToSensors = exports.subscribeToSensors = function(userId, sensorId) {
    firestore.collection("sensorData")
        .where("number", "==", userId)
        .where("data.pumpId", "==", sensorId)
        .orderBy('date', "desc")
        .limit(10)
        .onSnapshot(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                console.log('DOOOC', doc.data())
            });
        });
}