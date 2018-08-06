const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose')
var {AulaPresencial} = require('./models/aulaPresencial');
var {AulaOnline} = require('./models/aulaOnline');
var {PedidoAjuda} = require('./models/pedidoAjuda');
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

/**
 * Salva um pedido de ajuda feitos pelo alunos
 *
 * @section pedidosAjuda
 * @type post
 * @url /pedidosAjuda
 */
app.post('/pedidosAjuda', (req, res) => {
    var pedidoAjuda = new PedidoAjuda({
        disciplina: req.body.disciplina,
        isOnline: req.body.isOnline,
        date: req.body.date
    });

    pedidoAjuda.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

/**
 * Retorna todos os pedidos de ajuda feitos pelos alunos
 *
 * @section pedidosAjuda
 * @type get
 * @url /pedidosAjuda
 */
app.get('/pedidosAjuda', (req, res) => {
    PedidoAjuda.find({}).then((pedidos) => {
        res.send({pedidos});
    }, (e) => {
        res.status(400).send(e);
    });
});

/**
 * Deleta um pedido de ajuda feito por um aluno
 *
 * @section pedidosAjuda
 * @type delete
 * @url /pedidosAjuda:id
 */
app.delete('/pedidosAjuda/:id', (req, res) => {
    var id = req.params.id;

    if(!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    PedidoAjuda.findOneAndRemove({
        _id: id
    }).then((pedido) => {
        if(!pedido) {
            return res.status(404).send();
        }
        res.send({pedido});
    }).catch((e) => {
        res.status(400).send(e);
    });
});

/**
 * Atualiza um pedido de ajuda feito por um aluno
 *
 * @section pedidosAjuda
 * @type put
 * @url /pedidosAjuda:id
 */
app.patch('/pedidosAjuda/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['disciplina', 'date', 'isOnline']);

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    PedidoAjuda.findOneAndUpdate({_id: id}, { $set: body }, { new: true }).then((pedido) => {
        if (!pedido) {
            return res.status(404).send();
        }
        res.send({ pedido });
    }).catch((e) => {
        res.status(400).send(e);
    });
});

/**
 * Registra uma aula presencial com um tutor, o aluno precisa estar
 * autenticado
 *
 * @section aulasPresenciais
 * @type post
 * @url /aulasPresenciais
 */
app.post('/aulasPresenciais', authenticate, (req, res) => {
    var aulaPresencial = new AulaPresencial({
        disciplina: req.body.disciplina,
        local: req.body.local,
        tutor: req.body.tutor,
        _creator: req.user._id
    });

    aulaPresencial.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

/**
 * Registra uma aula online com um tutor, o aluno precisa estar
 * autenticado
 *
 * @section aulasOnline
 * @type post
 * @url /aulasOnline
 */
app.post('/aulasOnline', authenticate, (req, res) => {
    var aulaOnline = new AulaOnline({
        disciplina: req.body.disciplina,
        local: req.body.local,
        tutor: req.body.tutor,
        _creator: req.user._id
    });

    aulaOnline.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

/**
 * Retorna todas as aulas presenciais marcadas, o aluno precisa estar
 * autenticado
 *
 * @section aulasPresenciais
 * @type get
 * @url /aulasPresenciais
 */
app.get('/aulasPresenciais', authenticate, (req, res) => {
    AulaPresencial.find({
        _creator: req.user._id
    }).then((aulas) => {
        res.send({aulas});
    }, (e) => {
        res.status(400).send(e);
    });
});

/**
 * Retorna todas as aulas online marcadas, o aluno precisa estar
 * autenticado
 *
 * @section aulasOnline
 * @type get
 * @url /aulasOnline
 */
app.get('/aulasOnline', authenticate, (req, res) => {
    AulaOnline.find({
        _creator: req.user._id
    }).then((aulas) => {
        res.send({aulas});
    }, (e) => {
        res.status(400).send(e);
    });
});

/**
 * Retorna uma aula presencial com um tutor, o aluno precisa estar
 * autenticado
 *
 * @section aulasPresenciais
 * @type get
 * @url /aulasPresenciais/:id
 */
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
        res.status(400).send(e);
    });
});

/**
 * Retorna uma aula online com um tutor, o aluno precisa estar
 * autenticado
 *
 * @section aulasOnline
 * @type get
 * @url /aulasOnline/:id
 */
app.get('/aulasOnline/:id', authenticate, (req, res) => {
    var id = req.params.id;

    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    AulaOnline.findOne({
        _id: id,
        _creator: req.user._id
    }).then((aula) => {
        if(!aula) {
            return res.status(404).send();
        }
        res.send({aula});
    }).catch((e) => {
        res.status(400).send(e);
    });
});

/**
 * Deleta uma aula presencial com um tutor, o aluno precisa estar
 * autenticado
 *
 * @section aulasPresenciais
 * @type delete
 * @url /aulasPresenciais/:id
 */
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
        res.status(400).send(e);
    });
});

/**
 * Deleta uma aula online com um tutor, o aluno precisa estar
 * autenticado
 *
 * @section aulasOnline
 * @type delete
 * @url /aulasOnline/:id
 */
app.delete('/aulasOnline/:id', authenticate, (req, res) => {
    var id = req.params.id;

    if(!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    AulaOnline.findOneAndRemove({
        _id: id,
        _creator: req.user._id
    }).then((aula) => {
        if(!aula) {
            return res.status(404).send();
        }
        res.send({aula});
    }).catch((e) => {
        res.status(400).send(e);
    });
});

/**
 * Atualiza uma aula presencial com um tutor, o aluno precisa estar
 * autenticado
 *
 * @section aulasPresenciais
 * @type put
 * @url /aulasPresenciais/:id
 */
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
        res.status(400).send(e);
    });
});

/**
 * Atualiza uma aula online com um tutor, o aluno precisa estar
 * autenticado
 *
 * @section aulasOnline
 * @type put
 * @url /aulasOnline/:id
 */
app.patch('/aulasOnline/:id', authenticate, (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['disciplina', 'data']);

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    AulaOnline.findOneAndUpdate({_id: id, _creator: req.user._id }, { $set: body }, { new: true }).then((aula) => {
        if (!aula) {
            return res.status(404).send();
        }
        res.send({ aula });
    }).catch((e) => {
        res.status(400).send(e);
    });
});

/**
 * Registra um novo usuario
 *
 * @section users
 * @type post
 * @url /users
 */
app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['name', 'email', 'password']);
    var user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    });
});

/**
 * Retorna um usuario. 
 *
 * @section users
 * @type get
 * @url /users/me
 */
app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});


/**
 * Login de um usuario
 *
 * @section users
 * @type post
 * @url /users/login
 */
app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });
    }).catch((e) => {
        res.status(400).send(e);
    });
});

/**
 * Logout de um usuario. Necessario setar o header com o atributo
 * 'x-auth' com um token valido
 *
 * @section users
 * @type post
 * @url /users/me/token
 */
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

