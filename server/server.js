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
app.post('/todos', (req, res) => {
    var todo = new Todo({ text: req.body.text });
    todo.save().then((doc) => {
        res.send(doc);
    }).catch((err) => {
        res.status(400).send(err);
    });
});


//GET method for listing all todos
app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send([todos]);
    }).catch((e) => {
        res.status(400).send(e);
    });
});

//GET method for getting a todo by id
app.get('/todos/:id', (req, res) => {
    var id = req.params.id;
    if (ObjectID.isValid(id)) {
        Todo.findById(id).then((todo) => {
            (todo == null) ? res.status(404).send({ message: 'Object was not found' }) : res.send(todo);
        }).catch((e) => {
            res.status(400).send(e);
        });
    } else {
        res.status(400).send({ message: 'Bad request,Invalid Id' });
    }
});

//DELETE method for deleting a todo by Id
app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;
    if (ObjectID.isValid(id)) {
        Todo.findByIdAndRemove(id).then((todo) => {
            (todo == null) ? res.status(404).send({ message: 'Object was not found' }) : res.send(todo);
        }).catch((e) => {
            res.status(400).send(e);
        });
    } else {
        res.status(400).send({ message: 'Bad request,Invalid Id' });
    }
});

//PATCH method for updating a todo
app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    if (ObjectID.isValid(id)) {
        if (_.isBoolean(body.completed) && body.completed) {
            body.completedAt = new Date().getTime();
        } else {
            body.completed = false;
            body.completedAt = null;
        }

        Todo.findByIdAndUpdate(id, { $set: body }, { new: true }).then((todo) => {
            (todo == null) ? res.status(404).send({ message: 'Object was not found' }) : res.send(todo);
        }).catch((e) => {
            res.status(400).send(e);
        });
    } else {
        res.status(400).send({ message: 'Bad request , Invalid Identifier' });
    }
});



// Sign-up Method
app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((err) => {
        res.status(400).send(err);
    });
});


//LOGIN
app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        })
    }).catch((e) => {
        res.status(400).send(e);
    })
});

app.delete('/users/logout',authenticate,(req,res)=>{
    req.user.removeToken(req.token).then(()=>{
        res.status(200).send({message:'Logout Successful'});
    }).catch((e)=>{
        res.status(400).send(e);
    });
})


app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});




app.listen(port, () => {
    console.log(`Started on port ${port}`);
});


module.exports = { app }