const { Schema, model } = require('mongoose');

const reportesSchema = Schema({
    puntos: {
        type: Number,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    }
});

module.exports = model('Default', reportesSchema);