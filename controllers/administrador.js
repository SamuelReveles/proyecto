//Librerías externas
const { response } = require('express');
const sgMail = require('@sendgrid/mail');

const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

//Modelos
const Cliente = require('../models/cliente');
const Nutriologo = require('../models/nutriologo');
const Administrador = require('../models/administrador');
const Solicitud_empleo = require('../models/solicitud_empleo');
const Reporte = require('../models/reporte');
const Motivo = require('../models/motivo');

//Obtener información de un usuario
const getUser = async(req, res = response) => {
    try {
        const cliente = await Cliente.findById(req.query.id);
        res.status(200).json({
            success: true,
            cliente
        });
    } catch (error) {
        res.status(400).json({
            success: false
        })
    }
};

//Crear un administrador
const postAdmin = async (req, res = response) => {

    try {

        //Foto de perfil default
        let linkImagen = ' ';

        const admin = new Administrador({
            nombre: req.body.nombre,
            apellidos: req.body.apellidos,
            imagen: linkImagen,
            celular: req.body.celular,
            correo: req.body.correo
        });

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

    //Se establece el límite Motivo
    const {limit = 10, start = 0, baneado = false} = req.query;
    let resultado;

    //Puntaje
    if(req.query.puntaje){
        
        if(Boolean(req.query.mayor) === true) {
            resultado = await Cliente.aggregate([
                {$match: {$and: [{'puntajeBaneo': {$gt: 6}}, {'baneado': Boolean(baneado)}]}},
                {$sort: {'puntajeBaneo': 1}},
                {$skip: Number(start)},
                {$limit: Number(limit)}
            ]);
        }
        else {
            resultado = await Cliente.aggregate([
                {$match: {$and: [{'puntajeBaneo': {$gt: 6}}, {'baneado': Boolean(baneado)}]}},
                {$sort: {'puntajeBaneo': -1}},
                {$skip: Number(start)},
                {$limit: Number(limit)}
            ]);
        }

    }

    //Tiempo de inactividad
    else if(req.query.inactividad){

        //Ordenar
        if(Boolean(req.query.mayor) === true)  {
            resultado = await Cliente.aggregate([
                {$match: {'baneado': Boolean(baneado)}},
                {$sort: {'ultima_conexion': 1}},
                {$skip: Number(start)},
                {$limit: Number(limit)}
            ]);
        }
        else {
            resultado = await Cliente.aggregate([
                {$match: {'baneado': Boolean(baneado)}},
                {$sort: {'ultima_conexion': -1}},
                {$skip: Number(start)},
                {$limit: Number(limit)}
            ]);
        }
    }

    //Tiempo en plataforma o antiguedad
    else if(req.query.antiguedad){

        //Ordenar
        if(Boolean(req.query.mayor) === true) {
            resultado = await Cliente.aggregate([
                {$match: {'baneado': Boolean(baneado)}},
                {$sort: {'fecha_registro': 1}},
                {$skip: Number(start)},
                {$limit: Number(limit)}
            ]);
        }
        else {
            resultado = await Cliente.aggregate([
                {$match: {'baneado': Boolean(baneado)}},
                {$sort: {'fecha_registro': -1}},
                {$skip: Number(start)},
                {$limit: Number(limit)}
            ]);
        }
    }

    else {
        resultado = await Cliente.aggregate([
            {$match: {'baneado': Boolean(baneado)}},
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

    //Se establece el límite Motivo
    const {limit = 10, start = 0, baneado = false} = req.query;
    let resultado;

    //Puntaje
    if(req.query.puntaje){
        
        if(Boolean(req.query.mayor) === true) {
            resultado = await Nutriologo.aggregate([
                {$match: {$and: [{'puntajeBaneo': {$gt: 6}}, {'baneado': Boolean(baneado)}]}},
                {$sort: {'puntajeBaneo': -1}},
                {$skip: Number(start)},
                {$limit: Number(limit)}
            ]);
        }
        else {
            resultado = await Nutriologo.aggregate([
                {$match: {$and: [{'puntajeBaneo': {$gt: 6}}, {'baneado': Boolean(baneado)}]}},
                {$sort: {'puntajeBaneo': 1}},
                {$skip: Number(start)},
                {$limit: Number(limit)}
            ]);
        }

    }

    //Tiempo de inactividad
    else if(req.query.inactividad){

        //Ordenar
        if(Boolean(req.query.mayor) === true)  {
            resultado = await Nutriologo.aggregate([
                {$match: {'baneado': Boolean(baneado)}},
                {$sort: {'ultima_conexion': -1}},
                {$skip: Number(start)},
                {$limit: Number(limit)}
            ]);
        }
        else {
            resultado = await Nutriologo.aggregate([
                {$match: {'baneado': Boolean(baneado)}},
                {$sort: {'ultima_conexion': 1}},
                {$skip: Number(start)},
                {$limit: Number(limit)}
            ]);
        }
    }

    //Tiempo en plataforma o antiguedad
    else if(req.query.antiguedad){

        //Ordenar
        if(Boolean(req.query.mayor) === true) {
            resultado = await Nutriologo.aggregate([
                {$match: {'baneado': Boolean(baneado)}},
                {$sort: {'fecha_registro': 1}},
                {$skip: Number(start)},
                {$limit: Number(limit)}
            ]);
        }
        else {
            resultado = await Nutriologo.aggregate([
                {$match: {'baneado': Boolean(baneado)}},
                {$sort: {'fecha_registro': -1}},
                {$skip: Number(start)},
                {$limit: Number(limit)}
            ]);
        }
    }

    else {
        resultado = await Nutriologo.aggregate([
            {$match: {'baneado': Boolean(baneado)}},
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
}

//Ver todas las solicitudes de empleo
const getSolicitudes = async(req, res = response) => {

    const {limit = 10, start = 0} = req.query;

    const solicitudes = await Solicitud_empleo.aggregate([
        {$skip: start},
        {$limit: limit},
        {$match: {'estado': null}}
    ])

    const total = await Solicitud_empleo.count({estado: null});

    if(!solicitudes) {
        res.status(400).json({
            success: false,
            msg: 'No se encontraron solicitudes'
        });
        return;
    }

    res.status(200).json({
        success: true,
        total,
        solicitudes
    });
};

const postSolicitud = async(req, res = response) => {

    try {
        const soli = new Solicitud_empleo({
            nombre: req.body.nombre,
            cv: req.body.cv,
            correo: req.body.correo
        });
    
        await soli.save();
    
        res.status(201).json({
            success: true,
            soli
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            msg: 'No se ha podido crear la solicitud'
        });
    }
};

//Cambiar de estado la solicitud de empleo
const putResponderSolicitud = async(req, res = response) => {

    try {

        const { id, respuesta } = req.body;

        //Extraer la solicitud de la base de datos
        const solicitud = await Solicitud_empleo.findById(id);
    
        //Cambiar respuesta
        solicitud.estado = respuesta;

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

    const solicitud = await Solicitud_empleo.findById(id)
        .catch(() => {
            res.status(400).json({
                success: false,
                msg: 'No se ha encontrado la solicitud con id ' + id
            });
        })

    if(!solicitud) return;

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
    })

}

//Denegar la solicitud
const solicitudDenied = async (req, res = response) => {

    const id = req.body.id;

    const solicitud = await Solicitud_empleo.findById(id)
    .catch(() => {
        res.status(400).json({
            success: false,
            msg: 'No se ha encontrado la solicitud con id ' + id
        });
    })

    if(!solicitud) return;;

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
    })

}

//Update de los datos del administrador
const adminUpdate = async(req, res = response) => {

    try{

        //Recibir parmetros del body
        const { id, nombre, apellidos, celular } = req.body;

        let tempFilePath;

        if(req.files)
        tempFilePath = req.files.imagen.tempFilePath;

        const admin = await Administrador.findById(id);

        //Actualizar los datos que se llenaron
        if(tempFilePath){

            //Si la foto de perfil NO es la default se borra
            if(admin.imagen != 'LINK DE FOTO DE PERFIL DEFAULT'){
                //Borrar la imagen anterior de cloudinary
            
                //Split del nombre de la imagen
                const nombreArr = admin.imagen.split('/');
                const nombre = nombreArr[nombreArr.length - 1];
                const [ public_id ] = nombre.split('.');

                //Borrar la imagen
                await cloudinary.uploader.destroy(public_id);
            }

            //Subir a cloudinary y extraer el secure_url
            const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
            admin.imagen = secure_url;
        }
        if(nombre) admin.nombre = nombre;
        if(apellidos) admin.apellidos = apellidos;
        if(celular) admin.celular = celular;

        await Administrador.findByIdAndUpdate(id, admin);

        res.status(201).json({
            success: true,
            admin
        });
    } catch (error) {
        console.log(error);
        res.status(401).json({
            success: false,
            msg: 'No fue posible actualizar'
        });
    }
}

//Crear un nuevo motivo
const addMotivo = async(req, res = response) => {
    
    try {
         //Crear el reporte
        const motivo = new Motivo({
            puntos: req.body.puntos,
            descripcion: req.body.descripcion
        });

        await motivo.save();

        res.status(201).json({
            success: true,
            motivo
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            msg: 'No fue posible guardar el motivo'
        })
    }
}

//Mostrar todos los motivos
const getMotivos = async (req, res = response) => {
    
    try {
        const [total, motivos] = await Promise.all([
            Motivo.count(),
            Motivo.find()
        ]);

        res.status(200).json({
            success: true,
            total,
            motivos
        })
    } catch(error) {
        res.status(400).json({
            success: false,
            msg: 'Error al encontrar motivos'
        });
    }
}

//Actualizar el motivo
const updateMotivo = async (req, res = response) => {

    try {

        //ID del motivo
        const id = req.body.id;

        //Datos del motivo
        const {puntos, descripcion} = req.body;

        //Extraer el objeto del motivo
        const motivo = await Motivo.findById(id);

        //Modificar
        if(puntos) motivo.puntos = puntos;
        if(descripcion) motivo.descripcion = descripcion;

        await Motivo.findByIdAndUpdate(id, motivo);
        res.status(201).json({
            success: true,
            motivo
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            msg: 'Error al actualizar el motivo'
        });
    }
}

const reportesUsuario = async (req, res = response) => {

    try {

        //Id del usuario
        const id = req.query.id;

        //Extraer usuario
        let user = await Cliente.findById(id);
        if(!user) user = await Nutriologo.findById(id);

        //Extraer ID's de reportes
        const reportes = user.reportes;

        let listadoReportes = [];

        for await (const _id of reportes) {

            //Reporte dentro del arreglo del usuario
            const {para, tipo, msg} = await Reporte.findById(_id);

            //Extraer el tipo de reporte
            const reporte = await Motivo.findById(tipo);

            //Agrego al arreglo
            listadoReportes.push({para, reporte, msg});

        }
        res.status(200).json({
            success: true,
            listadoReportes
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            msg: 'Error al encontrar usuario'
        })
    }

}

const borrarReporte = async (req, res = response) => {

    try {

        const id = req.query.id;

        const reporte = await Reporte.findById(id);

        if(reporte.borrado === true) {
            res.status(400).json({
                success: false,
                msg: 'El reporte ya ha sido eliminado'
            });
            return;
        }
    
        else reporte.borrado = true;
    
        const {para, tipo} = reporte;
    
        //Extraer objeto del reportado
        let to = await Nutriologo.findById(para);
        let esCliente = false;
        if(!to){
            to = await Cliente.findById(para);
            esCliente = true;
        }
    
        //Extraer el tipo de reporte
        const { puntos } = await Motivo.findById(tipo);
    
        //Reducir los puntos
        to.puntajeBaneo -= puntos;

        //Actualizar objetos
        await Reporte.findByIdAndUpdate(id, reporte);
        if(esCliente) await Cliente.findByIdAndUpdate(para, to);
        else await Nutriologo.findByIdAndUpdate(para, to);
        res.status(201).json({
            success: true,
            msg: 'Reporte eliminado'
        });
    } catch(error) {
        res.status(401).json({
            success: false,
            msg: 'No se pudo actualizar el objeto'
        });
    }

}

const UnBanear = async (req, res = response) => {
    //Id del usuario
    const id = req.query.id;
    
    try {

        //Extraer usuario
        let user = await Cliente.findById(id);

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
    addMotivo,
    getMotivos,
    updateMotivo,
    reportesUsuario,
    UnBanear,
    postAdmin,
    borrarReporte
}