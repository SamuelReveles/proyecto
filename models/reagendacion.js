const { Schema, model} = require('mongoose');

const ReagendacionSchema = Schema({
    fecha_anterior: {
        type: Date,
        required: [true, 'La fecha anterior es obligatoria']
    },
    fecha_nueva: {
        type: Date,
        required: [true, 'La nueva fecha es obligatoria']
    },
    texto: {
        type: String,
        required: [true, 'El texto es obligatorio']
    }
});

module.exports = model( 'Reagendacion', ReagendacionSchema );