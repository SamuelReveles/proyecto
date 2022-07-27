//Librerías externas
const { response } = require('express');
const jwt = require('jsonwebtoken');

//API externas
const client = require('twilio')(process.env.TWILIO_SSID, process.env.TWILIO_AUTH_TOKEN);

//Modelos
const Cliente = require('../models/cliente');
const Nutriologo = require('../models/nutriologo');
const Administrador = require('../models/administrador');

//Enviar código al celular
const sendCode = async (req, res = response) => {
    //Cliente / servicio de twilio
    client
        .verify
        .services(process.env.ServiceID)
        .verifications
        .create({
            to: '+52' + req.query.celular,
            channel: 'sms'
        })
        .then(data => {
            res.status(200).send(data);
        });
}

//Verificar el código de mensaje
const verifyCode = async (req, res = response) => {
    client  
        .verify
        .services(process.env.ServiceID)
        .verificationChecks
        .create({
            to: '+52' + req.query.celular,
            code: req.query.code
        })
        .then(data => {
            res.status(200).send(data);
        });
}

//Generar el JSONWebToken
const generarJWT = ( id = '' ) => {

    return new Promise( (resolve, reject) => {

        const payload = { id };

        jwt.sign(payload, process.env.SIGNJWT, {
            expiresIn: '8h'
        }, (err, token) => {

            if(err) {
                reject('No se pudo generar el JWT');
            } 
            else{
                resolve(token);
            }

        });

    })

}

//Ver notificaciones
const borrarNotificacion = async (req, res = response) => {

    try {

        const id = req.id;
        let tipo = 'Cliente';

        let user = await Cliente.findById(id);
        if(!user) { 
            user = await Nutriologo.findById(id);
            tipo = 'Nutriólogo';
        }
        if(!user) {
            user = await Administrador.findById(id);
            tipo = 'Administrador';
        }

        let notificaciones = user.notificaciones;

        //Borrar la notificación del arreglo
        notificaciones.splice(req.query.index, 1);
        user.notificaciones = notificaciones;

        switch(tipo) {
            case 'Cliente':
                await Cliente.findByIdAndUpdate(id, {notificaciones});
                break;
            case 'Nutriólogo':
                await Nutriologo.findByIdAndUpdate(id, {notificaciones});
                break;
            case 'Administrador':
                await Administrador.findByIdAndUpdate(id, {notificaciones});
                break;
        }

        res.status(200).json({
            success: true,
            msg: 'Eliminada correctamente'
        });

    } catch ( error ) {

        console.log(error);
        res.status(400).json({
            success: false
        });

    }

}

//Obtener las notificaciones
const getNotificaciones = async (req, res = response) => {
    try {

        const id = req.id;

        let tipo = 'Cliente';
        let user = await Cliente.findById(id);
        if(!user) { 
            user = await Nutriologo.findById(id);
            tipo = 'Nutriólogo';
        }
        if(!user) {
            user = await Administrador.findById(id);
            tipo = 'Administrador';
        }

        let notificaciones = user.notificaciones;

        res.status(200).json({notificaciones});

    } catch ( error ) {
        console.log(error);
        res.status(400).json({
            success: false,
            msg: 'Hubo un error al enviar las notificaciones'
        })
    }
}


//Ver las notificaciones
const verNotificaciones = async (req, res = response) => {
    try {

        const id = req.id;

        let tipo = 'Cliente';
        let user = await Cliente.findById(id);
        if(!user) { 
            user = await Nutriologo.findById(id);
            tipo = 'Nutriólogo';
        }
        if(!user) {
            user = await Administrador.findById(id);
            tipo = 'Administrador';
        }

        let notificaciones = user.notificaciones;
        for (let i = 0; i < notificaciones.length; i++) {
            notificaciones[i].visto = true;
        }

        switch(tipo) {
            case 'Cliente':
                await Cliente.findByIdAndUpdate(id, {notificaciones: notificaciones});
                break;
            case 'Nutriólogo':
                await Nutriologo.findByIdAndUpdate(id, {notificaciones: notificaciones});
                break;
            case 'Administrador':
                await Administrador.findByIdAndUpdate(id, {notificaciones: notificaciones});
                break;
        }

        res.status(200).json({notificaciones});

    } catch ( error ) {
        console.log(error);
        res.status(400).json({
            succes: false,
            msg: 'Error al leer las notificaciones'
        })
    }
}

module.exports = {
    verifyCode,
    sendCode,
    generarJWT,
    borrarNotificacion,
    getNotificaciones,
    verNotificaciones
}