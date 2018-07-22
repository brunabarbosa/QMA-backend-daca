var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose')
var {AulaPresencial} = require('./models/aulaPresencial');
var {User} = require('./models/user');

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

// GET /aulaPresenciais/1234
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

app.listen(port, () => {
    console.log(`Started up at port${port}`);
});

module.exports = {app};

