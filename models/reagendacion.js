const { Schema, model } = require('mongoose');

const ReagendacionSchema = Schema({
    emisor: {
        type: Schema.ObjectId,
        required: [true, 'El emisor es obligatorio']
    },
    remitente: {
        type: Schema.ObjectId,
        required: [true, 'El remitente es obligatorio']
    },
    id_servicio: {
        type: Schema.ObjectId,
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