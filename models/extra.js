const mongoose = require('mongoose');
const datos = require('./dato');

const ExtraSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El username es obligatorio']
    },
    apellidos: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    sexo: {
        type: String,
        required: [true, 'El sexo es obligatorio']
    },
    datoInicial: {
        type: mongoose.Schema.ObjectId, ref: datos
    },
    datoConstante:[ {
        type: mongoose.Schema.ObjectId, ref: datos
    }],
    historial: [{
        type: mongoose.Schema.ObjectId, ref:'historial'
    }],
    calendario: [{
        type: Object
    }],
    fecha_nacimiento: {
        type: Object,
        required: [true, 'La fecha de nacimiento es obligatoria']
    }
});

ExtraSchema.methods.toJSON = function(){
    const { __v, ...extra } = this.toObject();
    return extra;
}

module.exports = mongoose.model( 'Extra', ExtraSchema );