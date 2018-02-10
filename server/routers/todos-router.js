const express = require('express');
const { ObjectID } = require('mongodb');
const _ = require('lodash');
const { Todo } = require('../models/Todo');
const { authenticate } = require('../../middleware/authentication/authenticate');
var router = express.Router();

//POST method for creating a new TODO
router.post('/create', authenticate, async (req, res) => {
    try {
        var todo = new Todo({ text: req.body.text, _creator: req.user._id });
        var doc = await todo.save();
        res.send(doc);
    } catch (err) {
        res.status(400).send(err);
    }
});


//GET method for listing all todos
router.get('/getAll', authenticate, async (req, res) => {
    try {
        var todos = await Todo.find({ _creator: req.user._id });
        res.send(todos);
    } catch (e) {
        res.status(400).send(e);
    }
});

//GET method for getting a todo by id
router.get('/getById/:id', authenticate, async (req, res) => {
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
router.delete('/delete/:id', authenticate, async (req, res) => {
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
router.patch('/update/:id', authenticate, async (req, res) => {
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


module.exports = router;