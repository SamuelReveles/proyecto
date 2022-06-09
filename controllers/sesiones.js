//Librerías externas
const { response } = require('express');

//Helpers
const { googleVerify } = require('../helpers/google-verify');

//Modelos
const Nutriologo = require('../models/nutriologo');
const Cliente = require('../models/cliente');
const Administrador = require('../models/administrador');
const { generarJWT } = require('../helpers/verificacion');


//Log in o registro de google
const logIn = async (req, res = response) => {

    const { id_token } = req.body;

    try {
        
        //Extraer información del id_token
        const { nombre, apellidos, correo } = await googleVerify(id_token);

        //Verificar que esté registrado
        let registrado = false;
        let tipo = '';

        let user = await Cliente.findOne({correo});

        if(!user) user = await Nutriologo.findOne({correo});
        else {
            registrado = true;
            tipo = 'Cliente';
        }

        if(!user) user = await Administrador.findOne({correo});
        else if(tipo === ''){
            registrado = true;
            tipo = 'Nutriólogo';
        } 

        if(user && tipo === '') {
            tipo = 'Administrador';
            registrado = true;
        }

        //Si no está registrado, se envía la información para crear un nuevo registro
        if(registrado === false) res.status(200).json({registrado, nombre, apellidos, correo});

        //Si está registrado, se inicia sesión y se devuelve el jwt
        else {
            const { _id } = user;
            const jwt = await generarJWT(_id);

            res.status(200).json({registrado, jwt, tipo});
        }

    } catch (error) {
        res.status(400).json({
            success: false,
            msg: 'Hubo un error: ' + error.message
        });
    }
}

const verificarCorreo = async (req = request, res = response, next) => {
    //Extraer correo del body
    const correo = req.body.correo;

    //Validar que no esté en la base de datos
    let existeEmail = await Cliente.findOne({correo});
    if(existeEmail) {
        return res.status(200).json({
            registrado: true,
            msg: 'Correo registrado en un cliente'
        });
    }
    else existeEmail = await Nutriologo.findOne({correo});
    if(existeEmail) {
        return res.status(200).json({
            registrado: true,
            msg: 'Correo registrado en un nutriólogo'
        });
    }
    else existeEmail = await Administrador.findOne({correo});
    if(existeEmail) {
        return res.status(200).json({
            registrado: true,
            msg: 'Correo registrado en un administrador'
        });
    }
    else {
        return res.status(200).json({
            registrado: false
        });
    }
}

module.exports = {
    logIn,
    verificarCorreo
}