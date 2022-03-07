const { Schema, model } = require('mongoose');

const ClienteSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    apellidos: {
        type: String,
        required: [true, 'Los apellidos son obligatorios']
    },
    img: {
        type: String
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
    },
    datos: {
        type: Schema.ObjectId, ref: 'dato'
    },
    extra1: {
        type: Schema.ObjectId, ref: 'extra'
    },
    extra2: {
        type: Schema.ObjectId, ref: 'extra'
    },
    baneado: {
        type: Boolean,
        default: false
    },
    verDatos: {
        type: Boolean,
        default: true
    },
    metodo_pago: [{ type: Object, required: false }]
});

ClienteSchema.methods.toJSON = function(){
    const { __v, password, ...cliente } = this.toObject();
    return cliente;
}

module.exports = model( 'Cliente', ClienteSchema );