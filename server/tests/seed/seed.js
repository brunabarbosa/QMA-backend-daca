const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {AulaPresencial} = require('./../../models/aulaPresencial');
const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
    _id: userOneId,
    email: 'brunaoliveira@gmail.com',
    password: 'userOnePass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
    }]
}, {
    _id: userTwoId,
    email: 'brunabarbosa@gmail.com',
    password: 'userTwoPass'
}];

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

const populateUsers = (done) => {
    User.remove({}).then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();

        return Promise.all([userOne, userTwo]);
    }).then(() => done());
};

module.exports = {
    aulasPresenciais, 
    populateAulasPresenciais,
    populateUsers
};