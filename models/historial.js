const { Schema, model } = require('mongoose');

const historialSchema = Schema({
    dieta: [{
        type: Object,
        required: true
    }],
    datos: {
        type: Schema.ObjectId,
        ref: 'dato',
        required: false
    },
    fecha: {
        type: Date,
        default: new Date()
    }
});

module.exports = model('Historial', historialSchema);