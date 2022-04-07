//Librerías externas
const { response } = require('express');
const bcryptjs = require('bcryptjs');

//API externas
const client = require('twilio')(process.env.TWILIO_SSID, process.env.TWILIO_AUTH_TOKEN);

//Modelos
const Cliente = require('../models/cliente');
const Dato = require('../models/dato');
const Nutriologo = require('../models/nutriologo');
const Extra = require('../models/extra');
const Reporte = require('../models/reporte');
const Default = require('../models/default');

//Enviar código al celular
const sendCode = async (req, res = response) => {
    //Cliente / servicio de twilio
    client
        .verify
        .services(process.env.ServiceID)
        .verifications
        .create({
            to: '+' + req.query.celular,
            channel: 'sms'
        })
        .then(data => {
            res.status(200).send(data);
        });
}

//Verificar el código de mensaje
const verifyCode = async (req, res = response) => {
    client  
        .verify
        .services(process.env.ServiceID)
        .verificationChecks
        .create({
            to: '+' + req.query.celular,
            code: req.query.code
        })
        .then(data => {
            res.status(200).send(data);
        });
}

const usuariosPost = async (req, res = response) => {
    
    //Crear datos del cliente
    const datos = new Dato({
        peso: 78.50,
        altura: 180,
        fecha_nacimiento: new Date(2003, 05, 28)
    });

    const user = new Cliente({
        nombre: req.body.nombre,
        apellidos: req.body.apellidos,
        celular: req.body.celular,
        correo: req.body.email,
    });

    await user.save()
        .then(await datos.save());
    
    res.status(201).json({
        ok: true,
        user
    });
}

const usuariosPatch = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'patch API - controller'
    });
};

const usuariosDelete = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'delete API - controller'
    });
};

//Buscar nutriólogo por nombre
const busqueda = async (req, res = response) => {

    // Extraer el nombre
    const nombre = req.query.nombre;

    //Extraer categoría
    const categoria = req.query.categoria;

    //Extablecer limites, superior e inferior
    const {limit = 10, start = 0} = req.query;

    //Variables de respuesta
    let total = 0, users;

    //Si se búsca por nombre
    if(nombre){
        //Extraer los resultados
        users =  await Nutriologo.aggregate([
            {$skip: start},
            {$limit: limit},
            {$match: {'nombreCompleto': nombre}}
        ]);
    }

    else if (categoria) {
        //users = await Nutriologo.find({especialidades: categoria});
        users =  await Nutriologo.aggregate([
            {$skip: start},
            {$limit: limit},
            {$match: {'especialidades': categoria}}
        ]);
    }

    else {
        users = await Nutriologo.aggregate([
            {$skip: start},
            {$limit: limit}
        ]);
    }

    //Modificar calificaciones (enviar promedio)
    for await (let calif of users){
        //Extraer arreglo con calificaciones
        const calificaciones = calif.calificacion;
        
        //Obtener el promedio de los elementos del arreglo
        let promedio = 0;
        if(calificaciones){
            for (const number of calificaciones){
                //Sumar los elementos
                promedio += number;
            }
            
            promedio /= calificaciones.length;
                
            //Guardar en el elemento de respuesta
            calif.calificacion = promedio;
        }
    }  

    //Eliminar resultados e información innecesaria de nutriólogos baneados
    let resultados = [];
    for await (let nutriologo of users){
        if(!nutriologo.baneado){
            const {
                fecha_registro, 
                predeterminados, 
                pacientes,
                baneado,
                reportes,
                correo,
                celular,
                id,
                __v,
                puntajeBaneo,
                ...resto} = nutriologo;
            resultados.push(resto);
        }
    }

    //Total de la búsqueda filtrada
    total = users.length;

    //Responder con los resultados
    res.status(200).json({
        success: true,
        total,
        resultados
    });
}

//Dar de alta un extra
const altaExtras = async (req, res = response) => {

    //Extraer id del body
    const id = req.body.id;

    //Extraer en objeto del cliente con el ID
    const cliente = await Cliente.findById(id);

    //Verificar que no están llenos los extras del cliente
    if(!cliente.extra1 || !cliente.extra2) { 
        
        //Crear el objeto
        const extra = new Extra({
            nombre: req.body.nombre,
            apellidos: req.body.apellidos
        });

        //Guardar en extra1
        if(!cliente.extra1) cliente.extra1 = extra;
        else cliente.extra2 = extra;

        try {
            //Guardar
            await Cliente.findByIdAndUpdate(id, cliente)
            .then(await extra.save());
            res.status(201).json({
                success: true,
                msg: 'Guardado correctamente'
            });
        } catch (error) {
            console.log(error);
            res.status(401).json({
                success: false,
                msg: 'Error al guardar el usuario'
            });
        }
        
    }
    else {
        res.status(400).json({
            success: false,
            msg: "Los extras del cliente están llenos"
        });
    }
}

//Mostrar el progreso
const getProgreso = async (req, res = response) => {

    //Extraer id
    const id = req.query.id;

    //Buscar entre usuarios y extras
    let user = await Cliente.findById(id);

    if (!user) {
        user = await Extra.findById(id);
    }

    //Extraer inicio
    const inicio = await Dato.findById(user.datoInicial);

    //Guardar datos en un arreglo
    let datos = [];

    //Extraer todos los datos a un arreglo
    for await (const _id of user.datoConstante) {
        const dato = await Dato.findById(_id)
        datos.push({peso: dato.peso, altura: dato.altura});
    }

    if(!inicio){
        res.status(400).json({
            success: false,
            inicio: false,
            constantes: false,
            msg: 'Usuario sin datos registrados'
        });
        return;
    }

    res.status(200).json({
        success: true,
        msg: "Encontrado con el ID: " + id,
        inicio,
        datos
    });

}

//Reportar
const reportar = async (req, res = response) => {
    //Extraer datos del reporte
    const { idCliente, idNutriologo, idReporte, msg } = req.body;

    //Crear el reporte
    const reporte = new Reporte({
        emisor: idCliente,
        para: idNutriologo,
        tipo: idReporte,
        msg,
        fecha: Date.now()
    });

    //Guardar reporte
    await reporte.save();

    //Extraer tipo de reporte para saber el puntaje
    const report = await Default.findById(idReporte);
    const nutriologo = await Nutriologo.findById(idNutriologo);

    //Agregar los puntos y push a arreglo de reportes
    nutriologo.puntajeBaneo += report.puntos;

    let reportes = [];
    if(!nutriologo.reportes){
        console.log('Sin reportes');
    }
    else {
        console.log('Con reportes');
        reportes = nutriologo.reportes;
    }
    
    reportes.push(reporte);
    nutriologo.reportes = reportes;

    await Nutriologo.findByIdAndUpdate(idNutriologo, nutriologo)
        .catch( () =>  {
            res.status(401).json({
                success: false,
                msg: 'No se ha logrado reportar'
            });
            return;
        })

    res.status(201).json({
        success: true,
        reporte,
        msg: 'Reportado correctamente'
    });
}

//Calificar de 0 a 5 estrellas al nutriólogo
const calificar = async (req, res = response) => {
    //Extraer datos
    const { id, calificacion } = req.query;

    //Validar que esté dentro del rango
    if(calificacion > 5 || calificacion < 0) {
        res.status(400).json({
            success: false,
            msg: 'Calificación fuera del rango'
        });
        return;
    }

    //Agregar al arreglo del nutriólogo
    const nutriologo = await Nutriologo.findById(id);

    let calificaciones = nutriologo.calificacion;
    calificaciones.push(calificacion);

    //Actualizar objeto
    await Nutriologo.findByIdAndUpdate(id, nutriologo)
    .then(
        res.status(200).json({
            success: true,
            msg: 'Calificado correctamente con ' + calificacion + ' estrellas'
        })
    )
}

module.exports = {
    sendCode,
    verifyCode,
    usuariosPost,
    usuariosDelete,
    usuariosPatch,
    busqueda,
    getProgreso,
    altaExtras,
    reportar,
    calificar
}