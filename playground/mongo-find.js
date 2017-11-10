const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoDB', (err, db) => {
    if (err) {
        console.log('unable to connect to the mongo-db server');
    } else {
        console.log('CONNECTED SUCCESSFULLY');
        db.collection('Todos').find().count().then((count)=>{
            console.log('TODOS');
            console.log(`Count ${count}`);
        },(err)=>{
            console.log('unable to fetch todos',err);
        })
        //db.close();
    }
});



