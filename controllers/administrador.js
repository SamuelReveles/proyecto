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
        const clientes = await Cliente.findById(req.query.id);
        res.status(200).json({
            success: true,
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
        res.status(201).json({
            success: true,
            admin
        })
    } catch (error) {
        res.status(401).json({
            success: false,
            msg: 'Registro inválido'
        });
    }
}

//Buscar todos los usuarios (Con límite e inicio)
const getAllUsers = async(req, res = response) => {

    //Se establece el límite default
    const {limit = 10, start = 0} = req.query;
    let resultado;

    if(req.query.mayor) orden = 1; //De mayor a menor
    else orden = -1; //De menor a mayor

    //Puntaje
    if(req.query.puntaje){
        resultado = await Cliente.aggregate([
            {$skip: Number(start)},
            {$limit: Number(limit)},
            {$match: {'puntajeBaneo': {$gt: 6}}}
        ]);

        //Ordenar
        if(req.query.mayor == true)  resultado.sort((a, b) => b.puntajeBaneo - a.puntajeBaneo);
        else resultado.sort((a, b) => a.puntajeBaneo - b.puntajeBaneo);
    }

    //Tiempo de inactividad
    else if(req.query.inactividad){
        resultado = await Cliente.aggregate([
            {$skip: Number(start)},
            {$limit: Number(limit)},
            {$match: {'baneado': false}}
        ]);

        //Ordenar
        if(req.query.mayor == true)  resultado.sort((a, b) => b.ultima_conexion - a.ultima_conexion);
        else resultado.sort((a, b) => a.ultima_conexion - b.ultima_conexion);
    }

    //Tiempo en plataforma o antiguedad
    else if(req.query.antiguedad){
        resultado = await Cliente.aggregate([
            {$skip: Number(start)},
            {$limit: Number(limit)},
            {$match: {'baneado': false}}
        ]);

        //Ordenar
        if(req.query.mayor == true)  resultado.sort((a, b) => b.fecha_registro - a.fecha_registro);
        else resultado.sort((a, b) => a.fecha_registro - b.fecha_registro);
    }

    else {
        resultado = await Cliente.aggregate([
            {$skip: Number(start)},
            {$limit: Number(limit)}
        ]);
    }

    if(!resultado) {
        res.status(400).json({
            success: false,
            msg: 'Fallo al buscar'
        });
        return;
    }

    res.status(200).json({
        success: true,
        resultado
    });
};

//Buscar un nutriólogo por correo
const getNutriologo = async(req, res = response) => {

    try {
        const nutriologos = await Nutriologo.findById(req.query.id);
        if(!nutriologos) throw new Error('No coincide');
        res.status(200).json({
            success: true,
            nutriologos
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            msg: 'Error al encontrar nutriólogo'
        });
    }
};


//Enlistar todos los nutriólogos
const getAllNutri = async(req, res = response) => {
    
    //Se establece el límite default
    const {limit = 10, start = 0} = req.query;
    let resultado;

    //Ordenes

    //Puntaje
    if(req.query.puntaje){
        resultado = await Nutriologo.aggregate([
            {$sort: {'puntajeBaneo': 1}},
            {$skip: Number(start)},
            {$limit: Number(limit)},
            {$match: {'puntajeBaneo': {$gt: 5}}}
        ])
    }

    //Tiempo de inactividad

    if(req.query.inactividad){
        console.log('Buscando por inactividad');
        resultado = await Nutriologo.aggregate([
            {$sort: {'ultima_conexion': -1}},
            {$skip: start},
            {$limit: limit},
            {$match: {'baneado': false}}
        ])
    }

    //Tiempo en plataforma o antiguedad

    if(req.query.antiguedad){
        resultado = await Nutriologo.aggregate([
            {$sort: {'fecha_registro': 1}},
            {$skip: start},
            {$limit: limit},
            {$match: {'baneado': false}}
        ])
    }

    else {
        resultado = await Nutriologo.aggregate([
            {$skip: Number(start)},
            {$limit: Number(limit)}
        ]);
    }

    if(!resultado) {
        res.status(400).json({
            success: false,
            msg: 'Fallo al buscar'
        });
        return;
    }

    res.status(200).json({
        success: true,
        resultado
    });
};

//Ver todas las solicitudes de empleo
const getSolicitudes = async(req, res = response) => {

    const {limit = 10, start = 0} = req.query;

    const solicitudes = await Solicitud_empleo.aggregate([
        {$skip: start},
        {$limit: limit},
        {$match: {'estado': null}}
    ])

    if(!solicitudes) {
        res.status(400).json({
            success: false,
            msg: 'No se encontraron solicitudes'
        });
        return;
    }

    res.status(200).json({
        success: true,
        total: solicitudes.length,
        solicitudes
    });
};

const postSolicitud = async(req, res = response) => {

    const soli = new Solicitud_empleo({
        nombre: req.body.nombre,
        cv: req.body.cv,
        correo: req.body.correo
    });

    await soli.save()
        .catch(
            res.status(401).json({
            success: false
        }))

    res.status(201).json({
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
            success: false,
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
        res.status(200).json({
            success: true
        });
    })
    .catch((error) => {
        console.error(error);
        res.status(400).json({
            success: false
            });
        return;
    })

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
    
    //Enviar el correo de respuesta
    sgMail.setApiKey(process.env.TWILIO_EMAIL_KEY);
    sgMail
    .send(msg)
    .then(() => {
        res.status(200).json({
            success: true
        });
    })
    .catch((error) => {
        console.error(error);
        res.status(400).json({
            success: false
            });
        return;
    })

}

//Update de los datos del administrador
const adminUpdate = async(req, res = response) => {
    //Recibir parmetros del body
    const { id, nombre, apellidos, imagen } = req.body;

    const admin = await Administrador.findById(id)
        .catch(
            res.status(400).json({
            success: false,
            msg: 'No fue posible encontrar al admnistrador'
        }))

    try{
        //Actualizar los datos que se llenaron
        if(nombre) admin.nombre = nombre;
        if(apellidos) admin.apellidos = apellidos;
        if(imagen) admin.imagen = imagen;

        await Administrador.findByIdAndUpdate(id, admin);

        res.status(201).json({
            success: true,
            msg: 'Actualizado correctamente'
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            msg: 'No fue posible actualizar'
        });
    }
}

//Crear un nuevo reporte
const addReporte = async(req, res = response) => {
    
    //Crear el reporte
    const reporte = new Default({
        puntos: req.body.puntos,
        descripcion: req.body.descripcion
    });

    await reporte.save()
        .catch(
            res.status(401).json({
                success: false,
                msg: 'No fue posible guardar el reporte'
            })
        )

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
        res.status(401).json({
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

const borrarReporte = async (req, res = response) => {
    const id = req.query.id;

    const reporte = await Reporte.findById(id);

    if(reporte.borrado === true) res.status(200).json({
        success: false,
        msg: 'El reporte ya ha sido eliminado'
    })

    reporte.borrado = true;

    const {para, tipo} = reporte;

    //Extraer objeto del reportado
    let to = await Nutriologo.findById(para);
    let esCliente = false;
    if(!to){
        to = await Cliente.findById(para);
        esCliente = true;
    }

    //Extraer el tipo de reporte
    const report = await Default.findById(tipo);

    //Reducir los puntos
    to.puntajeBaneo -= report.puntos;

    try {
        //Actualizar objetos
        await Reporte.findByIdAndUpdate(id, reporte);
        if(esCliente) await Cliente.findByIdAndUpdate(para, to);
        else await Nutriologo.findByIdAndUpdate(para, to);
        res.status(201).json({
            success: true,
            msg: 'Reporte eliminado'
        })
    } catch(error) {
        res.status(401).json({
            success: false,
            msg: 'No se pudo actualizar el objeto'
        })
    }

}

const UnBanear = async (req, res = response) => {
    //Id del usuario
    const id = req.query.id;

    //Extraer usuario
    let user = await Cliente.findById(id);
    
    try {
        if(user) {
            //Cambiar bandera de baneo
            user.baneado = false;
    
            //Actualizar usuario
            await Cliente.findByIdAndUpdate(id, user);
        }
        else if(!user) {
            //Cambiar a usuario nutriólogo
            user = await Nutriologo.findById(id);
    
            //Cambiar bandera de baneo
            user.baneado = false;
    
            //Actualizar usuario
            await Nutriologo.findByIdAndUpdate(id, user);
        }
    
        res.status(201).json({
            success: true,
            user,
            msg: 'Usuario baneado correctamente'
        });
    } catch (error) {
        res.status(401).json({
            success: true,
            user,
            msg: 'No se ha podido desbanear'
        });
    }

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
    UnBanear,
    postAdmin,
    borrarReporte
}