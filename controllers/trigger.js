//Librerias
const { response } = require('express');
const sgMail = require('@sendgrid/mail');

const isMonday = require('date-fns/isMonday');
const isTuesday = require('date-fns/isTuesday');
const isWednesday = require('date-fns/isWednesday');
const isThursday = require('date-fns/isThursday');
const isFriday = require('date-fns/isFriday');
const isSaturday = require('date-fns/isSaturday');
const isSunday = require('date-fns/isSunday');
const addDays = require('date-fns/addDays');

//Helpers
const { diferenciaMeses, diferenciaDias } = require('../helpers/triggers');

//Modelos
const Cliente = require('../models/cliente');
const Nutriologo = require('../models/nutriologo');
const Reagendacion = require('../models/reagendacion');
const Notificacion = require('../models/notificacion');
const Administrador = require('../models/administrador');
const Servicio = require('../models/servicio')

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
                sgMail.send(msg);

                //Bandera de que fue avisado
                nutriologo.avisado = true;

                //Enviar notificación (guardar en el arreglo notificaciones del nutriólogo)
                const notificacion = new Notificacion('Tu cuenta puede ser suspendida por inactividad');
                let notificaciones = [];

                if(nutriologo.notificaciones) notificaciones = nutriologo.notificaciones;

                notificaciones.push(notificacion);
                nutriologo.notificaciones = notificaciones;
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
                sgMail.send(msg);

                //Bandera si ya se avisó
                cliente.avisado = true;

                //Enviar notificación (guardar en el arreglo notificaciones del cliente)
                const notificacion = new Notificacion('Tu cuenta puede ser suspendida por inactividad');
                let notificaciones = [];

                if(cliente.notificaciones) notificaciones = cliente.notificaciones;

                notificaciones.push(notificacion);
                cliente.notificaciones = notificaciones;
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
        const nutriologos = await Nutriologo.aggregate([
            {$match: {'baneado': true}}
        ]);

        for await (let nutriologo of nutriologos) {
            if(Date.now() >= nutriologo.fecha_desban){
                const notificacion = new Notificacion('Tu cuenta ya no está baneada');
                nutriologo.notificaciones.push(notificacion);
                nutriologo.baneado = false;
                nutriologo.fecha_desban = null;
                nutriologo.avisado = false;
                nutriologo.puntajeBaneo = 0;
                await Nutriologo.findByIdAndUpdate(nutriologo._id, nutriologo);
            }
        }

        //Clientes
        const clientes = await Cliente.aggregate([
            {$match: {'baneado': true}}
        ]);

        for await (let cliente of clientes) {
            if(Date.now() >= cliente.fecha_desban){
                const notificacion = new Notificacion('Tu cuenta ya no está baneada');
                cliente.notificaciones.push(notificacion);
                cliente.baneado = false;
                cliente.fecha_desban = null;
                cliente.avisado = false;
                cliente.puntajeBaneo = 0;
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

//Eliminar notificaciones
const deleteNotificaciones = async(req, res = response) => {
    
    try {
        const clientes = await Cliente.find();
        const nutriologos = await Nutriologo.find();
        const administradores = await Administrador.find()

        //Eliminar de clientes
        for await (let cliente of clientes) {
            let notificaciones = [];
            for (let noti of cliente.notificaciones) {
                if (noti.visto !== false)
                    if(diferenciaDias(noti.visto, new Date()) < 7) 
                        notificaciones.push(noti)
            }
            cliente.notificaciones = notificaciones;
            await Cliente.findByIdAndUpdate(cliente._id, cliente);
        }

        //Eliminar de nutriologos
        for await (let nutriologo of nutriologos) {
            let notificaciones = [];
            for (let noti of nutriologo.notificaciones) {
                if (noti.visto !== false)
                    if(diferenciaDias(noti.visto, new Date()) < 7) 
                        notificaciones.push(noti)
            }
            nutriologo.notificaciones = notificaciones;
            await Nutriologo.findByIdAndUpdate(nutriologo._id, nutriologo);
        }

        //Eliminar de administradores
        for await (let admin of administradores) {
            let notificaciones = [];
            for (let noti of admin.notificaciones) {
                if (noti.visto !== false)
                    if(diferenciaDias(noti.visto, new Date()) < 7) 
                        notificaciones.push(noti)
            }
            admin.notificaciones = notificaciones;
            await Nutriologo.findByIdAndUpdate(admin._id, admin);
        }

        res.status(200).json({
            success: true,
            msg: 'Notificaciones eliminadas correctamente'
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            msg: 'Error: ' + error
        });
    }
    

}

const vigenciaServicios = async(req, res = response) => {
    try {
        const servicios = await Servicio.find();

        servicios.forEach(async (servicio) => {
            if(servicio.fecha_finalizacion < new Date()) 
                await Servicio.findByIdAndUpdate(servicio._id, {vigente: false});
        });
        
        res.status(200).json({
            success: true,
            msg: 'Servicios acutalizados'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            msg: 'Error: ' + error
        });
    }
}

const actualizarFechasNutriologo = async(req, res = response) => {
    try {
        const nutriologos = await Nutriologo.find();
        const today = addDays(new Date(), 1);

        for await (const nutriologo of nutriologos) {
            let nuevasFechasDisponibles;
            let config = nutriologo.configuracion_fechas;
            if(nutriologo.fechasDisponibles) {
                nuevasFechasDisponibles = nutriologo.fechasDisponibles;
                if(isMonday(today)) {
                    nuevasFechasDisponibles.push({
                        fecha: today,
                        horario: config[0]
                    });
                }
                else if(isTuesday(today)) {
                    nuevasFechasDisponibles.push({
                        fecha: today,
                        horario: config[1]
                    });
                }
                else if(isWednesday(today)) {
                    nuevasFechasDisponibles.push({
                        fecha: today,
                        horario: config[2]
                    });
                }
                else if(isThursday(today)) {
                    nuevasFechasDisponibles.push({
                        fecha: today,
                        horario: config[3]
                    });
                }
                else if(isFriday(today)) {
                    nuevasFechasDisponibles.push({
                        fecha: today,
                        horario: config[4]
                    });
                }
                else if(isSaturday(today)) {
                    nuevasFechasDisponibles.push({
                        fecha: today,
                        horario: config[5]
                    });
                }
                else if(isSunday(today)) {
                    nuevasFechasDisponibles.push({
                        fecha: today,
                        horario: config[6]
                    });
                }

                //Eliminar el día anterior
                nuevasFechasDisponibles.shift();
            }
        }
    } catch (error) {
        res.status(400).json({
            success: false,
            msg: 'Error: ' + error
        });
    }
}

module.exports = {
    borrarAutomatico,
    deleteNotificaciones,
    vigenciaServicios,
    actualizarFechasNutriologo,
    avisoBaneo,
    desbanear
}