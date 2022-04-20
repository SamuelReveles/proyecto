const { Schema, model } = require('mongoose');

const SolicitudEmpleoSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
    },
    // cv: {
    //     type: Array,
    //     required: [true, 'El cv es obligatorio']
    // },
    cv: [{
        type: String,
        required: [true, 'El cv es obligatorio']
    }],
    estado: {
        type: Boolean,
        default: null
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio']
    }
});

SolicitudEmpleoSchema.methods.toJSON = function(){
    const { __v, ...solicitud } = this.toObject();
    return solicitud;
}

module.exports = model( 'Solicitud_empleo', SolicitudEmpleoSchema );