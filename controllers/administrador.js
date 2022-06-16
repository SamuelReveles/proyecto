//Librerías externas
const { response } = require('express');
const sgMail = require('@sendgrid/mail');
const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);
const formatDistance = require('date-fns/formatDistance');
const es = require('date-fns/locale/es');

//Helpers
const { generarJWT } = require('../helpers/verificacion');

//Modelos
const Cliente = require('../models/cliente');
const Nutriologo = require('../models/nutriologo');
const Administrador = require('../models/administrador');
const Reporte = require('../models/reporte');
const Motivo = require('../models/motivo');
const Solicitud = require('../models/solicitud_nutriologo');
const Notificacion = require('../models/notificacion');

//Obtener información de un usuario
const getUser = async(req, res = response) => {
    try {
        const cliente = await Cliente.findById(req.query.id);
        res.status(200).json(cliente);
    } catch (error) {
        res.status(400).json({
            succeess: false
        });
    }
};

//Crear un administrador
const postAdmin = async (req, res = response) => {

    try {

        //Foto de perfil default
        let linkImagen = 'https://res.cloudinary.com/jopaka-com/image/upload/v1655341829/jopaka_admin_f1lgyv.png';

        const admin = new Administrador({
            nombre: req.body.nombre,
            apellidos: req.body.apellidos,
            imagen: linkImagen,
            celular: req.body.celular,
            correo: req.body.correo,
            genero: req.body.genero
        });

        await admin.save();

        const jwt = await generarJWT(admin._id);

        res.status(201).json({admin, jwt});
    } catch (error) {
        res.status(400).json({
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

    for await (const cliente of resultado) {
        try {
            cliente.ultima_conexion = formatDistance(cliente.ultima_conexion, new Date(), { locale: es });
        } catch (error) {
            console.log(error);
        }
    }  

    res.status(200).json(resultado);
};

//Buscar un nutriólogo por correo
const getNutriologo = async(req, res = response) => {

    try {
        const nutriologo = await Nutriologo.findById(req.query.id);
        if(!nutriologo) throw new Error('No coincide');
        res.status(200).json(nutriologo);
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

    for await (const nutriologo of resultado) {
        nutriologo.ultima_conexion = formatDistance(nutriologo.ultima_conexion, new Date(), { locale: es });
    }

    res.status(200).json(resultado);
}

//Ver todas las solicitudes de empleo
const getSolicitudes = async(req, res = response) => {

    const solicitudes = await Solicitud.aggregate([
        {$match: {'estado': null}}
    ])
        .then(res.status(200).json(solicitudes))
        .catch(() => {
            res.status(400).json({
                success: false,
                msg: 'Error al ejectuar la búsqueda'
            });
        })
};

const postSolicitud = async(req, res = response) => {

    try {
        const soli = new Solicitud({
            nombre: req.body.nombre,
            apellidos: req.body.apellidos,
            cedula: req.body.cedula,
            correo: req.body.correo,
            domicilio: req.body.domicilio,
            sexo: req.body.sexo,
            mensaje: req.body.mensaje,
            celular: req.body.celular,
            fecha_nacimiento: req.body.fecha_nacimiento,
            CURP: req.body.CURP
        });

        await soli.save();

        //Enviar notificación (guardar en el arreglo notificaciones del cliente)
        const notificacion = new Notificacion('Nueva solicitud de alta de nutriólogo');

        const admins = await Administrador.find();
        for await (const admin of admins) {
            
            let notificaciones = [];

            if(admin.notificaciones) notificaciones = admin.notificaciones;

            notificaciones.push(notificacion);
            admin.notificaciones = notificaciones;
            await Administrador.findByIdAndUpdate(admin._id, admin);
        }
    
        res.status(201).json(soli);
    } catch (error) {
        res.status(400).json({
            success: false,
            msg: 'No se ha podido crear la solicitud'
        });
    }
};

//Aceptar solicitud
const solicitudAccepted = async (req, res = response) => {

    const id = req.body.id;

    const solicitud = await Solicitud.findById(id)
        .catch(() => {
            res.status(400).json({
                success: false,
                msg: 'No se ha encontrado la solicitud con id ' + id
            });
        })

    if(!solicitud) return;

    //Actualizar la solicitud
    solicitud.estado = true;
    await Solicitud.findByIdAndUpdate(id, solicitud);
    //Eliminar la solicitud

    //Mensaje de correo electrónico
    const msg = {
        to: solicitud.correo, // Change to your recipient
        from: 'a18300384@ceti.mx', // Change to your verified sender
        subject: 'Estado de la solicitud de alta',
        text: 'Text',
        html:'<h1 font-family="Times New Roman"> Solicitud de alta aceptada. Bienvenido a Jopaka</h1><p>Hola ' + solicitud.nombre + 
        'tu solicitud de alta ha sido aceptada, ya puedes iniciar sesión con tu cuenta de nutriologo!</p><img src="./JOPAKA_LOGO.png" alt="logo_jopaka" width="350px" height="75px">'
        //html: 'Hola ' + solicitud.nombre + ' tu solicitud de empleo ha sido aceptada',
    }

    //Registro del nutriólogo
    //Foto de perfil default
    let linkImagen = 'https://res.cloudinary.com/jopaka-com/image/upload/v1650666830/doctor_samuel_zaqdnu.png';


    //Crear el objeto
    const nutriologo = new Nutriologo({
        nombre: solicitud.nombre,
        apellidos: solicitud.apellidos,
        nombreCompleto: solicitud.nombre + ' ' + solicitud.apellidos,
        cedula: solicitud.cedula,
        celular: solicitud.celular,
        correo: solicitud.correo,
        CURP: solicitud.CURP,
        domicilio: solicitud.domicilio,
        imagen: linkImagen,
        sexo: solicitud.genero,
        especialidades: req.body.especialidades 
    });

    await nutriologo.save();

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
    //Eliminar la solicitud

    const msg = {
        to: solicitud.correo, // Change to your recipient
        from: 'a18300384@ceti.mx', // Change to your verified sender
        subject: 'Estado de la solicitud de alta',
        text: 'Text',
        type:'type/html',
        html: '<h1 font-family="Times New Roman"> Solicitud de alta denegada.</h1><p>Hola ' + solicitud.nombre + 
        'tu solicitud de alta ha sido denegada. Por favor en caso de alguna duda ponte en contacto con un administrador' + 
        '- Jopaka </p><img src="./JOPAKA_LOGO.png" alt="logo_jopaka" width="350px" height="75px">',
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
        const { nombre, apellidos, celular } = req.body;

        const id = req.id;

        let tempFilePath;

        if(req.files)
        tempFilePath = req.files.imagen.tempFilePath;

        const admin = await Administrador.findById(id);

        //Actualizar los datos que se llenaron
        if(tempFilePath){

            //Si la foto de perfil NO es la default se borra
            if(admin.imagen != 'https://res.cloudinary.com/jopaka-com/image/upload/v1655341829/jopaka_admin_f1lgyv.png'){
                //Borrar la imagen anterior de cloudinary
            
                //Split del nombre de la imagen
                const nombreArr = admin.imagen.split('/');
                const nombre = nombreArr[nombreArr.length - 1];
                const [ public_id, extension ] = nombre.split('.');
                if(extension != 'png' && extension != 'jpg'){
                    throw new Error('Error en el formato de imagen');
                }
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

        res.status(201).json(admin);
    } catch (error) {
        console.log(error);
        res.status(400).json({
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

        res.status(201).json(motivo);
    } catch (error) {
        res.status(400).json({
            success: false,
            msg: 'No fue posible guardar el motivo'
        });
    }
}

//Mostrar todos los motivos
const getMotivos = async (req, res = response) => {
    
    try {
        const motivos = await Motivo.find();

        res.status(200).json(motivos);
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
        res.status(201).json(motivo);
    } catch (error) {
        res.status(400).json({
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

        for await (const report of reportes) {

            //Reporte dentro del arreglo del usuario
            const {para, tipo, msg, borrado, _id} = await Reporte.findById(report);

            //Extraer el tipo de reporte
            const reporte = await Motivo.findById(tipo);

            //Agrego al arreglo
            listadoReportes.push({para, reporte, msg, borrado, _id});

        }
        res.status(200).json(listadoReportes);
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
        let notificacion;

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
        const { puntos, descripcion } = await Motivo.findById(tipo);
    
        //Reducir los puntos
        to.puntajeBaneo -= puntos;
        notificacion = new Notificacion('Se ha borrado un reporte por ' + descripcion);
        to.notificaciones.push(notificacion);

        //Quitar baneo en caso de tener un puntaje menor al límite
        if(esCliente === true){
            if(to.puntajeBaneo < 5) {
                notificacion = new Notificacion('Tu cuenta ha vuelto del baneo');
                to.baneado = false;
                to.fecha_desban = null;
                to.notificaciones.push(notificacion);
            } 
        }
        else {
            if(to.puntajeBaneo < 15) {
                notificacion = new Notificacion('Tu cuenta ha vuelto del baneo');
                to.baneado = false;
                to.fecha_desban = null;
                to.notificaciones.push(notificacion);
            } 
        }

        //Actualizar objetos
        await Reporte.findByIdAndUpdate(id, reporte);
        if(esCliente) await Cliente.findByIdAndUpdate(para, to);
        else await Nutriologo.findByIdAndUpdate(para, to);
        res.status(201).json({
            success: true
        });
    } catch(error) {
        res.status(400).json({
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
    
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({
            success: true,
            msg: 'No se ha podido desbanear'
        });
    }

}

const getInfo = async (req, res = response)  => {
    //id del admin
    const id = req.id;


    try {
        const admin = await Administrador.findById(id);

        res.status(200).json(admin);  

    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            msg: 'Error al obtener información'
        });
    }
}

module.exports = {
    getUser,
    getAllUsers,
    getInfo,
    getSolicitudes,
    postSolicitud,
    getAllNutri,
    getNutriologo,
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