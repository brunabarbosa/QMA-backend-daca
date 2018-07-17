const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {AulaPresencial} = require('./../models/aulaPresencial');


beforeEach((done) => {
    AulaPresencial.remove({}).then(() => done());
});

describe('POST /aulaPresenciais', () => {
    it('should create a new AulaPresencial', (done) => {
        var disciplina = 'Calculo 1';

        request(app)
            .post('/aulaPresenciais')
            .send({disciplina})
            .expect(200)
            .expect((res) => {
                expect(res.body.disciplina).toEqual(disciplina);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                AulaPresencial.find().then((aulas) => {
                    expect(aulas.length).toBe(1);
                    expect(aulas[0].disciplina).toEqual(disciplina);
                    done();
                }).catch((e) => done(e));
            })
    });
});