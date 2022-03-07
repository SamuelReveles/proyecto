const { Schema, model} = require('mongoose');

const NutrilogoSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    apellidos: {
        type: String,
        required: [true, 'Los apellidos son obligatorios']
    },
    nombreCompleto: {
        type: String
    },
    imagen: {
        type: String,
        required: [false, 'La imagen es obligatoria']
    },
    celular: {
        type: String,
        required: [true, 'La imagen es obligatoria'],
        unique: true
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    fecha_registro: {
        type: Date,
        required: [true, 'La fecha de registro es obligatoria']
    },
    especialidades: {
        type: Array,
        required: [false, 'Las especialidades son obligatorias']
    },
    pacientes: [{ type: Object, required: false}]
});

module.exports = model( 'Nutriologo', NutrilogoSchema );