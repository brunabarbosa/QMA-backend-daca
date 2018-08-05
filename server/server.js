const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose')
var {AulaPresencial} = require('./models/aulaPresencial');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json(), function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    next();
  });

app.post('/aulasPresenciais', authenticate, (req, res) => {
    var aulaPresencial = new AulaPresencial({
        disciplina: req.body.disciplina,
        _creator: req.user._id
    });

    aulaPresencial.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/aulasPresenciais', authenticate, (req, res) => {
    AulaPresencial.find({
        _creator: req.user._id
    }).then((aulas) => {
        res.send({aulas});
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/aulasPresenciais/:id', authenticate, (req, res) => {
    var id = req.params.id;

    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    AulaPresencial.findOne({
        _id: id,
        _creator: req.user._id
    }).then((aula) => {
        if(!aula) {
            return res.status(404).send();
        }
        res.send({aula});
    }).catch((e) => {
        res.status(400).send();
    });
});

app.delete('/aulasPresenciais/:id', authenticate, (req, res) => {
    var id = req.params.id;

    if(!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    AulaPresencial.findOneAndRemove({
        _id: id,
        _creator: req.user._id
    }).then((aula) => {
        if(!aula) {
            return res.status(404).send();
        }
        res.send({aula});
    }).catch((e) => {
        res.status(400).send();
    });
});

app.patch('/aulasPresenciais/:id', authenticate, (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['disciplina', 'data', 'local']);

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    AulaPresencial.findOneAndUpdate({_id: id, _creator: req.user._id }, { $set: body }, { new: true }).then((aula) => {
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

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    });
});

app.listen(port, () => {
    console.log(`Started up at port ${port}`);
});

module.exports = {app};

