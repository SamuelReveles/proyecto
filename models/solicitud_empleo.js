const { Schema, model } = require('mongoose');
const { FleetList } = require('twilio/lib/rest/supersim/v1/fleet');

const SolicitudEmpleoSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
    },
    cv: {
        type: Array,
        required: [true, 'El cv es obligatorio']
    },
    estado: {
        type: Boolean,
        default: null
    }
});

module.exports = model( 'Solicitud_Empleo', SolicitudEmpleoSchema );