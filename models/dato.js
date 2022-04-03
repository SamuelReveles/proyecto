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
        required: false
    }
});

module.exports = model( 'Dato', DatoSchema );