//Librerias
const { response } = require('express');
const sgMail = require('@sendgrid/mail');

//Helpers
const { diferenciaMeses } = require('../helpers/triggers');

//Modelos
const Cliente = require('../models/cliente');
const Nutriologo = require('../models/nutriologo');

//Baneo por inactividad
const baneoAutomatico = async(req, res = response) => {

    try{
        //Nutriólogos
        const nutriologos = await Nutriologo.find({baneado: false});

        for await (let nutriologo of nutriologos) {
            if(diferenciaMeses(new Date(nutriologo.ultima_conexion), new Date(Date.now())) >= 6){
                let desban = new Date(Date.now());  
                desban.setMonth(desban.getMonth() + 6);
                nutriologo.baneado = true;
                nutriologo.fecha_desban = desban;
                await Nutriologo.findByIdAndUpdate(nutriologo._id, nutriologo);
            }
        }

        //Clientes
        const clientes = await Cliente.aggregate([
            {$match: {'baneado': false}}
        ]);

        for await (let cliente of clientes) {
            if(diferenciaMeses(new Date(cliente.ultima_conexion), new Date(Date.now())) >= 6){
                let desban = new Date(Date.now());  
                desban.setMonth(desban.getMonth() + 6);
                cliente.baneado = true;
                cliente.fecha_desban = desban;
                await Cliente.findByIdAndUpdate(cliente._id, cliente);
            }
        }

        res.status(201).json({
            success: true,
            msg: 'Usuarios baneados correctamente'
        });
    }catch(error){
        console.log(error);
        res.status(401).json({
            success: false,
            msg: 'Error al banear usuarios'
        });
    }

}

const avisoBaneo = async (req, res = response) => {

    try{
        //Nutriólogos
        const nutriologos = await Nutriologo.aggregate([
            {$match: {'baneado': false}}
        ]);

        for await (let nutriologo of nutriologos) {
            if(diferenciaMeses(new Date(nutriologo.ultima_conexion), new Date(Date.now())) >= 5){
                //Enviar correo de aviso

                //Mensaje de correo electrónico
                const msg = {
                    to: nutriologo.correo, // Change to your recipient
                    from: 'a18300384@ceti.mx', // Change to your verified sender
                    subject: 'Tu cuenta será suspendida en un mes',
                    text: 'Text',
                    html: 'Hola ' + nutriologo.nombre + ' tu este correo automático es un aviso, pues tu cuenta lleva mucho tiempo inactiva y en un mes, será suspendida',
                }

                //Enviar el correo de respuesta
                sgMail.setApiKey(process.env.TWILIO_EMAIL_KEY);
                sgMail
                .send(msg);

                //Bandera de que fue avisado
                nutriologo.avisado = true;

                await Nutriologo.findByIdAndUpdate(nutriologo._id, nutriologo);
            }
        }

        //Clientes
        const clientes = await Cliente.find({baneado: false, avisado: false});

        for await (let cliente of clientes) {
            if(diferenciaMeses( new Date(cliente.ultima_conexion), new Date(Date.now())) >= 5){
                console.log('Se pasó: ' + cliente.nombre);

                //Enviar correo de aviso
                
                //Mensaje de correo electrónico
                const msg = {
                    to: cliente.correo, // Change to your recipient
                    from: 'a18300384@ceti.mx', // Change to your verified sender
                    subject: 'Tu cuenta será suspendida en un mes',
                    text: 'Text',
                    html: 'Hola ' + cliente.nombre + ' tu este correo automático es un aviso, pues tu cuenta lleva mucho tiempo inactiva y en un mes será suspendida',
                }
    
                //Enviar el correo de respuesta
                sgMail.setApiKey(process.env.TWILIO_EMAIL_KEY);
                sgMail
                .send(msg);

                //Bandera si ya se avisó
                cliente.avisado = true;

                await Cliente.findByIdAndUpdate(cliente._id, cliente);
            }
        }

        res.status(200).json({
            success: true,
            msg: 'Correos enviado correctamente'
        });

    }catch(error){
        console.log(error);
        res.status(400).json({
            success: false,
            msg: 'Error' + error
        });
    }

}

const desbanear = async (req, res = response) => {

    try{
        //Nutriólogos
        const nutriologos = await Nutriologo.find({baneado: false});

        for await (let nutriologo of nutriologos) {
            if(Date.now() >= nutriologo.fecha_desban){
                nutriologo.baneado = false;
                nutriologo.fecha_desban = null;
                nutriologo.avisado = false;
                await Nutriologo.findByIdAndUpdate(nutriologo._id, nutriologo);
            }
        }

        //Clientes
        const clientes = await Cliente.aggregate([
            {$match: {'baneado': true}}
        ]);

        for await (let cliente of clientes) {
            if(Date.now() >= cliente.fecha_desban){
                cliente.baneado = false;
                cliente.fecha_desban = null;
                cliente.avisado = false;
                await Cliente.findByIdAndUpdate(cliente._id, cliente);
            }
        }

        res.status(201).json({
            success: true,
            msg: 'Usuarios desbaneados correctamente'
        });
    }catch(error){
        console.log(error);
        res.status(401).json({
            success: false,
            msg: 'Error al banear usuarios'
        });
    }
}

module.exports = {
    baneoAutomatico,
    avisoBaneo,
    desbanear
}