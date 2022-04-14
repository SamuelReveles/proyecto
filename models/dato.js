const { Schema, model} = require('mongoose');

const DatoSchema = Schema({
    peso: {
        type: Number,
        required: [true, 'El peso es obligatorio']
    },
    altura: {
        type: Number,
        required: [true, 'La altura es obligatoria']
    },
    fecha_nacimiento: {
        type: Date
    },
    brazo: {
        type: Number
    },
    cuello: {
        type: Number
    },
    abdomen: {
        type: Number
    },
    cadera: {
        type: Number
    },
    muslos: {
        type: Number
    },
    pectoral: {
        type: Number
    },
    notas: {
        type: String
    }
});

module.exports = model( 'Dato', DatoSchema );