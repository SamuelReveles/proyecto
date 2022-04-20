const { Schema, model } = require('mongoose');

const motivoSchema = Schema({
    puntos: {
        type: Number,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    }
});

motivoSchema.methods.toJSON = function(){
    const { __v, ...motivo } = this.toObject();
    return motivo;
}

module.exports = model('Motivo', motivoSchema);