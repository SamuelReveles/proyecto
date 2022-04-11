const { Schema, model} = require('mongoose');

const ServicioSchema = Schema({
    fecha_inicio: {
        type: Date,
        required: true
    },
    fecha_finalizacion: {
        type: Date,
        required: true
    }
});

module.exports = model('Servicio', ServicioSchema);