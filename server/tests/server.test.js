const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {AulaPresencial} = require('./../models/aulaPresencial');
const {aulasPresenciais, users, populateAulasPresenciais, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateAulasPresenciais);

describe('POST /aulasPresenciais', () => {
    it('should create a new AulaPresencial', (done) => {
        var disciplina = 'Calculo 1';

        request(app)
            .post('/aulasPresenciais')
            .send({
                disciplina
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.disciplina).toEqual(disciplina);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                AulaPresencial.find({
                    disciplina
                }).then((aulas) => {
                    expect(aulas.length).toBe(1);
                    expect(aulas[0].disciplina).toEqual(disciplina);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should not create aulaPresencial w/ disciplina field empty', (done) => {

        request(app)
            .post('/aulasPresenciais')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                AulaPresencial.find().then((aulas) => {
                    expect(aulas.length).toBe(2);
                    done();
                }).catch((e) => done(e));
            });
    });
});

describe('GET /aulasPresenciais', () => {
    it('should not create aulaPresencial w/ disciplina field empty', (done) => {

        request(app)
            .get('/aulasPresenciais')
            .expect(200)
            .expect((res) => {
                expect(res.body.aulas.length).toEqual(2);
            })
            .end(done);
    });
});

describe('GET /aulasPresenciais/:id', () => {
    it('should return aulaPresencial doc', (done) => {
        request(app)
            .get(`/aulasPresenciais/${aulasPresenciais[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.aula.disciplina).toEqual(aulasPresenciais[0].disciplina);
            })
            .end(done);
    });

    it('should return 404 if aulaPresencial not found', (done) => {
        var hexId = new ObjectID().toHexString();
        request(app)
            .get(`/aulasPresenciais/${hexId}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 for non-object ids', (done) => {
        request(app)
            .get('/aulasPresenciais/123')
            .expect(404)
            .end(done);
    });

});

describe('DELETE /aulasPresenciais/:id', () => {
    it('should remove a aulaPresencial', (done) => {
        var hexId = aulasPresenciais[1]._id.toHexString();

        request(app)
            .delete(`/aulasPresenciais/${hexId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.aula._id).toBe(hexId);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                AulaPresencial.findById(hexId).then((aula) => {
                    expect(aula).toBeNull();
                    done();
                }).catch((e) => done(e));

            });
    });

    it('should return 404 if aulaPresencial not found', (done) => {
        var hexId = new ObjectID().toHexString();
        request(app)
            .delete(`/aulasPresenciais/${hexId}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 if object id is invalid', (done) => {
        request(app)
            .delete('/aulasPresenciais/123')
            .expect(404)
            .end(done);
    });
});

describe('PATCH /aulasPresenciais/:id', () => {
    it('should update a aulaPresencial', (done) => {
        var hexId = aulasPresenciais[1]._id.toHexString();
        var disciplina = "vetorial"

        request(app)
            .patch(`/aulasPresenciais/${hexId}`)
            .send({disciplina})
            .expect(200)
            .expect((res) => {
                expect(res.body.aula._id).toBe(hexId);
                expect(res.body.aula.disciplina).toBe(disciplina);
            }).end(done);
    });

    it('should return 404 if object id is invalid', (done) => {
        request(app)
            .patch('/aulasPresenciais/123')
            .expect(404)
            .end(done);
    });
});

describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });

    it('should return a 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});