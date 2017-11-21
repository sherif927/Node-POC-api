const express = require('express');
const bodyParse = require('body-parser');

var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/Todo');
var { User } = require('./models/User');

var app = express();

app.use(bodyParse.json());

//POST method for creating a new TODO
app.post('/todos', (req, res) => {
    //console.log(req.body);
    var todo = new Todo({
        text: req.body.text
    });
    todo.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        res.status(400).send(err);
    });
});

app.listen(3001, () => {
    console.log('Started on port 3001');
});


module.exports = { app }