const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');
const { app } = require('../server');
const { Todo } = require('../models/Todo');

const todos = [
    {
        _id: new ObjectID(),
        text: 'First todo'
    },
    {
        _id: new ObjectID(),
        text: 'First todo'
    }
];

//Setting up the database by clearing it and inserting mock data
beforeEach((done) => {
    Todo.remove({}).then(() => {
        Todo.insertMany(todos).then(() => {
            done();
        })
    });
});

//POST TEST
describe('POST /todos', () => postTests());

//GET TEST
describe('GET /todos', () => getTests());

describe('Get /todos/id', () => { getByIdTests() });


//GET method actual tests
function getTests() {
    it('Should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
                expect(res.body.todos[0].text).toBe(todos[0].text);
                expect(res.body.todos[1].text).toBe(todos[1].text);
            })
            .end(done);
    });
}

//GET method by id actual tests
function getByIdTests() {
    it('Should return an object by an id', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(todos[0]._id.toHexString());
                expect(res.body.text).toBe(todos[0].text);
            }).end(done);
    });

    it('Should return 404 when an id is not found', (done) => {
        request(app)
            .get(`/todos/5a147fb476fb1c18b073b8b2`)
            .expect(404)
            .end(done);
    });

    it('Should return 400 when an id is not valid', (done) => {
        request(app)
            .get(`/todos/123`)
            .expect(400)
            .end(done);
    });
}


//POST method actual tests
function postTests() {
    it('Should create a new Todo', (done) => {
        var text = "test todo text";

        request(app)
            .post('/todos')
            .send({ text })
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            }).end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    Todo.find({ text }).then((todos) => {
                        expect(todos.length).toBe(1);
                        expect(todos[0].text).toBe(text);
                        done();
                    }).catch(() => done(err));
                }
            })
    });

    it('Should not create a new Todo', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    Todo.find().then((todos) => {
                        expect(todos.length).toBe(2);
                        done();
                    }).catch(() => done(err));
                }
            })
    });
}