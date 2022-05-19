const { Schema, model} = require('mongoose');

const ServicioSchema = Schema({
    id_nutriologo: {
        type: Schema.ObjectId, 
        required: [true, 'Es obligatorio el id del nutriologo']
    },
    id_paciente: {
        type: Schema.ObjectId, 
        required: [true, 'Es obligatorio el id del paciente']
    },
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
    },
    mensajes: [{
        type: Object
    }],
    verDatos: {
        type: Boolean,
        default: true
    }
});

ServicioSchema.methods.toJSON = function(){
    const { __v, ...servicio } = this.toObject();
    return servicio;
}

module.exports = model('Servicio', ServicioSchema);