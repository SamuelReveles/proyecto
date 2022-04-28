const { Schema, model } = require('mongoose');

const historialSchema = Schema({
    dieta: {
        type: String,
        required: true
    },
    datos: {
        type: Schema.ObjectId,
        ref: 'dato',
        required: false
    }
});

module.exports = model('Historial', historialSchema);