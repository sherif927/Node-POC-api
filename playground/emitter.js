var events=require('events');
var emitter=new events.EventEmitter();

emitter.on('file-event',function(output){
    console.log(`${output} was emitted`);
});



emitter.emit('file-event','output indeed');

