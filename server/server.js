//Express and Json Body Parser imports
const express = require('express');
const bodyParse = require('body-parser');

//Mongoose and Router imports
var mongoose  = require('./db/mongoose');
var users = require('./routers/user-router');
var todos = require('./routers/todos-router');

//Initializing Express
var app = express();

const port = process.env.PORT || 3000;

//Middleware and Routers
app.use(bodyParse.json());
app.use('/users', users);
app.use('/todos', todos);

//TEST method
app.get('/', (req, res) => {
    res.status(200).send({ message: 'welcome' });
})

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = { app }