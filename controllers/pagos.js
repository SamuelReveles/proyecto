const { response } = require('express');
const format = require('date-fns/format');
const es = require('date-fns/locale/es');
const isAfter = require('date-fns/isAfter');
const axios = require('axios');

//Crear eventos de calendar
const { crearEvento } = require('../helpers/google-verify');

//Modelos
const Historial_pago = require('../models/historial_pago');
const Nutriologo = require('../models/nutriologo');
const Cliente = require('../models/cliente');
const Servicio = require('../models/servicio');
const Extra = require('../models/extra');
const Notificacion = require('../models/notificacion');

const crearOrden = async(req, res = response) => {
    
    //Extraer datos necesarios para el pago
    const { id, id_extra = '', dia, hora } = req.body;

    const { precio } = await Nutriologo.findById(id);

    try {

        //Evaluar que el monto sea válido
        if(precio <= 0) throw new Error('Monto negativo o nulo');

        //Crear orden con el estándar de paypal
        const order = {
            intent: "CAPTURE",
            purchase_units: [
                {
                    amount: {
                        currency_code: "MXN",
                        value: precio
                    },
                    description: "Servicio de nutrición online"
                },
            ],
            application_context: {
                brand_name: "Jopaka",
                landing_page: "LOGIN",
                user_action: "PAY_NOW",
                return_url: "https://jopaka-app.herokuapp.com/api/invitado/capturarOrden?id_nutriologo="+ id + "&id=" + req.id + "&id_extra=" + id_extra +
                "&dia=" + dia + '&hora=' + hora,
                cancel_url: "https://jopaka-app.herokuapp.com/#/Jopaka/cliente/dashboard/inicio"
            }
        };

        const response = await axios.post(process.env.PAYPAL_URLCALL + '/v2/checkout/orders', order, {
            auth: {
                username: process.env.PAYPAL_CLIENT_ID,
                password: process.env.PAYPAL_SECRET_ID
            },
        });

        const enlace = response.data.links[1];

        let paciente;
        let cita = true;

        const servicios = Servicio.find();

        if(id_extra !== '') paciente = await Extra.findById(id_extra);
        else paciente = await Cliente.findById(req.id);

        for await (const servicio of servicios) {
            if((String(servicio.id_paciente) == String(paciente._id)) && isAfter(servicio.fecha_cita, new Date())){
                cita = false
                break;
            }
        }

        res.status(200).json({
            enlace,
            nombre: paciente.nombre,
            apellidos: paciente.apellidos,
            sexo: paciente.sexo,
            fecha_nacimiento: paciente.fecha_nacimiento,
            precio,
            cita
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            msg: 'Ha ocurrido un error',
        });
    }

}

const capturarOrden = async(req, res = response) => {
    try {
        //Datos del pago 
        const { token, id_nutriologo, id_extra = '', id, dia, hora } = req.query;

        const response = await axios.post(process.env.PAYPAL_URLCALL + '/v2/checkout/orders/' + token + '/capture', {}, {
            auth: {
                username: process.env.PAYPAL_CLIENT_ID,
                password: process.env.PAYPAL_SECRET_ID
            },
        });
        
        if(response.data.status === 'COMPLETED') {
            await ordenPagada(id, id_extra ,id_nutriologo, dia, hora);
            res.redirect('https://jopaka-app.herokuapp.com/#/Jopaka/cliente/dashboard/inicio');
        }
        else throw new Error('Fallo al hacer el pago');

    } catch (error) {
        console.log(error);
        res.status(400).json({ 
            success: false,
            msg: 'Hubo un error al ejecutar el pago'
        });
    }
}

const ordenPagada = async(id, id_extra = '', id_nutriologo, dia, hora) => {
           
    try {

        //Si es para un extra, se cambia id y se cambia el objeto
        const cliente = await Cliente.findById(id);

        let { precio, nombreCompleto, ingresos, fechaDisponible, calendario } = await Nutriologo.findById(id_nutriologo);

        //Crear objeto a añadir en el registro de pagos
        const historial = new Historial_pago(
            precio,
            cliente.nombre,
            nombreCompleto
        );

        //Nuevos ingresos del nutriólogo
        ingresos += (precio * 0.95); // Rebaja de comisión de Paypal

        //Marcar fecha como ocupada
        fechaDisponible[dia].hora[hora] = false;

        //Guardar en el registro del cliente
        let historial_cliente = [];
        if(cliente.historial_pagos) historial_cliente = cliente.historial_pagos;
        historial_cliente.push(historial);
        cliente.historial_pagos = historial_cliente;

        //Enviar notificación (guardar en el arreglo notificaciones del cliente)
        const notificacion = new Notificacion('Gracias por tu confianza. Recuerda que debes seguir las instrucciones previas que ha dejado el nutriólogo antes de acudir a la cita');
        let notificaciones = [];

        if(cliente.notificaciones) notificaciones = cliente.notificaciones;

        notificaciones.push(notificacion);
        cliente.notificaciones = notificaciones;
        
        await Nutriologo.findByIdAndUpdate(id_nutriologo, {ingresos: ingresos, fechaDisponible: fechaDisponible})
        await Cliente.findByIdAndUpdate(id, cliente);

        //Crear servicio
        const fecha_cita = fechaDisponible[dia].date[hora];

        //Fecha_cita + 30 días
        let fecha_finalizacion = new Date(fecha_cita);
        fecha_finalizacion.setDate(fecha_finalizacion.getDate() + 30);

        let servicio;
        const servicios = await Servicio.find();

        //Buscar servicios previos entre el cliente/extra y el nutriólogo
        if(id_extra !== '') {            
            servicios.forEach(servicioFE => {
                if(servicioFE.id_paciente == id_extra && servicioFE.id_nutriologo == id_nutriologo) {
                    servicio = servicioFE;
                    return;
                }
            });
        }
        else {
            servicios.forEach(servicioFE => {
                if(servicioFE.id_paciente == id && servicioFE.id_nutriologo == id_nutriologo) {
                    servicio = servicioFE;
                    return;
                }
            });
        }

        if(!servicio) {

            if(id_extra !== ''){
                servicio = new Servicio({
                    id_paciente: id_extra,
                    id_nutriologo,
                    fecha_cita,
                    fecha_finalizacion: fecha_finalizacion,
                });
            } 
            else {
                servicio = new Servicio({
                    id_paciente: id,
                    id_nutriologo,
                    fecha_cita,
                    fecha_finalizacion: fecha_finalizacion,
                });
            }

            //Guardar el servicio
            await servicio.save();
        }
        else {
            servicio.fecha_cita = fecha_cita;
            servicio.fecha_finalizacion = fecha_finalizacion;
            servicio.calendario = false;
            servicio.llenado_datos = false;
            servicio.reportesCliente = 2;
            servicio.reportesNutriologo = 2;
            servicio.vigente = true;

            await Servicio.findByIdAndUpdate(servicio._id, servicio);
        }

        let nombreExtra = cliente.nombre + ' ' + cliente.apellidos;

        //Crear el evento de calendar
        if(id_extra !== ''){
            const { nombre, apellidos } = await Extra.findById(id_extra);
            nombreExtra = nombre + ' ' + apellidos;
            await crearEvento(fecha_cita, id, id_nutriologo, servicio._id, nombre);
        }
        else 
            await crearEvento(fecha_cita, id, id_nutriologo, servicio._id);
       
        return{
            status: 200,
            historial: cliente.historial_pagos, 
            success: true,
            servicio
        };

    } catch (error) {
        console.log(error);
        return{
            status: 400,
            success: false
        };
    }
}

module.exports = {
    crearOrden,
    capturarOrden,
    ordenPagada
}