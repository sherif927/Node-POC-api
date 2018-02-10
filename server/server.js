const express = require('express');
const bodyParse = require('body-parser');
const { ObjectID } = require('mongodb');
const _ = require('lodash');

var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/Todo');
var { User } = require('./models/User');

var { authenticate } = require('../middleware/authentication/authenticate');

var app = express();

const port = process.env.PORT || 3000;


app.use(bodyParse.json());

//POST method for creating a new TODO
app.post('/todos', authenticate, async (req, res) => {
    try {
        var todo = new Todo({ text: req.body.text, _creator: req.user._id });
        var doc = await todo.save();
        res.send(doc);
    } catch (err) {
        res.status(400).send(err);
    }
});


//GET method for listing all todos
app.get('/todos', authenticate, async (req, res) => {
    try {
        var todos = await Todo.find({ _creator: req.user._id });
        res.send(todos);
    } catch (e) {
        res.status(400).send(e);
    }
});

//GET method for getting a todo by id
app.get('/todos/:id', authenticate, async (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) return res.status(400).send({ message: 'Invalid Id' });
    try {
        var todo = await Todo.findOne({ _id: id, _creator: req.user._id });
        (todo == null) ? res.status(404).send({ message: 'Object was not found' }) : res.send(todo);
    } catch (e) {
        res.status(400).send(e);
    }

});

//DELETE method for deleting a todo by Id
app.delete('/todos/:id', authenticate, async (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) return res.status(400).send({ message: 'Bad request,Invalid Id' });

    try {
        var todo = await Todo.findOneAndRemove({ _id: id, _creator: req.user._id });
        (todo == null) ? res.status(404).send({ message: 'Object was not found' }) : res.send(todo);
    } catch (e) {
        res.status(400).send(e);
    }

});

//PATCH method for updating a todo
app.patch('/todos/:id', authenticate, async (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);
    if (!ObjectID.isValid(id)) return res.status(400).send({ message: 'Bad request,Invalid Id' });

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    try {
        var todo = await Todo.findOneAndUpdate({ _id: id, _creator: req.user._id }, { $set: body }, { new: true });
        (todo == null) ? res.status(404).send({ message: 'Object was not found' }) : res.send(todo);
    } catch (e) {
        res.status(400).send(e);
    }
});



// Sign-up Method
app.post('/users/signup', async (req, res) => {
    try {
        var body = _.pick(req.body, ['email', 'password']);
        var user = new User(body);
        await user.save();
        var token = await user.generateAuthToken();
        res.header('x-auth', token).send(user);
    } catch (e) {
        res.status(400).send(err);
    }
});


//LOGIN
app.post('/users/login', async (req, res) => {
    try {
        var body = _.pick(req.body, ['email', 'password']);
        var user = await User.findByCredentials(body.email, body.password);
        var token = await user.generateAuthToken();
        res.header('x-auth', token).send(user);
    } catch (e) {
        res.status(400).send(e);
    }
});


//LOGOUT
app.delete('/users/logout', authenticate, async (req, res) => {
    try {
        await req.user.removeToken(req.token);
        res.status(200).send({ message: 'Logout Successful' });
    } catch (e) {
        await req.user.removeToken(req.token);
        res.status(200).send({ message: 'Logout Successful' });
    }
})


//get profile
app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});




app.listen(port, () => {
    console.log(`Started on port ${port}`);
});


module.exports = { app }