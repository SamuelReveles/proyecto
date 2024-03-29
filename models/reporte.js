const { Schema, model } = require('mongoose');

const reporteScema = Schema({
    emisor: {
        type: Schema.ObjectId,
        required: true
    },
    para: {
        type: Schema.ObjectId,
        required: true
    },
    tipo: {
        type: Schema.ObjectId,
        ref: 'motivo',
        required: true
    },
    msg: {
        type: String,
        required: false
    },
    borrado: {
        type: Boolean,
        default: false
    },
    fecha: {
        type: Date,
        required: true
    }
});

reporteScema.methods.toJSON = function(){
    const { __v, ...reporte } = this.toObject();
    return reporte;
}

module.exports = model('Reporte', reporteScema);