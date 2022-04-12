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
        type: Schema.ObjectId, 
        ref:'preterminado'
    }],
    especialidades: {
        type: Array,
        required: [true, 'Las especialidades son obligatorias']
    },
    pacientes: [{ type: Schema.ObjectId, required: false}],
    puntajeBaneo: {
        type: Number,
        default: 0
    },
    baneado: { 
        type: Boolean,
        default: false
    },
    calificacion: [{ 
        type: Number, 
        default: 0
    }],
    fechaDisponible: [{ 
        type: Date, 
        required: [true, 'Las fechas disponibles del nutriologo son obligatorias']
    }],
    reportes: [{
        type: Schema.ObjectId, ref:'reporte'
    }],
    descripcion: {
        type: String,
        required: false
    },
    ultima_conexion: {
        type: Date
    },
    precio: {
        type: Number,
        required: true
    }
});

NutrilogoSchema.methods.toJSON = function(){
    const { __v, ...nutriologo } = this.toObject();
    return nutriologo;
}

module.exports = model( 'Nutriologo', NutrilogoSchema );