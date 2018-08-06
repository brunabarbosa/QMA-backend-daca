var mongoose = require('mongoose');

var PedidoAjuda = mongoose.model('PedidoAjuda', {
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
    isOnline: {
        type: Boolean,
        default: false,
        required: true
    }
});

module.exports = {PedidoAjuda};