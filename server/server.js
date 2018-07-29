const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose')
var {AulaPresencial} = require('./models/aulaPresencial');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/aulasPresenciais', (req, res) => {
    var aulaPresencial = new AulaPresencial({
        disciplina: req.body.disciplina
    });

    aulaPresencial.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/aulasPresenciais', (req, res) => {
    AulaPresencial.find().then((aulas) => {
        res.send({aulas});
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/aulasPresenciais/:id', (req, res) => {
    var id = req.params.id;

    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    AulaPresencial.findById(id).then((aula) => {
        if(!aula) {
            return res.status(404).send();
        }
        res.send({aula});
    }).catch((e) => {
        res.status(400).send();
    });
});

app.delete('/aulasPresenciais/:id', (req, res) => {
    var id = req.params.id;

    if(!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    AulaPresencial.findByIdAndRemove(id).then((aula) => {
        if(!aula) {
            return res.status(404).send();
        }
        res.send({aula});
    }).catch((e) => {
        res.status(400).send();
    });
});

app.patch('/aulasPresenciais/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['disciplina', 'data', 'local']);

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    AulaPresencial.findByIdAndUpdate(id, { $set: body }, { new: true }).then((aula) => {
        if (!aula) {
            return res.status(404).send();
        }
        res.send({ aula });
    }).catch((e) => {
        res.status(400).send();
    });
});

app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        res.status(400).send();
    });
});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });
    }).catch((e) => {
        res.status(400).send();
    });
});

app.listen(port, () => {
    console.log(`Started up at port ${port}`);
});

module.exports = {app};

