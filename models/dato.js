const { Schema, model} = require('mongoose');

const DatoSchema = Schema({
    peso: {
        type: Number,
        required: [true, 'El peso es obligatorio']
    },
    altura: {
        type: Number,
        required: [true, 'La altura es obligatoria']
    },
    brazo: {
        type: Number
    },
    cuello: {
        type: Number
    },
    abdomen: {
        type: Number
    },
    cadera: {
        type: Number
    },
    muslos: {
        type: Number
    },
    pectoral: {
        type: Number
    },
    fecha: {
        type: Date,
        deafult: new Date()
    }
});

DatoSchema.methods.toArray = function(){

    let arreglo = [];

    if(this.peso) arreglo.push({
        tipo: 'Peso',
        valor: this.peso + ' kg'
    });

    if(this.altura) arreglo.push({
        tipo: 'Altura',
        valor: this.altura + ' cm'
    });

    if(this.brazo) arreglo.push({
        tipo: 'Brazo',
        valor: this.brazo + ' cm'
    });

    if(this.cuello) arreglo.push({
        tipo: 'Cuello',
        valor: this.cuello + ' cm'
    });

    if(this.abdomen) arreglo.push({ 
        tipo: 'Abdomen',
        valor: this.abdomen + ' cm'
    });

    if(this.cadera) arreglo.push({
        tipo: 'Cadera',
        valor: this.cadera + ' cm'
    });

    if(this.muslos) arreglo.push({
        tipo: 'Muslos',
        valor: this.muslos + ' cm'
    });

    if(this.pectoral) arreglo.push({
        tipo: 'Pectoral',
        valor: this.pectoral + ' cm'
    });

    return arreglo;
}

DatoSchema.methods.toJSON = function(){
    const { __v, ...dato } = this.toObject();
    return dato;
}

module.exports = model( 'Dato', DatoSchema );