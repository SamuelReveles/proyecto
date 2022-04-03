const { Schema, model } = require('mongoose');

const reportesScema = Schema({
    puntos: {
        type: Number,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    }
});

module.exports = model('Default', reportesScema);