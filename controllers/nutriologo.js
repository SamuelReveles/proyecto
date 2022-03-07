const { response } = require('express');
const Nutriologo = require('../models/nutriologo');
const Predeterminado = require('../models/predeterminado');
const { emailExiste, celularExiste } = require('../helpers/db-validator');
const Cliente = require('../models/cliente');

//twilio
const client = require('twilio')(process.env.TWILIO_SSID, process.env.TWILIO_AUTH_TOKEN);

const nutriologoPost = async (req, res = response) => {

    //Enviar asisgar número de telefono
    console.log(req.body.celular);
    console.log(req.body.channel)

    // // Extraer ID y número
    client
        .verify
        .services(process.env.ServiceID)
        .verifications
        .create({
            to: '+' + req.body.celular,
            channel: req.body.channel
        })
        .then(data => {
            res.status(200).send(data);
        })

    const nutri = new Nutriologo({
        nombre: req.body.nombre,
        apellidos: req.body.apellidos,
        nombreCompleto: req.body.nombre + ' ' + req.body.apellidos,
        celular: req.body.celular,
        correo: req.body.email,
        fecha_registro: new Date(28, 05, 2003),
        especialidades: [
            "Vegano",
            "General"
        ]
    });

    let error = false;

    try {
        await nutri.save();
    }
    catch (err) {
        error = err;
        res.json({
            error: 'Error al agregar a la DB',
            err
        });
    }
    if(!error){ 
        res.status(201).json({
            msg: 'success',
            nutri
        });
    }
};

// Crear un nuevo alimento predeterminado
const putPredeterminado = async (req, res = response) => {

    const predeterminado = new Predeterminado({
        nombre: req.body.nombre,
        texto: req.body.texto,
    });

    predeterminado.save();

    res.status(201).json({
        ok: true,
        predeterminado
    });
};

//Mostrar todos alimento predeterminado
const getPredeterminados = async (req, res = response) => {
    const predeterminados = await Predeterminado.find();

    res.json({
        predeterminados
    });
};

//Mostrar un solo alimento predeterminado
const getPredeterminado = async (req, res = response) => {
    const predeterminados = await Predeterminado.find({
        nombre: req.body.nombre
    });

    res.json({
        predeterminados
    });
};

//Actualizar datos del nutriólogo
const putActualizarDatos = async (req, res = response) => {
   res.json({
       msg: 'Put - Update Controller'
   }); 
};

//Actualizar calendario del cliente [Añadir evento]
const putAgregarEvento = async (req, res = response) => {
    const { _id}  = await Cliente.find(req.body._id)
    .then();

    // Acutalizar usuario en la base de datos en el .then()

};

//Actualizar un envento del cliente (Solicitud de reagendación acpetada)
const putActualizarEvento = async (req, res) => {  
    
};
module.exports = {
    nutriologoPost,
    putPredeterminado,
    getPredeterminados,
    getPredeterminado,
    putActualizarDatos,
    putAgregarEvento,
    putActualizarEvento
};