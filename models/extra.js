const mongoose = require('mongoose');
const datos = require('./dato');

const ExtraSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El username es obligatorio'],
        unique: true
    },
    apellidos: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    datoInicial: {
        type: mongoose.Schema.ObjectId, ref: datos
    },
    datoConstante:[ {
        type: mongoose.Schema.ObjectId, ref: datos
    }],
    verDatos: {
        type: Boolean, 
        default: true
    },
    historial: [{
        type: mongoose.Schema.ObjectId, ref:'historial'
    }]
});

module.exports = mongoose.model( 'Extra', ExtraSchema );