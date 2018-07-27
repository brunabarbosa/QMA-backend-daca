const {ObjectID} = require('mongodb');
const {AulaPresencial} = require('./../../models/aulaPresencial');

const aulasPresenciais = [{
    _id: new ObjectID(),
    disciplina: 'calc 1'
}, {
    _id: new ObjectID(),
    disciplina: 'calc 2'
}];

const populateAulasPresenciais = (done) => {
    AulaPresencial.remove({}).then(() => {
        return AulaPresencial.insertMany(aulasPresenciais);
    }).then(() => done());
};

module.exports = {aulasPresenciais, populateAulasPresenciais};