const { Schema, model } = require('mongoose');

const reporteScema = Schema({
    emisor: {
        type: Schema.ObjectId,
        ref: 'nutriologo',
        required: true
    },
    para: {
        type: Schema.ObjectId,
        ref: 'cliente',
        required: true
    },
    tipo: {
        type: Schema.ObjectId,
        ref: 'reportes',
        required: true
    },
    msg: {
        type: String,
        required: false
    },
    fecha: {
        type: Date,
        required: true
    }
});

module.exports = model('Reporte', reporteScema);