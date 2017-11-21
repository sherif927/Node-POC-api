const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/Todo');

// var id = '5a14781eed6f30225cc56ecb';
var id = '5a147fb476fb1c18b073b8b6';

/*Todo.findOne({ _id: id }).then((todo) => {
    if (todo == null) {
        console.log(`The object with id ${id} was not found.`);
    } else {
        console.log(`The todo object of id ${todo._id} has text: ${todo.text}`);
    }
});*/

Todo.findById(id).then((todo) => {
    if (todo == null) {
        console.log(`The object with id ${id} was not found.`);
    } else {
        console.log(`The todo object of id ${todo._id} has text: ${todo.text}`);
    }
});