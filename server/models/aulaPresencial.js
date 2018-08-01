var mongoose = require('mongoose');

var AulaPresencial = mongoose.model('AulaPresencial', {
    disciplina: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    data: {
        type: Date,
        default: null
    },
    local: {
        type: String,
        default: null
    },
    _creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

module.exports = {AulaPresencial};