const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoDB', (err, db) => {
    if (err) {
        console.log('unable to connect to the mongo-db server');
    } else {
        console.log('CONNECTED SUCCESSFULLY');
        db.collection('Users').insertOne({name:'Sherif',age:22,location:'egypt'},(err,result)=>{
            if(err){
                console.log('Could not insert the value into the collection');
            }else{
                console.log(JSON.stringify(result.ops,undefined,2));
            }
        });
       db.close();
    }
});
        

        