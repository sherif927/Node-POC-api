const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoDB', (err, db) => {
    if (err) {
        console.log('unable to connect to the mongo-db server');
    } else {
        console.log('CONNECTED TO MONGO DB-SERVER');
        db.close();
    }
});



