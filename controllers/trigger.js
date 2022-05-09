//Librerias
const { response } = require('express');
const sgMail = require('@sendgrid/mail');

//Helpers
const { diferenciaMeses, diferenciaDias } = require('../helpers/triggers');

//Modelos
const Cliente = require('../models/cliente');
const Nutriologo = require('../models/nutriologo');

const { crearEvento } = require('../helpers/google-verify');

//Borrar usuarios por inactividad
const borrarAutomatico = async(req, res = response) => {

    try{
        //Nutriólogos
        const nutriologos = await Nutriologo.find({baneado: false});

        for await (let nutriologo of nutriologos) {
            if(diferenciaMeses(new Date(nutriologo.ultima_conexion), new Date(Date.now())) >= 6){
                //Método de baneo
                // let desban = new Date(Date.now());  
                // desban.setMonth(desban.getMonth() + 6);
                // nutriologo.baneado = true;
                // nutriologo.fecha_desban = desban;
                // await Nutriologo.findByIdAndUpdate(nutriologo._id, nutriologo);
                await Nutriologo.findByIdAndDelete(nutriologo._id);
            }
        }

        //Clientes
        const clientes = await Cliente.aggregate([
            {$match: {'baneado': false}}
        ]);

        for await (let cliente of clientes) {
            if(diferenciaMeses(new Date(cliente.ultima_conexion), new Date(Date.now())) >= 6){
                await Cliente.findByIdAndDelete(cliente._id);
            }
        }

        res.status(201).json({
            success: true,
            msg: 'Usuarios baneados correctamente'
        });
    }catch(error){
        console.log(error);
        res.status(400).json({
            success: false,
            msg: 'Error al banear usuarios'
        });
    }

}

const avisoBaneo = async (req, res = response) => {

    try{
        //Nutriólogos
        const nutriologos = await Nutriologo.find({baneado: false, avisado: false});
        for await (let nutriologo of nutriologos) {
            if(diferenciaDias( new Date(nutriologo.ultima_conexion), new Date(Date.now())) >= 165){
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
            if(diferenciaDias( new Date(cliente.ultima_conexion), new Date(Date.now())) >= 165){
                console.log('Se pasó: ' + cliente.nombre);
                //Enviar correo de aviso
                
                //Mensaje de correo electrónico
                const msg = {
                    to: cliente.correo, // Change to your recipient
                    from: 'a18300384@ceti.mx', // Change to your verified sender
                    subject: 'Tu cuenta será eliminada dentro de unos días',
                    text: 'Text',
                    html: 'Hola ' + cliente.nombre + ' tu este correo automático es un aviso, pues tu cuenta lleva mucho tiempo inactiva y en unos días será suspendida',
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
        res.status(400).json({
            success: false,
            msg: 'Error al banear usuarios'
        });
    }
}

const agendar = async (req, res = response) => {
    const hora_inicio = new Date();
    hora_inicio.setMinutes(hora_inicio.getMinutes() + 15);
    const hora_cierre = new Date();
    hora_cierre.setMinutes(hora_inicio.getMinutes() + 30);
    await crearEvento(hora_inicio, hora_cierre, '6260345d8753a039f90a46e4', '626067f8c1311a76fc759c29');
    res.status(200).json({success: true});
}

//Actualización semanal del historial del cliente
const actualizarHistorial = async(req, res = response) => {
    
    const clientes = await Cliente.find();

    for await (let cliente of clientes) {
        let historial = [];
        if(cliente.historial) historial = cliente.historial;
        //Agregar al arreglo el historial
        //FALTA
    }

}

module.exports = {
    borrarAutomatico,
    avisoBaneo,
    desbanear,
    agendar
}