const express = require('express');
const bodyParse = require('body-parser');
const { ObjectID } = require('mongodb');

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


//GET method for listing all todos
app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({ todos });
    }, (e) => {
        res.status(400).send(e);
    });
});

//GET method for getting a todo by id
app.get('/todos/:id', (req, res) => {
    var id = req.params.id;
    if (ObjectID.isValid(id)) {
        Todo.findById(id).then((todo) => {
            if (todo == null) {
                res.status(404).send({});
            } else {
                res.send(todo);
            }
        }, (e) => {
            res.status(400).send(e);
        });
    } else {
        res.status(400).send({});
    }


});

app.listen(3006, () => {
    console.log('Started on port 3006');
});


module.exports = { app }