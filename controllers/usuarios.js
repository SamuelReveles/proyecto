//Librerías externas
const { response } = require('express');
const bcryptjs = require('bcryptjs');
const PDF = require('pdfkit-construct');
const format = require('date-fns/format');
const es = require('date-fns/locale/es');
const sgMail = require('@sendgrid/mail');
const mjml2html = require('mjml');

const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

//helpers
const { generarJWT } = require('../helpers/verificacion');
const { cambiarFecha } = require('../helpers/google-verify');

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
const Notificacion = require('../models/notificacion');
const Administrador = require('../models/administrador');
const Historial = require('../models/historial');


const usuariosPost = async (req, res = response) => {
    
    try {
        //Foto de perfil default
        const linkImagen = 'https://res.cloudinary.com/jopaka-com/image/upload/v1650667218/defaultpfp_hbpjmi.png';

        //Creando objeto
        const user = new Cliente({
            nombre: req.body.nombre,
            apellidos: req.body.apellidos,
            imagen: linkImagen,
            celular: req.body.celular,
            correo: req.body.correo,
            sexo: req.body.sexo,
            fecha_registro: new Date(),
            fecha_nacimiento: req.body.fecha_nacimiento
        });

        await user.save();

        //Iniciar sesión
        const jwt = await generarJWT(user._id);

        //Enviar correo de que se registró
        //Mensaje de correo electrónico

        const htmlOutput = mjml2html(`
            <mjml>
                <mj-body>
                <mj-section>
                    <mj-column>
            
                    <mj-image width="200px" src="https://res.cloudinary.com/jopaka-com/image/upload/v1652058046/JOPAKA_LOGO_lunx6k.png"></mj-image>
            
                    <mj-divider border-color="lightgreen"></mj-divider>
            
                    <mj-text font-size="30px" color="lightgreen" font-family="helvetica" align="center">Bienvenido a Jopaka</mj-text>
            
                    <mj-text font-size="20px" color="black" font-family="helvetica">Ahora puedes usar nuestros servicios dentro de la plataforma, realiza la búsqueda del nutriólogo que necesites. </mj-text>
            
                    <mj-text font-size="20px" color="black" font-family="helvetica">Navega entre las categorías de tus necesidades y da seguimiento a tus consultas</mj-text>
            
                    </mj-column>
                </mj-section>
                </mj-body>
            </mjml>
        `, {
            keepComments: false
        });

        const msg = {
            to: user.correo,
            from: 'a18300384@ceti.mx', 
            subject: '¡BIENVENIDO A JOPAKA!',
            text: 'Text',
            html: htmlOutput.html,
        }

        //Enviar el correo
        sgMail.setApiKey(process.env.TWILIO_EMAIL_KEY);
        sgMail.send(msg);

        res.status(201).json({user, jwt});
    } 
    catch(error) {
        res.status(400).json({
            success: false,
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
                ]);
            }
            else {
                users =  await Nutriologo.aggregate([
                    {$match: {$and: [{'nombreCompleto': nombre}, {'baneado': false}, {'activo': true}]}},
                    {$sort: {'promedio': 1}},
                ]);
            }
        }

        else if(Boolean(req.query.precio) === true){

            if(Boolean(req.query.mayor) === true){
                users =  await Nutriologo.aggregate([
                    {$match: {$and: [{'nombreCompleto': nombre}, {'baneado': false}, {'activo': true}]}},
                    {$sort: {'precio': -1}},
                ]);
            }
            else {
                users =  await Nutriologo.aggregate([
                    {$match: {$and: [{'nombreCompleto': nombre}, {'baneado': false}, {'activo': true}]}},
                    {$sort: {'precio': 1}},
                ]);
            }
        }

        else {
            users =  await Nutriologo.aggregate([
                {$match: {$and: [{'nombreCompleto': nombre}, {'baneado': false}, {'activo': true}]}},
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
                    {$sort: {'promedio': -1}}
                ]);
            }
            else {
                users =  await Nutriologo.aggregate([
                    {$match: {$and: [{'especialidades': categoria}, {'baneado': false}, {'activo': true}]}},
                    {$sort: {'promedio': 1}}
                ]);
            }
        }

        else if(Boolean(req.query.precio) === true){

            if(Boolean(req.query.mayor) === true){
                users =  await Nutriologo.aggregate([
                    {$match: {$and: [{'especialidades': categoria}, {'baneado': false}, {'activo': true}]}},
                    {$sort: {'precio': -1}}
                ]);
            }
            else {
                users =  await Nutriologo.aggregate([
                    {$match: {$and: [{'especialidades': categoria}, {'baneado': false}, {'activo': true}]}},
                    {$sort: {'precio': 1}}
                ]);
            }
        }

        else {
            users =  await Nutriologo.aggregate([
                {$match: {$and: [{'especialidades': categoria}, {'baneado': false}, {'activo': true}]}}
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
                    {$sort: {'promedio': -1}}
                ]);
            }
            else {
                users =  await Nutriologo.aggregate([
                    {$match: {$and: [{'baneado': false}, {'activo': true}]}},
                    {$sort: {'promedio': 1}}
                ]);
            }
        }

        else if(Boolean(req.query.precio) === true){

            if(Boolean(req.query.mayor) === true){
                users =  await Nutriologo.aggregate([
                    {$match: {$and: [{'baneado': false}, {'activo': true}]}},
                    {$sort: {'precio': -1}}
                ]);
            }
            else {
                users =  await Nutriologo.aggregate([
                    {$match: {$and: [{'baneado': false}, {'activo': true}]}},
                    {$sort: {'precio': 1}}
                ]);
            }
        }

        else {
            users =  await Nutriologo.aggregate([
                {$match: {$and: [{'baneado': false}, {'activo': true}]}},
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
            notificaciones,
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
                apellidos: req.body.apellidos,
                sexo: req.body.sexo,
                fecha_nacimiento: new Date(req.body.fecha_nacimiento)
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
        let id = req.id;

        if(req.query.id) id = req.query.id; 

        //Buscar entre usuarios y extras
        let user = await Cliente.findById(id);

        if (!user) {
            user = await Extra.findById(id);
        }

        //Extraer inicio
        const inicio = await Dato.findById(user.datoInicial);

        //Guardar datos en un arreglo
        let masa = [];
        let estatura = [];
        let IMC = [];

        if(inicio) {
            masa.push(inicio.peso);
            estatura.push(inicio.altura);
            let imcInicio = inicio.peso / ((inicio.altura / 100) * (inicio.altura / 100));
            IMC.push(imcInicio);
        }

        //Extraer todos los datos a un arreglo
        for await (const _id of user.datoConstante) {
            const dato = await Dato.findById(_id)
            masa.push(dato.peso);
            estatura.push(dato.altura);
            let imc = dato.peso / ((dato.altura / 100) * (dato.altura / 100));
            IMC.push(imc);
        }

        if(!inicio){
            res.status(400).json({
                success: false,
                msg: 'Usuario sin datos registrados'
            });
            return;
        }

        res.status(200).json({
            success: true,
            peso: masa,
            altura: estatura,
            IMC
        });
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
        const { idServicio, idReporte, msg } = req.body;

        const servicio = await Servicio.findById(idServicio);

        if(servicio.reportesCliente == 0){
            res.status(400).json({
                success: false,
                msg: 'Límite de reportes'
            });
            return;
        }
        
        const idNutriologo = servicio.id_nutriologo;

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

        //Aviso de posible baneo
        if(nutriologo.puntajeBaneo >= 8 && nutriologo.puntajeBaneo <= 14) {
            //Enviar notificación (guardar en el arreglo notificaciones del nutriólogo)
            const notificacion = new Notificacion('Tu cuenta puede ser suspendida por reportes. Revisa tu comportamiento o ponte en contacto con algún administrador');
            let notificaciones = [];

            if(nutriologo.notificaciones) notificaciones = nutriologo.notificaciones;

            notificaciones.push(notificacion);
            nutriologo.notificaciones = notificaciones;
        }

        //Aviso de baneo
        if(nutriologo.puntajeBaneo >= 15) {
            //Enviar notificación (guardar en el arreglo notificaciones del nutriólogo)
            const notificacion = new Notificacion('Tu cuenta ha sido suspendida por reportes. Revisa tu comportamiento o ponte en contacto con algún administrador');
            let notificaciones = [];

            nutriologo.baneado = true;

            if(nutriologo.notificaciones) notificaciones = nutriologo.notificaciones;

            notificaciones.push(notificacion);
            nutriologo.notificaciones = notificaciones;
            //Baneo de dos meses por reportes
            let fecha_desban = new Date();
            fecha_desban.setMonth(fecha_desban.getMonth + 2);
            nutriologo.fecha_desban = fecha_desban;

            //Enviar notificación a los admins
            const notiAdmin = new Notificacion('Nuevo usuario baneado ' + nutriologo.nombreCompleto); //Posible cambio por ID del reporte

            const admins = await Administrador.find();
            for await (const admin of admins) {
                
                let notificaciones = [];

                if(admin.notificaciones) notificaciones = admin.notificaciones;

                notificaciones.push(notiAdmin);
                admin.notificaciones = notificaciones;
                await Administrador.findByIdAndUpdate(admin._id, admin);
            }
        }

        //Aviso de reporte grave a administrador
        if(puntos >= 3) {
            //Enviar notificación
            const notificacion = new Notificacion('Reporte con alto puntaje para ' + nutriologo.nombreCompleto); //Posible cambio por ID del reporte

            const admins = await Administrador.find();
            for await (const admin of admins) {
                
                let notificaciones = [];

                if(admin.notificaciones) notificaciones = admin.notificaciones;

                notificaciones.push(notificacion);
                admin.notificaciones = notificaciones;
                await Administrador.findByIdAndUpdate(admin._id, admin);
            }
        }

        await Nutriologo.findByIdAndUpdate(idNutriologo, nutriologo);
        
        //Guardar reporte
        await reporte.save();

        servicio.reportesCliente -= 1;
        await Servicio.findByIdAndUpdate(idServicio, servicio);

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
    const { id_servicio, calificacion } = req.query;

    //Extraer servicio
    const servicio = await Servicio.findById(id_servicio);

    //Validar que esté dentro del rango y que el servicio esté calificado
    if(calificacion > 5 || calificacion < 0 || servicio.calificado === true) {
        res.status(400).json({
            success: false,
            msg: 'Calificación fuera del rango o el servicio está calificado'
        });
        return;
    }

    //Agregar al arreglo del nutriólogo
    const nutriologo = await Nutriologo.findById(servicio.id_nutriologo)
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
    await Nutriologo.findByIdAndUpdate(servicio.id_nutriologo, nutriologo)
    .then(async () => {
        res.status(201).json({
            success: true,
            msg: 'Calificado correctamente con ' + calificacion + ' estrellas'
        });

        servicio.calificado = true;
        await Servicio.findByIdAndUpdate(id_servicio, servicio);
    }
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

        if(cliente.extra1){
            extra1 = await Extra.findById(cliente.extra1);

            const fecha = format(extra1.fecha_nacimiento, 'dd-MMMM-yyyy', {locale: es});
            const fechaArr = fecha.split('-');
            const fechaString = fechaArr[0] + ' de ' + fechaArr[1] + ' del ' + fechaArr[2];
            
            extra1.fecha_nacimiento = fechaString;
        }
            
        if(cliente.extra2){
            extra2 = await Extra.findById(cliente.extra2);

            const fecha = format(extra2.fecha_nacimiento, 'dd-MMMM-yyyy', {locale: es});
            const fechaArr = fecha.split('-');
            const fechaString = fechaArr[0] + ' de ' + fechaArr[1] + ' del ' + fechaArr[2];
            
            extra2.fecha_nacimiento = fechaString;
        }

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
        //const solicitudes = await Reagendacion.find();

        // let serviciosUsuario = [];
        // const servicios = await Servicio.find();
        // servicios.forEach(servicioFE => {
        //     if(servicioFE.id_paciente == id || servicioFE.id_paciente == extra1._id || servicioFE.id_paciente == extra2._id) {
        //         serviciosUsuario.push(servicioFE);
        //     }
        // })


        res.status(200).json(cliente);
    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            msg: 'Error al encontrar al cliente, verifique el id'
        });
    }
}

const getServicios = async (req, res = response) => {

    try {
        const id = req.id;
        let serviciosUsuario = [];
        const { extra1, extra2, nombre } = await Cliente.findById(id);

        const servicios = await Servicio.find();

        for await (let servicio of servicios) {
            if(servicio.id_paciente == id){
                
                const fecha = format(servicio.fecha_cita, 'dd-MMMM-yyyy', {locale: es});
                const fechaArr = fecha.split('-');
                const fechaString = fechaArr[0] + ' de ' + fechaArr[1] + ' del ' + fechaArr[2];

                const nutriologo = await Nutriologo.findById(servicio.id_nutriologo);

                serviciosUsuario.push({
                    servicio: servicio._id,
                    cita: fechaString,
                    paciente: nombre,
                    id_nutriologo: servicio.id_nutriologo,
                    nutriologo: nutriologo.nombre,
                    imagen: nutriologo.imagen,
                    activo: servicio.vigente
                });
            }
            if(extra1) {
                if (String(extra1) == String(servicio.id_paciente)){
                    const fecha = format(servicio.fecha_cita, 'dd-MMMM-yyyy', {locale: es});
                    const fechaArr = fecha.split('-');
                    const fechaString = fechaArr[0] + ' de ' + fechaArr[1] + ' del ' + fechaArr[2];
    
                    const nutriologo = await Nutriologo.findById(servicio.id_nutriologo);
                    const paciente = await Extra.findById(extra1);
    
                    serviciosUsuario.push({
                        servicio: servicio._id,
                        cita: fechaString,
                        paciente: paciente.nombre,
                        id_nutriologo: servicio.id_nutriologo,
                        nutriologo: nutriologo.nombre,
                        imagen: nutriologo.imagen,
                        activo: servicio.vigente
                    });
                }
            }
            if(extra2) {
                if (String(extra2) == String(servicio.id_paciente)){
                    const fecha = format(servicio.fecha_cita, 'dd-MMMM-yyyy', {locale: es});
                    const fechaArr = fecha.split('-');
                    const fechaString = fechaArr[0] + ' de ' + fechaArr[1] + ' del ' + fechaArr[2];
    
                    const nutriologo = await Nutriologo.findById(servicio.id_nutriologo);
                    const paciente = await Extra.findById(extra2);
    
                    serviciosUsuario.push({
                        servicio: servicio._id,
                        cita: fechaString,
                        paciente: paciente.nombre,
                        id_nutriologo: servicio.id_nutriologo,
                        nutriologo: nutriologo.nombre,
                        imagen: nutriologo.imagen,
                        activo: servicio.vigente
                    });
                }
            }
        }

        res.status(200).json(serviciosUsuario);

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
                const [ public_id, extension ] = nombre.split('.');
                if(extension != 'png' && extension != 'jpg'){
                    throw new Error('Error en el formato de imagen');
                }

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

//Motrar las dietas previas
const getDietas = async (req, res = response) => {
    try {

        //Id del cliente
        const id = req.query.id;

        let cliente = await Cliente.findById(id);
        if(!cliente) cliente = await Extra.findById(id);

        const { historial } = cliente;

        if(!historial) {
            res.status(200);
            return;
        }

        let dietas = [];

        for await (const obj of historial) {

            const dieta = await Historial.findById(obj);

            const fechaArr = format(dieta.fecha, 'dd-MMMM-yyyy', {locale: es}).split('-');
            const fechaString = fechaArr[0] + ' de ' + fechaArr[1] + ' del ' + fechaArr[2];

            dietas.push({
                fecha: fechaString,
                id
            });
        }

        res.status(200).json(dietas);

    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            msg: 'Error al encontrar la lista de dietas'
        });
    }
}

//PDF del historial de dietas del cliente
const mostrarHistorial = async (req, res = response) => {

    try {
        //Id del cliente
        const id = req.query.id;

        //Indice del arreglo del historial de datos del cliente
        const indexHistorial = req.query.indice;

        let cliente = await Cliente.findById(id);
        if(!cliente) cliente = await Extra.findById(id);

        const { historial, nombre } = cliente;

        if(!historial) {
            res.status(200);
            return;
        }

        let historial_indice = historial[indexHistorial];
        let { datos, dieta } = await Historial.findById(historial_indice);

        //Extraer los datos del cliente
        datos = await Dato.findById(datos);

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

        datos = datos.toArray();

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
        console.log(error);
        res.status(400).json({
            success: false,
            msg: 'Hubo un error :/'
        })
    }
}

const listadoPagos = async (req, res = response) => {
    try {
        const id = req.id;

        let historial = [];

        const { historial_pagos } = await Cliente.findById(id);

        for await (pago of historial_pagos) {
            const fechaArr = format(pago.fecha_pago, 'dd-MMMM-yyyy', {locale: es}).split('-');
            const fechaString = fechaArr[0] + ' de ' + fechaArr[1] + ' del ' + fechaArr[2];
            pago.fecha_pago = fechaString;
            historial.push(pago);
        }

        res.status(200).json(historial_pagos);

    } catch (error) {
        console.log(error)
        res.status(400).json({
            success: false,
            msg: 'Hubo un error al ver el historial'
        })
    }
}

const verHistorialPagos = async (req, res = response) => {
    try {
        const id = req.id;

        const { historial_pagos, nombre } = await Cliente.findById(id);

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

        const doc = historial.toPDF();

        //Asignar nombre al archivo
        const filename = 'Resumen_compra_' + nombre + '.pdf';

        //Headers de la respuesta
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
        const { id_servicio, fecha, msg } = req.body;

        const { id_nutriologo, fecha_cita } = await Servicio.findById(id_servicio);

        if(fecha < new Date()) { //Por si ocurre un bug
            res.status(400).json({
                success: false,
                msg: 'Fecha inválida'
            });
            return;
        }

        if(fecha < fecha_cita) { //Por si se quiere reagendar una vez tomada la cita
            res.status(400).json({
                success: false,
                msg: 'Ya fue tomada la cita'
            });
            return;
        }

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

        console.log(error);

        res.status(400).json({
            success: false,
            msg: 'No se ha podido realizar la solicitud'
        });
    }

}

//Rechazar solicitud de reagendación PUT
const rechazarSolicitud = async (req, res = response) => {
    try {
        const { id_solicitud } = req.body;

        const reagendacion = await Reagendacion.findByIdAndUpdate(id_solicitud, {aceptada: false});
        const nutriologo = await Nutriologo.findById(reagendacion.emisor);

        //Enviar notificación (guardar en el arreglo notificaciones del nutriólogo)
        const notificacion = new Notificacion('Tu solicitud de reagendación ha sido rechazada');
        let notificaciones = [];

        if(nutriologo.notificaciones) notificaciones = nutriologo.notificaciones;

        notificaciones.push(notificacion);
        nutriologo.notificaciones = notificaciones;

        await Nutriologo.findByIdAndUpdate(nutriologo._id, nutriologo);

        //Eliminar solicitud
        await Reagendacion.findByIdAndDelete(id_solicitud);

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
        //Datos de solicitud
        const { id_solicitud, fecha } = req.body;

        const reagendacion = await Reagendacion.findByIdAndUpdate(id_solicitud, {aceptada: true});

        const servicio = await Servicio.findById(reagendacion.id_servicio);
        const nutriologo = await Nutriologo.findById(servicio.id_nutriologo);

        let nueva_fecha = new Date();
        nueva_fecha.setDate(nueva_fecha.getDate() + 2);

        //Modificar fecha de evento
        cambiarFecha(servicio, nueva_fecha);

        const fechaArr = format(nueva_fecha, 'dd-MMMM-yyyy', {locale: es}).split('-');
        const fechaString = fechaArr[0] + ' de ' + fechaArr[1] + ' del ' + fechaArr[2];

        //Enviar notificación (guardar en el arreglo notificaciones del nutriólogo)
        const notificacion = new Notificacion('Tu solicitud de reagendación ha sido aceptada para el día ' + fechaString);
        let notificaciones = [];

        if(nutriologo.notificaciones) notificaciones = nutriologo.notificaciones;

        notificaciones.push(notificacion);
        nutriologo.notificaciones = notificaciones;

        await Nutriologo.findByIdAndUpdate(nutriologo._id, nutriologo);

        //Eliminar solicitud
        await Reagendacion.findByIdAndDelete(id_solicitud);

        res.status(201).json(reagendacion);

    } catch (error) {
        res.status(400).json({
            success: false,
            msg: 'No se ha podido aceptar la solicitud'
        })
    }
}

//Quitar ver datos
const estadoVerDatos = async (req, res = response) => {
    try {
        const id_servicio = req.body.id;

        const estado = req.body.estado;

        const servicio = await Servicio.findById(id_servicio);

        servicio.verDatos = estado;

        await Servicio.findByIdAndUpdate(id_servicio, servicio);

        res.status(200).json({
            success: true
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: true,
            msg: 'No se ha podido actualizar el objeto'
        });
    }
}

const getMotivosUsuario = async(req, res = response) => {
    try {
        let motivosUsuario = [];
        
        let temporal = await Motivo.findById('624536db33d1ed94d196ec61');
        motivosUsuario.push(temporal);
        
        temporal = await Motivo.findById('624536e733d1ed94d196ec63');
        motivosUsuario.push(temporal);
        
        temporal = await Motivo.findById('624536e733d1ed94d196ec63');
        motivosUsuario.push(temporal);
        
        temporal = await Motivo.findById('6245371633d1ed94d196ec67');
        motivosUsuario.push(temporal);
        
        temporal = await Motivo.findById('6245372033d1ed94d196ec69');
        motivosUsuario.push(temporal);
        
        temporal = await Motivo.findById('6245372833d1ed94d196ec6b');
        motivosUsuario.push(temporal);
        
        temporal = await Motivo.findById('6245373e33d1ed94d196ec6d');
        motivosUsuario.push(temporal);

        res.status(200).json(motivosUsuario);
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error: ' + error
        });
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
    rechazarSolicitud,
    aceptarSolicitud,
    estadoVerDatos,
    getMotivosUsuario,
    getServicios,
    getDietas
}