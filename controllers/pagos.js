const { request, response } = require('express');
const axios = require('axios');

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
                return_url: "http://localhost:8080/api/trigger/capturarOrden",
                cancel_url: "http://localhost:8080/api/trigger/cancelarOrden"
            }
        };

        const response = await axios.post(process.env.PAYPAL_URLCALL + '/v2/checkout/orders', order, {
            auth: {
                username: process.env.PAYPAL_CLIENT_ID,
                password: process.env.PAYPAL_SECRET_ID
            },
        });

        const enlace = response.data.links[1];

        res.status(200).json({
            success: true,
            enlace
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            msg: 'Ha ocurrido un error',
            error
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

        res.status(200).json({
            success: true,
            data: response.data,
            pagado: true
        });
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
        const id = req.id;

        const { 
            id_nutriologo,
            categoria,
            calendario = false,
            lista_compras = false,
            //horario
        } = req.body;

        let cliente = await Cliente.findById(id);
        const { precio, nombreCompleto, calendario_precio, lista_compras_precio, fechaDisponible } = await Nutriologo.findById(id_nutriologo);

        //Crear objeto a añadir en el registro de pagos
        const historial = new Historial_pago(
            precio,
            cliente.nombre + ' ' + cliente.apellidos,
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

        const servicio = new Servicio({
            id_paciente: id,
            id_nutriologo,
            fecha_inicio: new Date(),
            fecha_cita: new Date(),
            fecha_finalizacion: new Date(),
            calendario,
            lista_compras
        });

        //Guardar el servicio
        await servicio.save();

        res.status(200).json({
            success: true,
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