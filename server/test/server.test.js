const expect = require('expect');
const request = require('supertest');

const { app } = require('../server');
const { Todo } = require('../models/Todo');

const todos = [
    { text: 'First todo' },
    { text: 'First todo' }
];

//Clearing the database for the POST method test
beforeEach((done) => {
    Todo.remove({}).then(() => {
        Todo.insertMany(todos).then(() => {
            done();
        })
    });
});

//POST TEST
describe('POST /todos', () => {
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
    })
});


describe('GET /todos', () => {
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
});