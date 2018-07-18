const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {AulaPresencial} = require('./../models/aulaPresencial');

const aulaPresenciais = [{
    disciplina: 'calc 1'
},{
    disciplina: 'calc 2'
}];

beforeEach((done) => {
    AulaPresencial.remove({}).then(() => {
        return AulaPresencial.insertMany(aulaPresenciais);
    }).then(() => done());
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

                AulaPresencial.find({disciplina}).then((aulas) => {
                    expect(aulas.length).toBe(1);
                    expect(aulas[0].disciplina).toEqual(disciplina);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should not create aulaPresencial w/ disciplina field empty', (done) => {
        
        request(app)
            .post('/aulaPresenciais')
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

describe('GET /aulaPresenciais', () => {
    it('should not create aulaPresencial w/ disciplina field empty', (done) => {
        
        request(app)
            .get('/aulaPresenciais')
            .expect(200)
            .expect((res) => {
                expect(res.body.aulas.length).toEqual(2);
            })
            .end(done);
    });
});