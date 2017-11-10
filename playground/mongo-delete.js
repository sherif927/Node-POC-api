const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoDB', (err, db) => {
    if (err) {
        console.log('unable to connect to the mongo-db server');
    } else {
        console.log('CONNECTED SUCCESSFULLY');
        // db.collection('Todos').deleteMany({completed:true}).then((result)=>{
        //     console.log(result);
        // });

        // db.collection('Todos').deleteOne({text:'eat dinner'}).then((results)=>{
        //     console.log(results.CommandResult);
        // });

        db.collection('Todos').findOneAndDelete({completed:true}).then((result)=>{
            console.log(JSON.stringify(result.value,undefined,2));
        });
        //db.close();
    }
});



