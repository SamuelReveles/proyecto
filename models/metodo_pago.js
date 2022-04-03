const { Schema, model } = require('mongoose');

const MetodoPagoSchema = Schema({
    numero_tarjeta: {
        type: Number,
        required: [true, 'El número de tarjeta es obligatorio']
    },
    fecha_tarjeta: {
        type: Date,
        required: [true, 'La fecha de vencimiento es obligatoria']
    }
});

module.exports = model('Metodo_pago', MetodoPagoSchema);

