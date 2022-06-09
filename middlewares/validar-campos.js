const { response, request } = require('express');
const { validationResult } = require('express-validator');

//Modelos
const Cliente = require('../models/cliente');
const Nutriologo = require('../models/nutriologo');
const Administrador = require('../models/administrador');


const validarCampos = (req = request, res = response, next) => {

    const errors = validationResult(req, res);
    if(!errors.isEmpty()){
        return res.status(400).json({
            success: false,
            errors
        });
    }

    next();
}

const validarEspecialidades = (req = request, res = response, next) => {
    //Especialidades validas en la plataforma
    const especialidadesRegistradas = ['Vegetarianos', 'Diabéticos', 'Deportivos', 'Obesidad o sobrepreso', 'Transtornos alimenticios', 'Veganos'];
    const especialidades = req.body.especialidades;
    for (const especialidad of especialidades) {
        if (especialidadesRegistradas.indexOf(especialidad) === -1) {
            return res.status(400).json({
                success: false,
                msg: 'Especialidad inválida'
            });
        }
    }

    next();
}

const validarCelular = async (req = request, res = response, next) => {
    //Extraer celular del body
    let celular = req.body.celular;
    if(celular === undefined) celular = req.query.celular;
    console.log(celular);

    //Validar que no esté en la base de datos
    let celularExiste = await Cliente.findOne({celular});
    if(celularExiste) {
        return res.status(400).json({
            success: false,
            msg: 'Celular registrado'
        });
    }
    celularExiste = await Nutriologo.findOne({celular});
    if(celularExiste) {
        return res.status(400).json({
            success: false,
            msg: 'Celular registrado'
        });
    }
    celularExiste = await Administrador.findOne({celular});
    if(celularExiste) {
        return res.status(400).json({
            success: false,
            msg: 'Celular registrado'
        });
    }
    next();
}

const validarCorreo = async (req = request, res = response, next) => {
    //Extraer correo del body
    const correo = req.body.correo;

    //Validar que no esté en la base de datos
    let existeEmail = await Cliente.findOne({correo});
    if(existeEmail) {
        return res.status(401).json({
            success: false,
            msg: 'Correo registrado'
        });
    }
    existeEmail = await Nutriologo.findOne({correo});
    if(existeEmail) {
        return res.status(401).json({
            success: false,
            msg: 'Correo registrado'
        });
    }
    existeEmail = await Administrador.findOne({correo});
    if(existeEmail) {
        return res.status(401).json({
            success: false,
            msg: 'Correo registrado'
        });
    }

    next();
}

const validarBanCliente = async (req = request, res = response, next) => {
    const id = req.id;

    const cliente = await Cliente.findById(id);

    if(cliente.baneado === true) {
        res.status(401).json({
            success: false,
            msg: 'El usuario está baneado'
        });
    } 
    else {
        next();
    }
}

const validarBanNutriologo = async (req = request, res = response, next) => {
    const id = req.id;

    const nutriologo = await Nutriologo.findById(id);

    if(nutriologo.baneado === true) {
        res.status(401).json({
            success: false,
            msg: 'El nutriólogo está baneado'
        });
    } 
    else {
        next();
    }
}

module.exports = {
    validarCampos,
    validarCorreo,
    validarCelular,
    validarEspecialidades,
    validarBanCliente,
    validarBanNutriologo
}