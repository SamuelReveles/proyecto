const { Schema, model} = require('mongoose');

const AdministradorSchema = Schema({
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
        required: [true, 'La imagen es obligatoria']
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
    }
});

module.exports = model( 'Administrador', AdministradorSchema );