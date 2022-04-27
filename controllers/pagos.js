const { request, response } = require('express');
const axios = require('axios');

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
                        value: 200
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
        const { token, PayerID } = req.query;

        const response = await axios.post(process.env.PAYPAL_URLCALL + '/v2/checkout/orders/' + token + '/capture', {}, {
            auth: {
                username: process.env.PAYPAL_CLIENT_ID,
                password: process.env.PAYPAL_SECRET_ID
            },
        });
        
        //Pago realizado. Crear objeto de servicio


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

module.exports = {
    crearOrden,
    capturarOrden,
    cancelarOrden
}