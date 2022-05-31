const { request, response } = require('express');
const axios = require('axios');
const { ObjectId } = require('mongodb');

//Crear eventos de calendar
const { crearEvento } = require('../helpers/google-verify');

//Modelos
const Historial_pago = require('../models/historial_pago');
const Nutriologo = require('../models/nutriologo');
const Cliente = require('../models/cliente');
const Servicio = require('../models/servicio');

const crearOrden = async(req, res = response) => {
    
    //Extraer datos necesarios para el pago
    const { monto } = req.body;

    try {

        //Evaluar que el monto sea válido
        if(monto <= 0) throw new Error('Monto negativo o nulo');

        //Crear orden con el estándar de paypal
        const order = {
            intent: "CAPTURE",
            purchase_units: [
                {
                    amount: {
                        currency_code: "MXN",
                        value: monto
                    },
                    description: "Servicio de nutrición online"
                },
            ],
            application_context: {
                brand_name: "jopaka.com",
                landing_page: "LOGIN",
                user_action: "PAY_NOW",
                return_url: "http://localhost:8080/api/usuarios/capturarOrden",
                cancel_url: "http://localhost:8080/api/usuarios/cancelarOrden"
            }
        };

        const response = await axios.post(process.env.PAYPAL_URLCALL + '/v2/checkout/orders', order, {
            auth: {
                username: process.env.PAYPAL_CLIENT_ID,
                password: process.env.PAYPAL_SECRET_ID
            },
        });

        const enlace = response.data.links[1];

        res.status(200).json(enlace);

    } catch (error) {
        res.status(400).json({
            success: false,
            msg: 'Ha ocurrido un error',
        });
    }

}

const capturarOrden = async(req, res = response) => {
    try {
        //Datos del pago 
        const { token } = req.query;

        const response = await axios.post(process.env.PAYPAL_URLCALL + '/v2/checkout/orders/' + token + '/capture', {}, {
            auth: {
                username: process.env.PAYPAL_CLIENT_ID,
                password: process.env.PAYPAL_SECRET_ID
            },
        });
        
        //Pago realizado 

        res.status(200).json(response.data);
    } catch (error) {
        res.status(400).json({ 
            success: false,
            msg: 'Hubo un error al ejecutar el pago'
        });
    }
}

const cancelarOrden = async(req, res = response) => {


}

const ordenPagada = async(req, res = response) => {
           
    try {
        let id = req.id;

        id = ObjectId(id);

        let { 
            categoria,
            calendario = false,
            lista_compras = false,
            id_extra = ''
            //horario
        } = req.body;

        let id_nutriologo = ObjectId(req.body.id_nutriologo);

        //Si es para un extra, se cambia id y se cambia el objeto
        const cliente = await Cliente.findById(id);

        const { precio, nombreCompleto, calendario_precio, lista_compras_precio, fechaDisponible } = await Nutriologo.findById(id_nutriologo);

        //Crear objeto a añadir en el registro de pagos
        const historial = new Historial_pago(
            precio,
            cliente.nombre,
            nombreCompleto,
            new Date(),
            categoria
        );

        if(calendario !== false) historial.calendario(calendario_precio);
        if(lista_compras !== false ) historial.lista_compras(lista_compras_precio);

        //Guardar en el registro del cliente
        let historial_cliente = [];
        if(cliente.historial_pagos) historial_cliente = cliente.historial_pagos;
        historial_cliente.push(historial);
        cliente.historial_pagos = historial_cliente;

        await Cliente.findByIdAndUpdate(id, cliente);

        //Crear servicio
        //const fecha_cita = fechaDisponible[fechaDisponible.findIndex(horario)]; //Posible error al convertir con objeto clase fecha

        //Intérvalo en días entre citas según investigaciones
        // let intervalo_citas = 0;

        // switch(categoria) {
        //     case 'Sobrepeso': 
        //         intervalo_citas = 14; // 2 - 4 semanas
        //     break;
        //     case 'Vegano': 
                
        //     break;
        //     case 'Vegano': 
        //     break;
        //     case 'Vegano': 
        //     break;
        //     case 'Vegano': 
        //     break;
        // }

        //Fecha_cita + 10 días
        // const fecha_finalizacion = 0;

        let servicio;

        if(id_extra !== ''){
            servicio = await Servicio.findOne({
                $match: {$and: [{'id_paciente': id_extra}, {'id_nutriologo': id_nutriologo}]}
            });
        }
        else {
            servicio = await Servicio.findOne({
                $match: {$and: [{'id_paciente': id}, {'id_nutriologo': id_nutriologo}]}
            });
        }

        console.log(servicio);

        if(!servicio) {

            console.log('Parece ser que no hay servicio lmao');

            if(id_extra !== ''){
                servicio = new Servicio({
                    id_paciente: id_extra,
                    id_nutriologo,
                    fecha_inicio: new Date(),
                    fecha_cita: new Date(),
                    fecha_finalizacion: new Date(),
                    calendario,
                    lista_compras
                });
            } 
            else {
                servicio = new Servicio({
                    id_paciente: id,
                    id_nutriologo,
                    fecha_inicio: new Date(),
                    fecha_cita: new Date(),
                    fecha_finalizacion: new Date(),
                    calendario,
                    lista_compras
                });
            }

            //Guardar el servicio
            await servicio.save();
        }
        else {
            console.log('Se encontró un servicio previo');
            servicio.fecha_cita = new Date();
            servicio.fecha_finalizacion = new Date();
            servicio.calendario = calendario;
            servicio.lista_compras = lista_compras;
        }

        //Crear el evento de calendar
        await crearEvento(servicio.fecha_inicio, id, id_nutriologo, servicio._id);
        
        res.status(200).json({
            historial: cliente.historial_pagos, 
            servicio
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            msg: 'Hubo un error al crear servicio o historial'
        });
    }
}

module.exports = {
    crearOrden,
    capturarOrden,
    cancelarOrden,
    ordenPagada
}