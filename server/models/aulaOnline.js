var mongoose = require('mongoose');

var AulaOnline = mongoose.model('AulaOnline', {
    disciplina: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    date: {
        type: Date,
        default: null
    },
    tutor: {
        type: mongoose.Schema.Types.ObjectId
    },
    _creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

module.exports = {AulaOnline};