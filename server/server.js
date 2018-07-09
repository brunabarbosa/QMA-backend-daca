var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose')
var {AulaPresencial} = require('./models/aulaPresencial');
var {User} = require('./models/user');

var app = express();

app.use(bodyParser.json());

app.post('/aulaPresenciais', (req, res) => {
    var aulaPresencial = new AulaPresencial({
        disciplina: req.body.disciplina
    });

    aulaPresencial.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.listen(3000, () => {
    console.log('Started on port 3000');
});

