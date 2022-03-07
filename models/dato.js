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
        type: Date,
        required: [true, 'La fecha de nacimiento es obligatoria']
    }
});

module.exports = model( 'dato', DatoSchema );