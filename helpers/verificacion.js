//Librerías externas
const { response } = require('express');
const jwt = require('jsonwebtoken');

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

module.exports = {
    verifyCode,
    sendCode,
    generarJWT
}