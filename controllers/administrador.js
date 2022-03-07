const { response } = require('express');
const Cliente = require('../models/cliente');
const Solicitud = require('../models/solicitud_empleo');
const Nutriologo = require('../models/nutriologo');

//Buscar un usuario
const getUser = async(req, res = response) => {
    const clientes = await Cliente.findOne({
        correo: req.body.email
    });
    res.json({
        msg: "Cliente disponibles",
        clientes
    });
};

//Buscar todos los usuarios (Con límite e inicio)
const getAllUsers = async(req, res = response) => {

    const {limit = 10, start = 0} = req.query;

    const [total, users] = await Promise.all([
        Cliente.count(),
        Cliente.find()
            .skip(Number(start))
            .limit(Number(limit))
    ]);

    res.json({
        total,
        users
    });
};

const getNutriologo = async(req, res = response) => {

    const nutriologos = await Nutriologo.findOne({
        correo: req.body.email
    });
    res.json({
        nutriologos
    });
};

const getAllNutri = async(req, res = response) => {
    
    const {limit = 10, start = 0} = req.query;

    const [total, users] = await Promise.all([
        Nutriologo.count(),
        Nutriologo.find()
            .skip(Number(start))
            .limit(Number(limit))
    ]);

    res.json({
        total,
        users
    });
};

const getSolicitudes = async(req, res = response) => {

    const {limit = 10, start = 0} = req.query;
    const estado = { estado: null };
    const [total, solicitudes] = await Promise.all([
        Solicitud.count(),
        Solicitud.find(estado)
            .skip(Number(start))
            .limit(Number(limit))
    ]);

    res.json({
        total,
        solicitudes
    });
};

const postSolicitud = async(req, res = response) => {

    const soli = new Solicitud({
        nombre: req.body.nombre,
        cv: req.body.cv,
        estado: req.body.estado
    });

    await soli.save();

    res.json({
        ok: true,
        soli
    });
};

const putResponderSolicitud = async(req, res = response) => {
    const { id, respuesta } = req.body;

    // Actualizar el objeto
    const solicitud = await Solicitud.findByIdAndUpdate(id, nombre = 'Samuuuu', {new:true});

    res.json({
        msg: 'Patch - Controller',
        solicitud,
        respuesta
    });
}

module.exports = {
    getUser,
    getAllUsers,
    getSolicitudes,
    postSolicitud,
    getAllNutri,
    getNutriologo,
    putResponderSolicitud
}