const { Schema, model} = require('mongoose');

const Horario = {
    '7:00' : false,
    '7:30' : false,
    '8:00' : false,
    '8:30' : false,
    '9:00' : false,
    '9:30' : false,
    '10:00' : false,
    '10:30' : false,
    '11:00' : false,
    '11:30' : false,
    '12:00' : false,
    '12:30' : false,
    '13:00' : false,
    '13:30' : false,
    '14:00' : false,
    '14:30' : false,
    '15:00' : false,
    '15:30' : false,
    '16:00' : false,
    '16:30' : false,
    '17:00' : false,
    '17:30' : false,
    '18:00' : false,
    '18:30' : false,
    '19:00' : false,
    '19:30' : false,
    '20:00' : false,
    '20:30' : false,
    '21:00' : false        
}

const horarioDefault = [Horario, Horario, Horario, Horario, Horario, Horario, Horario];

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
    sexo: {
        type: String,
        required: [true, 'El sexo es obligatorio']
    },
    fecha_nacimiento: {
        type: Date,
        required: [true, 'La fecha de nacimiento es obligatoria']
    },
    CURP: {
        type: String,
        required: [true, 'La CURP es obligatoria']
    },
    domicilio: {
        type: String,
        required: [true, 'El domicilio es obligatorio']
    },
    imagen: {
        type: String,
        required: [false, 'La imagen es obligatoria']
    },
    celular: {
        type: String,
        required: [true, 'El celular es obligatorio']
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    fecha_registro: {
        type: Date,
        required: [true, 'La fecha de registro es obligatoria'],
        default: new Date()
    },
    predeterminados: [{
        type: Object, 
        ref:'preterminado'
    }],
    especialidades: [{
        type: String
    }],
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
        required: false,
        default: null
    },
    calificacion: [{ 
        type: Number, 
        default: 0
    }],
    promedio: {
        type: Number
    },
    fechaDisponible: [{ 
        type: Object
    }],
    configuracion_fechas: [{
        type: Object,
        default: horarioDefault
    }],
    reportes: [{
        type: Schema.ObjectId, ref:'reporte'
    }],
    descripcion: {
        type: String
    },
    ultima_conexion: {
        type: Date,
        default: new Date()
    },
    precio: {
        type: Number
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
    notificaciones: [{
        type: Object
    }],
    calendario: [{
        type: Object
    }],
    ingresos: {
        type: Number,
        default: 0
    }
});

NutrilogoSchema.methods.toJSON = function(){
    const { __v, ...nutriologo } = this.toObject();
    return nutriologo;
}

module.exports = model( 'Nutriologo', NutrilogoSchema );