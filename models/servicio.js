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
        default: new Date()
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
    llenado_datos: {
        type: Boolean,
        default: false
    },
    mensajes: [{
        type: Object
    }],
    verDatos: {
        type: Boolean,
        default: true
    },
    linkMeet: {
        type: String,
        default: ''
    },
    eventId: {
        type: String
    },
    calificado: {
        type: Boolean,
        default: false
    },
    reportesNutriologo: {
        type: Number,
        default: 2
    },
    reportesCliente: {
        type: Number,
        default: 2
    },
    vigente: {
        type: Boolean,
        default: true
    }
});

ServicioSchema.methods.toJSON = function(){
    const { __v, ...servicio } = this.toObject();
    return servicio;
}

module.exports = model('Servicio', ServicioSchema);