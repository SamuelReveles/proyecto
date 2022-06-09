const { Schema, model } = require('mongoose');

const SolicitudNutriologoSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
    },
    apellidos:{
        type: String,
        required: [true, 'Los apellidos son obligatorios']
    },
    cedula: {
        type: String,
        required: [true, 'La cédula es obligatoria']
    },
    estado: {
        type: Boolean,
        default: null
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio']
    },
    domicilio: {
        type: String, 
        required: [true, 'El domicilio es obligatorio']
    },
    sexo: {
        type: String, 
        required: [true, 'El sexo es obligatorio']
    },
    categorias: [{
        type: String,
        required: [true, 'Las categorias son obligatorias']
    }]
});

SolicitudNutriologoSchema.methods.toJSON = function(){
    const { __v, ...solicitud } = this.toObject();
    return solicitud;
}

module.exports = model( 'Solicitud', SolicitudNutriologoSchema );