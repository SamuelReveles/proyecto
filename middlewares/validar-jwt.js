const { response, request } = require('express');
const jwt = require('jsonwebtoken');

//Modelos
const Administrador = require('../models/administrador');
const Nutriologo = require('../models/nutriologo');
const Cliente = require('../models/cliente');

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
        const { id } = jwt.verify(token, process.env.SIGNJWT);

        req.id = id;

        next();

    } catch (error) {
        res.status(400).json({ 
            success: false,
            msg: 'Token inválido'
        });
    }
}

const verificarAdmin = async (req = request, res = response, next) => {
    //Obtener id de req
    const id = req.id;

    //Verificar que sea un admin
    const admin = await Administrador.findById(id);

    if(!admin) {

        res.status(401).json({ 
            success: false,
            msg: 'Token no pertenece a un admin'
        });

    } else next();

}

const verificarNutriologo = async (req = request, res = response, next) => {
    //Obtener id de req
    const id = req.id;

    //Verificar que sea un admin
    const nutriologo = await Nutriologo.findById(id);

    if(!nutriologo) {

        res.status(401).json({ 
            success: false,
            msg: 'Token no pertenece a un Nutriologo'
        });

    } else next();

}

const verificarCliente = async (req = request, res = response, next) => {
    //Obtener id de req
    const id = req.id;

    //Verificar que sea un admin
    const cliente = await Cliente.findById(id);

    if(!cliente) {

        res.status(401).json({ 
            success: false,
            msg: 'Token no pertenece a un cliente'
        });

    } else next();

}

module.exports = {
    validarToken,
    verificarAdmin,
    verificarNutriologo,
    verificarCliente
}