//Librerías externas
const { response } = require('express');
const bcryptjs = require('bcryptjs');
const PDF = require('pdfkit-construct');

const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

//helpers
const { generarJWT } = require('../helpers/verificacion');

//Modelos
const Cliente = require('../models/cliente');
const Dato = require('../models/dato');
const Nutriologo = require('../models/nutriologo');
const Extra = require('../models/extra');
const Reporte = require('../models/reporte');
const Motivo = require('../models/motivo');
const Historial_Pago = require('../models/historial_pago');
const Reagendacion = require('../models/reagendacion');
const Servicio = require('../models/servicio');


const usuariosPost = async (req, res = response) => {
    

    try {
        //Foto de perfil default
        let linkImagen = 'https://res.cloudinary.com/jopaka-com/image/upload/v1650667218/defaultpfp_hbpjmi.png';

        //Creando objeto
        const user = new Cliente({
            nombre: req.body.nombre,
            apellidos: req.body.apellidos,
            imagen: linkImagen,
            celular: req.body.celular,
            correo: req.body.correo,
            fecha_registro: Date.now()
        });

        await user.save();

        //Iniciar sesión
        const jwt = await generarJWT(user._id);

        res.status(201).json({user, jwt});
    } 
    catch(error) {
        res.status(400).json({
            succes: false,
            msg: 'Registro inválido'
        })
    }
}

const usuariosDelete = async (req, res = response) => {
   
    //Id del cliente
   const id = req.id;

   try {

        const { baneado } = await Cliente.findById(id);
        if(baneado) throw new Error('Cliente baneado');

        await Cliente.findByIdAndDelete(id);

        res.status(201).json(true);
   } catch (error) {
        res.status(400).json({
            success: false,
            msg: 'No se ha podido eliminar al usuario ' + id
        });
   }
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
        if(Boolean(req.query.estrellas) === true){

            if(Boolean(req.query.mayor) === true){
                users =  await Nutriologo.aggregate([
                    {$match: {$and: [{'nombreCompleto': nombre}, {'baneado': false}, {'activo': true}]}},
                    {$sort: {'promedio': -1}},
                    {$skip: Number(start)},
                    {$limit: Number(limit)}
                ]);
            }
            else {
                users =  await Nutriologo.aggregate([
                    {$match: {$and: [{'nombreCompleto': nombre}, {'baneado': false}, {'activo': true}]}},
                    {$sort: {'promedio': 1}},
                    {$skip: Number(start)},
                    {$limit: Number(limit)}
                ]);
            }
        }

        else if(Boolean(req.query.precio) === true){

            if(Boolean(req.query.mayor) === true){
                users =  await Nutriologo.aggregate([
                    {$match: {$and: [{'nombreCompleto': nombre}, {'baneado': false}, {'activo': true}]}},
                    {$sort: {'precio': -1}},
                    {$skip: Number(start)},
                    {$limit: Number(limit)}
                ]);
            }
            else {
                users =  await Nutriologo.aggregate([
                    {$match: {$and: [{'nombreCompleto': nombre}, {'baneado': false}, {'activo': true}]}},
                    {$sort: {'precio': 1}},
                    {$skip: Number(start)},
                    {$limit: Number(limit)}
                ]);
            }
        }

        else {
            users =  await Nutriologo.aggregate([
                {$match: {$and: [{'nombreCompleto': nombre}, {'baneado': false}, {'activo': true}]}},
                {$skip: Number(start)},
                {$limit: Number(limit)}
            ]);
        }

        total = await Nutriologo.count({nombreCompleto: nombre, activo: true, baneado: false});
    }

    else if (categoria) {

        //Extraer los resultados
        if(Boolean(req.query.estrellas) === true){

            if(Boolean(req.query.mayor) === true){
                users =  await Nutriologo.aggregate([
                    {$match: {$and: [{'especialidades': categoria}, {'baneado': false}, {'activo': true}]}},
                    {$sort: {'promedio': -1}},
                    {$skip: Number(start)},
                    {$limit: Number(limit)}
                ]);
            }
            else {
                users =  await Nutriologo.aggregate([
                    {$match: {$and: [{'especialidades': categoria}, {'baneado': false}, {'activo': true}]}},
                    {$sort: {'promedio': 1}},
                    {$skip: Number(start)},
                    {$limit: Number(limit)}
                ]);
            }
        }

        else if(Boolean(req.query.precio) === true){

            if(Boolean(req.query.mayor) === true){
                users =  await Nutriologo.aggregate([
                    {$match: {$and: [{'especialidades': categoria}, {'baneado': false}, {'activo': true}]}},
                    {$sort: {'precio': -1}},
                    {$skip: Number(start)},
                    {$limit: Number(limit)}
                ]);
            }
            else {
                users =  await Nutriologo.aggregate([
                    {$match: {$and: [{'especialidades': categoria}, {'baneado': false}, {'activo': true}]}},
                    {$sort: {'precio': 1}},
                    {$skip: Number(start)},
                    {$limit: Number(limit)}
                ]);
            }
        }

        else {
            users =  await Nutriologo.aggregate([
                {$match: {$and: [{'especialidades': categoria}, {'baneado': false}, {'activo': true}]}},
                {$skip: Number(start)},
                {$limit: Number(limit)}
            ]);
        }

        total = await Nutriologo.count({especialidades: categoria, activo: true, baneado: false});
    }

    else {
        //Extraer los resultados
        if(Boolean(req.query.estrellas) === true){

            if(Boolean(req.query.mayor) === true){
                users =  await Nutriologo.aggregate([
                    {$match: {$and: [{'baneado': false}, {'activo': true}]}},
                    {$sort: {'promedio': -1}},
                    {$skip: Number(start)},
                    {$limit: Number(limit)}
                ]);
            }
            else {
                users =  await Nutriologo.aggregate([
                    {$match: {$and: [{'baneado': false}, {'activo': true}]}},
                    {$sort: {'promedio': 1}},
                    {$skip: Number(start)},
                    {$limit: Number(limit)}
                ]);
            }
        }

        else if(Boolean(req.query.precio) === true){

            if(Boolean(req.query.mayor) === true){
                users =  await Nutriologo.aggregate([
                    {$match: {$and: [{'baneado': false}, {'activo': true}]}},
                    {$sort: {'precio': -1}},
                    {$skip: Number(start)},
                    {$limit: Number(limit)}
                ]);
            }
            else {
                users =  await Nutriologo.aggregate([
                    {$match: {$and: [{'baneado': false}, {'activo': true}]}},
                    {$sort: {'precio': 1}},
                    {$skip: Number(start)},
                    {$limit: Number(limit)}
                ]);
            }
        }

        else {
            users =  await Nutriologo.aggregate([
                {$match: {$and: [{'baneado': false}, {'activo': true}]}},
                {$skip: Number(start)},
                {$limit: Number(limit)}
            ]);
        }

        total = await Nutriologo.count({activo: true, baneado: false});
    }

    //Eliminar resultados e información innecesaria de nutriólogos baneados
    let resultados = [];
    for await (let nutriologo of users){
        const {
            fecha_registro, 
            predeterminados, 
            pacientes,
            baneado,
            reportes,
            correo,
            celular,
            id,
            puntajeBaneo,
            calificacion,
            activo,
            ...resto} = nutriologo;
        resultados.push(resto);
    }

    if(!resultados) {
        res.status(400).json({
            success: false
        });
        return;
    }

    //Responder con los resultados
    res.status(200).json({total, resultados});
}

//Dar de alta un extra
const altaExtras = async (req, res = response) => {

    //Extraer id del body
    const id = req.id;

    console.log(id);

    //Extraer en objeto del cliente con el ID
    const cliente = await Cliente.findById(id)
        .catch(() => {
            res.status(400).json({
                success: false,
                msg: 'Error al encontrar al cliente'
            });
        });

    if(!cliente) return;

    //Verificar que no están llenos los extras del cliente
    if(!cliente.extra1 || !cliente.extra2) { 

        try {

            //Crear el objeto
            const extra = new Extra({
                nombre: req.body.nombre,
                apellidos: req.body.apellidos
            });

            //Guardar en extra1
            if(!cliente.extra1) cliente.extra1 = extra;
            else cliente.extra2 = extra;

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

    try {
        //Extraer id
        const id = req.id;

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

        res.status(200).json(inicio, datos);
    } catch (error) {
        res.status(400).json({
            success: false,
            msg: 'Error'
        });
    }

}

//Reportar
const reportar = async (req, res = response) => {
   
    try {
         //Extraer datos del reporte
        const { idNutriologo, idReporte, msg } = req.body;

        //Crear el reporte
        const reporte = new Reporte({
            emisor: req.id,
            para: idNutriologo,
            tipo: idReporte,
            msg,
            fecha: Date.now()
        });

        //Extraer tipo de reporte para saber el puntaje
        const { puntos } = await Motivo.findById(idReporte);
        const nutriologo = await Nutriologo.findById(idNutriologo);

        //Agregar los puntos y push a arreglo de reportes
        nutriologo.puntajeBaneo += puntos;

        let reportes = [];
        if(nutriologo.reportes){
            reportes = nutriologo.reportes;
        }
        
        reportes.push(reporte);
        nutriologo.reportes = reportes;

        await Nutriologo.findByIdAndUpdate(idNutriologo, nutriologo);
        
        //Guardar reporte
        await reporte.save();

        res.status(201).json(reporte);
    } catch (error) {
        res.status(400).json({
            success: false,
            msg: 'No se ha logrado reportar'
        });
    }

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
    const nutriologo = await Nutriologo.findById(id)
        .catch(() => {
            res.status(400).json({
                success: false,
                msg: 'Error al encontrar el nutriólogo, verifique el id'
            });
        });

    if(!nutriologo) return;

    let calificaciones = nutriologo.calificacion;
    calificaciones.push(calificacion);

    //Actualizar promedio de calificaciones
    let promedio = 0;
    for (const number of calificaciones){
        //Sumar los elementos
        promedio += number;
    }
    
    promedio /= calificaciones.length;
        
    //Guardar en el elemento de respuesta
    nutriologo.promedio = promedio;
    nutriologo.calificaciones = calificaciones;

    //Actualizar objeto
    await Nutriologo.findByIdAndUpdate(id, nutriologo)
    .then(
        res.status(201).json({
            success: true,
            msg: 'Calificado correctamente con ' + calificacion + ' estrellas'
        })
    )
    .catch(() => {
        res.status(400).json({
            success: false,
            msg: 'Error al actualizar el nutriólogo'
        });
    });
}

//Ver información de un nutriólogo
const getNutriologo = async (req, res = response) => {

    //Id del nutriologo
    const id = req.query.id;

    try {
        const nutriologo = await Nutriologo.findById(id);

        //No mostrar datos de alguien baneado
        if(nutriologo.baneado) throw new Error();

        res.status(200).json(nutriologo);

    } catch (error) {
        res.status(400).json({ 
            success: false,
            msg: 'No fue posible encontrar la información'
        });
    }

}

//Ver extras del cliente
const getExtras = async (req, res = response)  => {

    //Id del cliente
    const id = req.id;

    try {    
        //Objeto del cliente
        const cliente = await Cliente.findById(id);

        let extra1, extra2;

        if(cliente.extra1) extra1 = await Extra.findById(cliente.extra1);
        if(cliente.extra2) extra2 =  await Extra.findById(cliente.extra2);

        res.status(200).json({extra1, extra2});

    } catch (error) {
        res.status(400).json({
            success: false,
            msg: 'Hubo un error: ' + error.message
        })
    }

}

//Ver información del cliente
const getInfo = async (req, res = response)  => {

    try {
        const id = req.id;

        const cliente = await Cliente.findById(id);
        const {extra1, extra2} = cliente;
        
        //Devolver solicitudes de reagendación pendientes
        const solicitudes = await Reagendacion.aggregate([
            {$match: {$or: [{'remitente': id}, {'remitente': extra1}, {'remitente': extra2}]}}
        ])

        const servicios = await Servicio.aggregate([
            {$match: {$or: [{'id_paciente': id}, {'id_paciente': extra1}, {'id_paciente': extra2}]}}
        ])


        res.status(200).json({cliente, solicitudes, servicios});
    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            msg: 'Error al encontrar al cliente, verifique el id'
        });
    }
}

//Actualizar información de usuario
const usuariosUpdate = async (req, res = response) => {
    try{

        //Recibir parmetros del body
        const { nombre, apellidos, celular } = req.body;

        //id de usuario
        const id = req.id;

        let tempFilePath;

        if(req.files)
        tempFilePath = req.files.imagen.tempFilePath;

        const user = await Cliente.findById(id);

        //Actualizar los datos que se llenaron
        if(tempFilePath){

            //Si la foto de perfil NO es la default se borra
            if(user.imagen != 'https://res.cloudinary.com/jopaka-com/image/upload/v1650667218/defaultpfp_hbpjmi.png'){
                //Borrar la imagen anterior de cloudinary
            
                //Split del nombre de la imagen
                const nombreArr = user.imagen.split('/');
                const nombre = nombreArr[nombreArr.length - 1];
                const [ public_id ] = nombre.split('.');

                //Borrar la imagen
                await cloudinary.uploader.destroy(public_id);
            }

            //Subir a cloudinary y extraer el secure_url
            const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
            user.imagen = secure_url;
        }
        if(nombre) user.nombre = nombre;
        if(apellidos) user.apellidos = apellidos;
        if(celular) user.celular = celular;

        await Cliente.findByIdAndUpdate(id, user);

        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({
            success: false,
            msg: 'No fue posible actualizar'
        });
    }
}

//Historial de dietas del cliente
const mostrarHistorial = async (req, res = response) => {

    try {
        //Id del cliente
        const id = req.id;

        const { historial, nombre } = await Cliente.findById(id);

        const dato = new Dato({
            peso: 75,
            altura: 1.80,
            brazo: 80,
            cuello: 60,
            abdomen: 110,
            cadera: 100,
            notas: 'Tomar mucha agua'
        });

        //Extraer los datos del cliente
        //const datos = await Datos.findById(historial.datos);

        //Crear el documento permitiendo que se pueda crear el archivo de salida
        const doc = new PDF({bufferPage: true});

        //Asignar nombre al archivo
        const filename = 'Historial_' + nombre + '_' + Date.now() + '.pdf';

        const stream = res.writeHead(200, {
            'Content-Type': 'application/pdf',
            'Content-disposition': 'attachment; filename=' + filename
        });

        //Fuente usada
        //doc.font('../public/');
        

        //Dieta semanal
        // Logo jopaka
        doc.image(__dirname + '/../src/JOPAKA_LOGO.png', 480, 730, {scale: 0.04})
        doc.fontSize(20);
        doc.text('Dieta de la semana ' + nombre, {
            align: 'center'
        });

        //Datos del cliente
        doc.addPage();
        //Logo jopaka
        doc.image(__dirname + '/../src/JOPAKA_LOGO.png', 480, 730, {scale: 0.04})
        doc.fontSize(20);
        doc.text('Datos de la semana ' + nombre, {
            align: 'center'
        });

        doc.text('\n\n');
        doc.fontSize(15);

        const datos = dato.toArray();

        // set the header to render in every page
        doc.setDocumentHeader({ height : "20%" }, () => {

        });


        doc.addTable([
            {key: 'tipo', label: 'Dato', align: 'center'},
            {key: 'valor', label: 'Valor', align: 'center'}
        ], datos, {
            border: {size: 0.06, color: '#000000'},
            width: "fill_body",
            striped: true,
            stripedColors: ["#E8FFBE", "#D2FF7F"],
            cellsPadding: 10,
            marginLeft: 45,
            marginRight: 45,
            headAlign: 'center',
            headBackground : '#A9E638',
        });

        doc.render();

        doc.on('data', (data) => {
            stream.write(data);
        });

        doc.on('end', () => {
            stream.end();
        });

        doc.end();
    } catch (error) {
        res.status(400).json({
            success: false,
            msg: 'Hubo un error :/'
        })
    }
}

const listadoPagos = async (req, res = response) => {
    try {
        const id = req.id;

        const { historial_pagos } = await Cliente.findById(id);

        res.status(200).json(historial_pagos)

    } catch (error) {
        res.status(400).json({
            success: false,
            msg: 'Hubo un error al ver el historial'
        })
    }
}

const verHistorialPagos = async (req, res = response) => {
    try {
        const id = req.id;

        const { historial_pagos, nombre, apellidos } = await Cliente.findById(id);

        const { 
            precio_servicio,
            nombreCliente,
            nombreNutriologo,
            fecha_pago,
            categoria,
            calendario_precio,
            lista_compras_precio
        } = historial_pagos[req.query.index];

        const historial = new Historial_Pago(
            precio_servicio,
            nombreCliente,
            nombreNutriologo,
            fecha_pago,
            categoria,
            calendario_precio,
            lista_compras_precio
        );

        if(historial_pagos[req.query.index].calendario === true) historial.calendario(calendario_precio);
        if(historial_pagos[req.query.index].lista_compras === true) historial.lista_compras(lista_compras_precio);

        console.log(historial);

        const doc = historial.toPDF();

        // historial.calendario(50);

        //Asignar nombre al archivo
        const filename = 'Resumen_compra_' + nombre + '.pdf';

        const stream = res.writeHead(200, {
            'Content-Type': 'application/pdf',
            'Content-disposition': 'attachment; filename=' + filename
        });

        doc.render();

        doc.on('data', (data) => {
            stream.write(data);
        });

        doc.on('end', () => {
            stream.end();
        });

        doc.end();

    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            msg: 'Hubo un error :/'
        })
    }
}

//Solicitud de reagendación POST
const solicitarReagendacion = async (req, res = response) => {
    
    try {
        //Emisor
        const id_emisor = req.id;

        //Datos del servicio y reagendación
        const { id_nutriologo, id_servicio, fecha, msg } = req.body;

        const reagendacion = new Reagendacion({
            emisor: id_emisor,
            remitente: id_nutriologo,
            id_servicio,
            fecha_nueva: fecha,
            msg,
            aceptada: null
        });

        await reagendacion.save();

        res.status(201).json(reagendacion);
    } catch (error) {
        res.status(400).json({
            success: false,
            msg: 'No se ha podido realizar la solicitud'
        });
    }

}

//Rechazar solicitud de reagendación PUT
const rechazarSolicitud = async (req, res = response) => {
    try {
        const id_solicitud = req.query.id;

        const reagendacion = await Reagendacion.findByIdAndUpdate(id_solicitud, {aceptada: false});

        res.status(201).json(reagendacion);

    } catch (error) {
        res.status(400).json({
            success: false,
            msg: 'No se ha podido rechazar la solicitud'
        })
    }
}

//Aceptar solicitud de reagendación PUT
const aceptarSolicitud = async (req, res = response) => {
    try {
        const { id_solicitud, fecha } = req.body;

        const reagendacion = await Reagendacion.findByIdAndUpdate(id_solicitud, {aceptada: true});

        const servicio = await Servicio.findById(reagendacion.id_servicio);

        cambiarFecha(servicio); //Falta crear el algoritmo

        res.status(201).json(reagendacion);

    } catch (error) {
        res.status(400).json({
            success: false,
            msg: 'No se ha podido rechazar la solicitud'
        })
    }
}

module.exports = {
    usuariosPost,
    usuariosUpdate,
    usuariosDelete,
    busqueda,
    getNutriologo,
    getProgreso,
    altaExtras,
    getExtras,
    getInfo,
    reportar,
    calificar,
    mostrarHistorial,
    verHistorialPagos,
    listadoPagos,
    solicitarReagendacion,
    rechazarSolicitud
}