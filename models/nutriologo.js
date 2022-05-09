const { Schema, model} = require('mongoose');

const NutrilogoSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    apellidos: {
        type: String,
        required: [true, 'Los apellidos son obligatorios']
    },
    nombreCompleto: {
        type: String
    },
    imagen: {
        type: String,
        required: [false, 'La imagen es obligatoria']
    },
    celular: {
        type: String,
        required: [true, 'La imagen es obligatoria'],
        unique: true
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    fecha_registro: {
        type: Date,
        required: [true, 'La fecha de registro es obligatoria']
    },
    predeterminados: [{
        type: Object, 
        ref:'preterminado'
    }],
    especialidades: [{
        type: String,
        required: true
    }],
    pacientes: [{ type: Schema.ObjectId, required: false}],
    puntajeBaneo: {
        type: Number,
        default: 0
    },
    baneado: { 
        type: Boolean,
        default: false
    },
    fecha_desban: {
        type: Date,
        required: false
    },
    calificacion: [{ 
        type: Number, 
        default: 0
    }],
    promedio: {
        type: Number
    },
    fechaDisponible: [{ 
        type: Date, 
        required: [true, 'Las fechas disponibles del nutriologo son obligatorias']
    }],
    reportes: [{
        type: Schema.ObjectId, ref:'reporte'
    }],
    descripcion: {
        type: String
    },
    ultima_conexion: {
        type: Date
    },
    precio: {
        type: Number,
    },
    indicaciones: {
        type: String
    },
    activo: {
        type: Boolean,
        default: false
    },
    avisado: {
        type: Boolean,
        default: false
    },
    calendario: {
        type: Boolean
    },
    calendario_precio: {
        type: Number
    },
    lista_compras: {
        type: Boolean
    },
    lista_compras_precio: {
        type: Number
    }
});

NutrilogoSchema.methods.toJSON = function(){
    const { __v, ...nutriologo } = this.toObject();
    return nutriologo;
}

module.exports = model( 'Nutriologo', NutrilogoSchema );