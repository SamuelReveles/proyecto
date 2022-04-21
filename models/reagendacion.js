const { Schema, model } = require('mongoose');

const ReagendacionSchema = Schema({
    fecha_anterior: {
        type: Date,
        required: [true, 'La fecha anterior es obligatoria']
    },
    fecha_nueva: {
        type: Date,
        required: [true, 'La nueva fecha es obligatoria']
    },
    msg: {
        type: String,
        required: [true, 'El texto es obligatorio']
    },
    aceptada: {
        type: Boolean,
        default: null
    }
});

ReagendacionSchema.methods.toJSON = function(){
    const { __v, ...reagendacion } = this.toObject();
    return reagendacion;
}

module.exports = model( 'Reagendacion', ReagendacionSchema );