const { Schema, model} = require('mongoose');
const datos = mongoose.model('./datos');

const ExtraSchema = Schema({
    nombre: {
        type: Double,
        required: [true, 'El username es obligatorio'],
        unique: true
    },
    apellidos: {
        type: Double,
        required: [true, 'La contraseña es obligatoria']
    },
    datos: {
        type: Schema.ObjectId, ref: datos
    },
});

module.exports = model( 'extra', ExtraSchema );