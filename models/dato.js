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
    ombligo: {
        type: Number
    },
    cadera: {
        type: Number
    },
    muslos: {
        type: Number
    },
    costillas: {
        type: Number
    },
    busto: {
        type: Number
    }
});

module.exports = model( 'Dato', DatoSchema );