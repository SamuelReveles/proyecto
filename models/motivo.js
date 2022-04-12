const { Schema, model } = require('mongoose');

const motivoSchema = Schema({
    puntos: {
        type: Number,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    }
});

module.exports = model('Motivo', motivoSchema);