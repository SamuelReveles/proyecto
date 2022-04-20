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

        let user = await Cliente.findOne({correo});

        if(!user) user = await Nutriologo.findOne({correo});
        else registrado = true;

        if(!user) user = await Administrador.findOne({correo});
        else registrado = true;

        //Si no está registrado, se envía la información para crear un nuevo registro
        if(!registrado) {
            res.status(200).json({
                success: true,
                registrado: false,
                nombre,
                apellidos, 
                correo
            })
        }

        //Si está registrado, se inicia sesión y se devuelve el jwt
        else {
            const { _id } = user;
            const jwt = await generarJWT(_id);

            res.status(200).json({
                success: true,
                registrado: true,
                jwt,
                msg: 'Sesión iniciada'
            });
        }

    } catch (error) {
        res.status(400).json({
            success: false,
            msg: 'Hubo un error: ' + error.message
        });
    }
}

module.exports = {
    logIn
}