//Librerías externas
const { response } = require('express');
const sgMail = require('@sendgrid/mail');

//Modelos
const Cliente = require('../models/cliente');
const Solicitud_empleo = require('../models/solicitud_empleo');
const Nutriologo = require('../models/nutriologo');
const Administrador = require('../models/administrador');
const Reporte = require('../models/reporte');
const Default = require('../models/default');

//Buscar un usuario
const getUser = async(req, res = response) => {
    try {
        const clientes = await Cliente.findOne({
            correo: req.query.correo
        });
        res.status(200).json({
            success: true,
            msg: "Cliente disponibles",
            clientes
        });
    } catch (error) {
        res.status(400).json({
            success: false
        })
    }
};

//Crear un administrador
const postAdmin = async (req, res = response) => {
    const admin = new Administrador({
        nombre: req.body.nombre,
        apellidos: req.body.apellidos,
        imagen: req.body.imagen,
        celular: req.body.celular,
        correo: req.body.correo
    });

    try {
        await admin.save();
    } catch (error) {
        res.status(401).json({
            success: false,
            msg: 'Registro inválido'
        });
        return;
    }

    res.status(201).json({
        success: true,
        admin
    })
}

//Buscar todos los usuarios (Con límite e inicio)
const getAllUsers = async(req, res = response) => {

    //Se establece el límite default
    const {limit = 10, start = 0} = req.query;
    let resultado;
    
    // //Se buscan dentro de la DB
    // const [total, users] = await Promise.all([
    //     Cliente.count(),
    //     Cliente.find()
    //         .skip(Number(start))
    //         .limit(Number(limit))
    // ]);

    //Ordenes

    //Puntaje
    if(req.query.puntaje){
        resultado = await Cliente.aggregate([
            {$sort: {'puntajeBaneo': 1}},
            {$skip: start},
            {$limit: limit},
            {$match: {'puntajeBaneo': {$gt: 6}}}
        ]).catch(() => {
            res.status(400).json({
                success: false,
                msg: 'Fallo al buscar'
            });
        });
    }

    //Tiempo de inactividad


    //

    res.status(200).json({
        success: true,
        resultado
    });
};

//Buscar un nutriólogo por correo
const getNutriologo = async(req, res = response) => {

    try {
        const nutriologos = await Nutriologo.findOne({
            correo: req.body.correo
        });
        res.status(200).json({
            success: true,
            nutriologos
        });
    } catch (error) {
        res.status(400).json({
            success: false
        });
    }
};


//Enlistar todos los nutriólogos
const getAllNutri = async(req, res = response) => {
    
    const {limit = 10, start = 0} = req.query;
    let resultado;
    // const [total, users] = await Promise.all([
    //     Nutriologo.count(),
    //     Nutriologo.find()
    //         .skip(Number(start))
    //         .limit(Number(limit))
    // ]);

    //Ordenes

    //Puntaje
    if(req.query.puntaje){
        console.log('Buscando por puntaje');
        resultado = await Nutriologo.aggregate([
            {$sort: {'puntajeBaneo': 1}},
            {$skip: start},
            {$limit: limit},
            {$match: {'puntajeBaneo': {$gt: 6}}}
        ]).catch(() => {
            res.status(400).json({
                success: false,
                msg: 'Fallo al buscar'
            });
        });
    }

    res.status(200).json({
        success: true,
        resultado
    });
};

//Ver todas las solicitudes de empleo
const getSolicitudes = async(req, res = response) => {

    const {limit = 10, start = 0} = req.query;
    const [total, solicitudes] = await Promise.all([
        Solicitud_empleo.count(),
        Solicitud_empleo.find({ estado:null })
            .skip(Number(start))
            .limit(Number(limit))
    ]);

    res.status(200).json({
        total,
        solicitudes
    });
};

const postSolicitud = async(req, res = response) => {

    const soli = new Solicitud_empleo({
        nombre: req.body.nombre,
        cv: req.body.cv,
        correo: req.body.correo
    });

    await soli.save();

    res.status(200).json({
        success: true,
        soli
    });
};

//Cambiar de estado la solicitud de empleo
const putResponderSolicitud = async(req, res = response) => {

    const { id, respuesta } = req.body;

    //Extraer la solicitud de la base de datos
    const solicitud = await Solicitud_empleo.findById(id);

    //Cambiar respuesta
    solicitud.estado = respuesta;

    try {
        // Actualizar el objeto
        await Solicitud_empleo.findByIdAndUpdate(id);

        res.status(200).json({
            success: true,
            solicitud,
            respuesta
        });
    } catch (error) {
        res.status(400).json({
            success: true,
            solicitud,
            respuesta
        });
    }
}

//Aceptar solicitud
const solicitudAccepted = async (req, res = response) => {

    const id = req.body.id;

    const solicitud = await Solicitud_empleo.findById(id);

    //Actualizar la solicitud
    solicitud.estado = true;
    await Solicitud_empleo.findByIdAndUpdate(id, solicitud);

    //Mensaje de correo electrónico
    const msg = {
        to: solicitud.correo, // Change to your recipient
        from: 'a18300384@ceti.mx', // Change to your verified sender
        subject: 'Estado de la solicitud de empleo',
        text: 'Text',
        html: 'Hola ' + solicitud.nombre + ' tu solicitud de empleo ha sido aceptada',
    }

    //Enviar el correo de respuesta
    sgMail.setApiKey(process.env.TWILIO_EMAIL_KEY);
    sgMail
    .send(msg)
    .then(() => {
        console.log('Email sent');
    })
    .catch((error) => {
        console.error(error);
        res.status(400).json({
            success: false
            });
        return;
    })

    res.status(200).json({
        success: true
    });
}

//Denegar la solicitud
const solicitudDenied = async (req, res = response) => {

    const id = req.body.id;

    const solicitud = await Solicitud.findById(id);

    //Actualizar la solicitud
    solicitud.estado = true;
    await Solicitud.findByIdAndUpdate(id, solicitud);

    const msg = {
        to: solicitud.correo, // Change to your recipient
        from: 'a18300384@ceti.mx', // Change to your verified sender
        subject: 'Estado de la solicitud de empleo',
        text: 'Text',
        html: 'Hola ' + solicitud.nombre + ' tu solicitud de empleo ha sido denegada',
    }
    
    try {
        //Enviar correo de respuesta
        sgMail.setApiKey(process.env.TWILIO_EMAIL_KEY);
        sgMail
            .send(msg)
            .then(() => {
                console.log('Email sent');
            })
            .catch((error) => {
                console.error(error);
            });
        
        res.status(200).json({
            success: true,
            solicitud
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            solicitud
        })
    }
}

//Update de los datos del administrador
const adminUpdate = async(req, res = response) => {
    //Recibir parmetros del body
    const {
        id, 
        nombre,
        apellidos,
        imagen
    } = req.body;

    const admin = await Administrador.findById(id);

    try{
        //Actualizar los datos que se llenaron
        if(nombre) admin.nombre = nombre;
        if(apellidos) admin.apellidos = apellidos;
        if(imagen) admin.imagen = imagen;

        await Administrador.findByIdAndUpdate(id, admin);

        res.status(200).json({
            success: true,
            msg: 'Actualizado correctamente'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            msg: 'No fue posible actualizar'
        });
        console.log(error);
    }
}

//Crear un nuevo reporte
const addReporte = async(req, res = response) => {
    
    //Crear el reporte
    const reporte = new Default({
        puntos: req.body.puntos,
        descripcion: req.body.descripcion
    });

    await reporte.save();

    res.status(201).json({
        success: true,
        reporte
    });
}

//Mostrar todos los reportes
const getReportes = async (req, res = response) => {
    
    try {
        const [total, reportes] = await Promise.all([
            Default.count(),
            Default.find()
        ]);

        res.status(200).json({
            success: true,
            total,
            reportes
        })
    } catch(error) {
        res.status(400).json({
            success: false,
            msg: 'Error al encontrar reportes'
        });
    }
}

const updateReporte = async (req, res = response) => {
    
    //ID del reporte
    const id = req.body.id;

    //Datos del reporte
    const {puntos, descripcion} = req.body;

    //Extraer el objeto del reporte
    const reporte = await Default.findById(id);

    //Modificar
    if(puntos) reporte.puntos = puntos;
    if(descripcion) reporte.descripcion = descripcion;

    try {
        await Default.findByIdAndUpdate(id, reporte);
        res.status(201).json({
            success: true,
            reporte
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            msg: 'Error al actualizar el reporte'
        });
    }
}

const reportesUsuario = async (req, res = response) => {
    
    //Id del usuario
    const id = req.query.id;

    //Extraer usuario
    let user = await Cliente.findById(id);
    if(!user) user = await Nutriologo.findById(id);

    try {
        //Extraer ID's de reportes
        const reportes = user.reportes;

        let listadoReportes = [];

        for await (const _id of reportes) {

            //Reporte dentro de el arreglo del usuario
            const {para, tipo, msg} = await Reporte.findById(_id);

            //Extraer el tipo de reporte
            const reporte = await Default.findById(tipo);

            //Agrego al arreglo
            listadoReportes.push({para, reporte, msg});

        }
        res.status(200).json({
            success: true,
            listadoReportes
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            msg: 'Error al encontrar usuario'
        })
    }

}

const banear = async (req, res = response) => {
    //Id del usuario
    const id = req.query.id;

    //Extraer usuario
    let user = await Cliente.findById(id);
    if(user) {
        //Cambiar bandera de baneo
        user.baneado = true;

        //Actualizar usuario
        await Cliente.findByIdAndUpdate(id, user);
    }
    else if(!user) {
        //Cambiar a usuario nutriólogo
        user = await Nutriologo.findById(id);

        //Cambiar bandera de baneo
        user.baneado = true;

        //Actualizar usuario
        await Nutriologo.findByIdAndUpdate(id, user);
    }

    res.status(200).json({
        success: true,
        user,
        msg: 'Usuario baneado correctamente'
    });

}

module.exports = {
    getUser,
    getAllUsers,
    getSolicitudes,
    postSolicitud,
    getAllNutri,
    getNutriologo,
    putResponderSolicitud,
    solicitudAccepted,
    solicitudDenied,
    adminUpdate,
    addReporte,
    getReportes,
    updateReporte,
    reportesUsuario,
    banear,
    postAdmin
}