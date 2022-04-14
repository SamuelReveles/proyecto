//Librerías externas
const { response } = require('express');

//API externas
const client = require('twilio')(process.env.TWILIO_SSID, process.env.TWILIO_AUTH_TOKEN);

//Enviar código al celular
const sendCode = async (req, res = response) => {
    //Cliente / servicio de twilio
    client
        .verify
        .services(process.env.ServiceID)
        .verifications
        .create({
            to: '+' + req.query.celular,
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
            to: '+' + req.query.celular,
            code: req.query.code
        })
        .then(data => {
            res.status(200).send(data);
        });
}

module.exports = {
    verifyCode,
    sendCode
}