const { Schema, model} = require('mongoose');

const PredeterminadoSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    texto: {
        type: String,
        required: [true, 'El texto es obligatorio']
    }
});

module.exports = model( 'Predeterminado', PredeterminadoSchema );