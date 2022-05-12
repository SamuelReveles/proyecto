const { Schema, model } = require('mongoose');

const ClienteSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    apellidos: {
        type: String,
        required: [true, 'Los apellidos son obligatorios']
    },
    imagen: {
        type: String,
        required: true
    },
    celular: {
        type: String,
        required: [true, 'El celular es obligatorio'],
        unique: true
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    //Datos de primer registro
    datoInicial: {
        type: Schema.ObjectId, ref: 'dato'
    },
    //Datos que se actualizan semanalmente
    datoConstante:[ {
        type: Schema.ObjectId, ref: 'dato'
    }],
    extra1: {
        type: Schema.ObjectId, ref: 'extra'
    },
    extra2: {
        type: Schema.ObjectId, ref: 'extra'
    },
    baneado: {
        type: Boolean,
        default: false
    },
    fecha_desban: {
        type: Date,
        required: false
    },
    verDatos: {
        type: Boolean, 
        default: true
    },
    puntajeBaneo: {
        type: Number,
        default: 0
    },
    reportes: [{
        type: Schema.ObjectId, ref:'reporte'
    }],
    fecha_registro: {
        type: Date,
        required: true
    },
    ultima_conexion: {
        type: Date
    },
    historial: [{
        type: Schema.ObjectId, ref:'historial'
    }],
    avisado: {
        type: Boolean,
        default: false
    },
    historial_pagos: [{
        type: Object
    }],
    calendario: {
        type: Array
    }
});

ClienteSchema.methods.toJSON = function(){
    const { __v, ...cliente } = this.toObject();
    return cliente;
}

module.exports = model( 'Cliente', ClienteSchema );