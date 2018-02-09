var events=require('events');
var emitter=new events.EventEmitter();

emitter.on('event1',function(output){
    console.log(`event 1 ---> ${JSON.stringify(output)}`);
});

emitter.on('event2',function(output){
    console.log(`event 2 ---> ${JSON.stringify(output)}`);
});

emitter.on('event3',function(output){
    console.log(`event 3 ---> ${JSON.stringify(output)}`);
});

emitter.on('event4',function(output){
    console.log(`event 4 ---> ${JSON.stringify(output)}`);
});

emitter.on('event5',function(output){
    console.log(`event 5 ---> ${JSON.stringify(output)}`);
});

emitter.on('event6',function(output){
    console.log(`event 6 ---> ${JSON.stringify(output)}`);
});



module.exports=emitter;

