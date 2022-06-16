const { Schema, model } = require('mongoose');

fechaDisponibleSchema = new Schema({
    fecha: [{
        type: Object
    }]
});

module.exports = model('Fechas_Disponibles', fechaDisponibleSchema);