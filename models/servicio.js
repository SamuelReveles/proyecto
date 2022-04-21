const { Schema, model} = require('mongoose');

const ServicioSchema = Schema({
    fecha_inicio: {
        type: Date,
        required: true
    },
    fecha_finalizacion: {
        type: Date,
        required: true
    }
});

ServicioSchema.methods.toJSON = function(){
    const { __v, ...servicio } = this.toObject();
    return servicio;
}

module.exports = model('Servicio', ServicioSchema);