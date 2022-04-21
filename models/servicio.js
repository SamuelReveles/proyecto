const { Schema, model} = require('mongoose');

const ServicioSchema = Schema({
    fecha_inicio: {
        type: Date,
        required: true
    },
    fecha_finalizacion: {
        type: Date,
        required: true
    },
    fecha_cita: {
        type: Object,
        required: true
    },
    calendario: {
        type: Boolean,
        default: false
    },
    lista_compras: {
        type: Boolean,
        default: false
    }
});

ServicioSchema.methods.toJSON = function(){
    const { __v, ...servicio } = this.toObject();
    return servicio;
}

module.exports = model('Servicio', ServicioSchema);