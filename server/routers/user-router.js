const express = require('express');
const { ObjectID } = require('mongodb');
const _ = require('lodash');
const { User } = require('../models/User.js');
const { authenticate } = require('../../middleware/authentication/authenticate');
var router = express.Router();


//SIGN-UP
router.post('/signup', async (req, res) => {
    try {
        var body = _.pick(req.body, ['email', 'password']);
        var user = new User(body);
        await user.save();
        var token = await user.generateAuthToken();
        res.header('x-auth', token).send(user);
    } catch (e) {
        res.status(400).send(e);
    }
});


//LOGIN
router.post('/login', async (req, res) => {
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
router.delete('/logout', authenticate, async (req, res) => {
    try {
        await req.user.removeToken(req.token);
        res.status(200).send({ message: 'Logout Successful' });
    } catch (e) {
        res.status(400).send(e);
    }
})


//Get Current Profile
router.get('/me', authenticate, (req, res) => {
    res.send(req.user);
});


module.exports = router;