const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoDB', (err, db) => {
    if (err) {
        console.log('unable to connect to the mongo-db server');
    } else {
        console.log('CONNECTED SUCCESSFULLY');
        db.collection('Todos').findOneAndUpdate({ _id: new ObjectID('5a05b3d33de2171af89aa2eb') }, { $set: { completed: true } }, { returnOriginal: false }).then((result) => {
            console.log(result.value);
        });
        //db.close();
    }
});



