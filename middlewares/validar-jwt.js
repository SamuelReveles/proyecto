const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const validarToken = (req = request, res = response, next) => {
    const token = req.header('jopakatoken');

    //Verificar que haya token en la request
    if(!token) {
        return res.status(400).json({ 
            success: false,
            msg: 'No hay token en la petición'
        });
    }

    try {

        //Verificar que sea válido el jwt
        jwt.verify(token, process.env.SIGNJWT);

    } catch (error) {
        res.status(400).json({ 
            success: false,
            msg: 'Token inválido'
        });
    }
}

module.exports = {
    validarToken
}