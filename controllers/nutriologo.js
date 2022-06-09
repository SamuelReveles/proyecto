//Librerías externas
const { response } = require('express');
const mongoose = require('mongoose');

const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

//helpers
const { generarJWT } = require('../helpers/verificacion');

//Modelos
const Cliente = require('../models/cliente');
const Dato = require('../models/dato');
const Extra = require('../models/extra');
const Nutriologo = require('../models/nutriologo');
const Predeterminado = require('../models/predeterminado');
const Reporte = require('../models/reporte');
const Motivo = require('../models/motivo');
const Reagendacion = require('../models/reagendacion');
const Notificacion = require('../models/notificacion');
const Servicio = require('../models/servicio');
const Administrador = require('../models/administrador');

//Crear un nuevo nutriologo
const nutriologoPost = async (req, res = response) => {

    try {
            
        //Foto de perfil default
        let linkImagen = 'https://res.cloudinary.com/jopaka-com/image/upload/v1650666830/doctor_samuel_zaqdnu.png';


        //Crear el objeto
        const nutriologo = new Nutriologo({
            nombre: req.body.nombre,
            apellidos: req.body.apellidos,
            nombreCompleto: req.body.nombre + ' ' + req.body.apellidos,
            celular: req.body.celular,
            correo: req.body.correo,
            imagen: linkImagen,
            fecha_registro: Date.now(),
            especialidades: [
                "Vegano",
                "General"
            ]
        });

        await nutriologo.save();

        //Iniciar sesión
        const jwt = await generarJWT(nutriologo._id);

        res.status(201).json({nutriologo, jwt});
    }
    catch (err) {
        res.status(400).json({
            success: false,
            msg: 'Error al agregar a la DB'
        });
    }
}

//Actualizar perfil de usuario
const nutriologoUpdate = async (req, res = response) => {
    try{

        //Recibir parmetros del body
        const { nombre, apellidos, celular } = req.body;

        const id = req.id;

        const { tempFilePath } = req.files.imagen;

        const nutriologo = await Nutriologo.findById(id);

        //Actualizar los datos que se llenaron
        if(tempFilePath){

            //Si la foto de perfil NO es la default se borra
            if(nutriologo.imagen != 'https://res.cloudinary.com/jopaka-com/image/upload/v1650666830/doctor_samuel_zaqdnu.png'){
                //Borrar la imagen anterior de cloudinary
            
                //Split del nombre de la imagen
                const nombreArr = nutriologo.imagen.split('/');
                const nombre = nombreArr[nombreArr.length - 1];
                const [ public_id ] = nombre.split('.');

                //Borrar la imagen
                await cloudinary.uploader.destroy(public_id);
            }

            //Subir a cloudinary y extraer el secure_url
            const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
            nutriologo.imagen = secure_url;
        }
        if(nombre) {
            nutriologo.nombre = nombre;
            nutriologo.nombreCompleto = nutriologo.nombre + ' ' + nutriologo.apellidos;
        }
        if(apellidos) {
            nutriologo.apellidos = apellidos;
            nutriologo.nombreCompleto = nutriologo.nombre + ' ' + nutriologo.apellidos;
        }
        if(celular) nutriologo.celular = celular;

        await Nutriologo.findByIdAndUpdate(id, nutriologo);

        res.status(201).json(nutriologo);
    } catch (error) {
        console.log(error);
        res.status(400).json({
            error,
            success: false,
            msg: 'No fue posible actualizar'
        });
    }
}

//Actualizar perfil sobre servicio
const nutriologoUpdateServicio = async (req, res = response) => {

    try {

        const { precio, descripcion, activo, indicaciones } = req.body;
        const id = req.id;

        const nutriologo = await Nutriologo.findById(id);

        if(precio) nutriologo.precio = precio;
        if(descripcion) nutriologo.descripcion = descripcion;
        if(activo) nutriologo.activo = Boolean(activo);
        if(indicaciones) nutriologo.indicaciones = indicaciones;

        await Nutriologo.findByIdAndUpdate(id, nutriologo);

        res.status(201).json(nutriologo);

    } catch (error) {
        res.status(400).json({
            success: false,
            msg: 'Error al actualizar'
        });
    }

}

//Actualización de fechas disponibles
const fechasUpdate = async (req, res = response) => {
    
    try {
        const id = req.id;

        const nutriologo = await Nutriologo.findById(id);
        let fechas = [];

        let arreglo;

        //Arreglo con 7 días de la semana
        for (let i = 0; i < 7; i++) {

            //Horarios
            for await (const hora of arreglo[i]){
                //Crear un objeto fecha
                let fecha = Fecha(hora, i);

                //Push a las fechas del nutriólogo
                fechas.push(fecha);
            }

        }

        nutriologo.fechaDisponible = fechas;
        await Nutriologo.findByIdAndUpdate(id, nutriologo);

        res.status(200).json(fechas);
    } catch(error) {
        res.status(400).json({
            success: false,
            msg: 'No se han podido actualizar las fechas'
        });
    }

}

//Llenar calendario del paciente
const llenarCalendario = async (req, res = response) => {
    try {
        const id = req.id;
        const id_paciente = req.body.id;
        const cliente = await Cliente.findById(id_paciente);

        const calendario = req.body.calendario;
        const compras = req.body.lista_compras;

        let calendarioCliente = [];

        //Arreglo con 7 días de la semana
        for (let i = 0; i < 7; i++) {

            //Posición 0 = Link meet
            calendarioCliente[i][0] = calendario[i][0];

            //Posición 1 = Desayuno
            calendarioCliente[i][1] = calendario[i][1];

            //Posición 2 = Comida
            calendarioCliente[i][2] = calendario[i][2];

            //Posición 3 = Cena
            calendarioCliente[i][3] = calendario[i][3];

            //Posición 4 = Notas
            calendarioCliente[i][4] = calendario[i][4];

        }

        calendarioCliente[7][0] = compras;

        cliente.calendario = calendarioCliente;

        //Enviar notificación
        const notificacion = new Notificacion('Se ha actualizado tu calendario');
        cliente.notificaciones.push(notificacion);
        await Cliente.findByIdAndUpdate(id_paciente, cliente);

        res.status(200).json(calendarioCliente);

    } catch (error) {
        res.status(400).json({
            success: false,
            msg: 'Error al llenar el calendario del paciente'
        })   
    }
}

// Crear un nuevo alimento predeterminado
const postPredeterminado = async (req, res = response) => {

    //id del nutriólogo
    const id = req.id;

    try {

        const predeterminado = new Predeterminado(req.body.nombre, req.body.texto);

        //Guardar dentro del arreglo del nutriólogo
        const nutriologo = await Nutriologo.findById(id); 

        let predeterminados = nutriologo.predeterminados;

        predeterminados.push(predeterminado);
        nutriologo.predeterminados = predeterminados;

        //Actualizar el objeto
        await Nutriologo.findByIdAndUpdate(id, nutriologo);

        res.status(201).json(predeterminado);
    } catch (error) {
        res.status(400).json({
            success: false,
            msg: 'No fue posible actualizar los alimentos predeterminados'
        });
    }
}

//Mostrar todos alimento predeterminado
const getPredeterminados = async (req, res = response) => {

    const id = req.id;

    try {
        //Buscar al nutriologo
        const { predeterminados } = await Nutriologo.findById(id);

        res.status(200).json(predeterminados);

    } catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            msg: 'No fue posible encontrar los predeterminados'
        })
    }
}

//Mostrar un solo alimento predeterminado
const getPredeterminado = async (req, res = response) => {

    const id = req.id;

    let resultado;

    try {
        const { predeterminados } = await Nutriologo.findById(id);

        for await (const alimento of predeterminados) {
            if(alimento.nombre == req.query.nombre) {
                resultado = alimento;
                break;
            }
        }

        if(!resultado) throw new Error();
        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({
            success: false,
            msg: 'No se encontró el predeterminado'
        });
    }
}

//Actualizar alimento predeterminado
const putPredeterminado = async (req, res = response) => {

    const { nombreAnterior, nuevoNombre, texto } = req.body;

    const id = req.id;

    const nutriologo = await Nutriologo.findById(id)
        .catch(() => {
            res.status(400).json({
                success: false,
                msg: 'No se ha encontrado al nutriólgo'
            });
        });

    if(!nutriologo) return;

    let resultado, anterior;

    //Extraer el objeto del arreglo
    for await (const alimento of nutriologo.predeterminados){
        if(alimento.nombre == nombreAnterior) {
            anterior = alimento;
            resultado = alimento;
            break;
        }
    } 

    if(!resultado){
        res.status(400).json({
            success: false,
            msg: 'No se ha encontrado el alimento predeterminado ' + nombreAnterior
        });
        return;
    }

    //Actualizar el objeto
    if(nuevoNombre) resultado.nombre = nuevoNombre;
    if(texto) resultado.texto = texto;

    const predeterminados = nutriologo.predeterminados;

    //Actualizar el objeto del arreglo
    let index = predeterminados.indexOf(anterior);
    predeterminados[index] = resultado;

    //Actualizar el objeto del nutriologo
    nutriologo.predeterminados = predeterminados;
    await Nutriologo.findByIdAndUpdate(id, nutriologo);

    res.status(201).json(resultado);
}

//Eliminar un alimento predeterminado
const deletePredeterminado = async (req, res = response) => {

    //id del nutriólogo
    const id = req.id;

    //Nombre del alimento predeterminado
    const nombre = req.query.nombre;

    //Objeto del nutriologo
    const nutriologo = await Nutriologo.findById(id)
        .catch(() =>{
            res.status(400).json({
                success: false,
                msg: 'No se ha encontrado al nutriólogo'
            });
        });

    if(!nutriologo) return;

    //Extraer el arreglo del nutriólogo
    let predeterminados = nutriologo.predeterminados;

    let index = 0;
    let encontrado = false;

    //Indice del arreglo que se quiere eliminar
    for await (const alimento of predeterminados) {
        if (alimento.nombre == nombre) {
            encontrado = true;
            break;
        }
        index++;
    }

    if(!encontrado) {
        res.status(400).json({
            success: false,
            msg: 'No se ha encontrado el alimento predeterminado'
        });
        return;
    }

    //Eliminar del objeto del nutriólogo
    predeterminados.splice(index, 1);

    nutriologo.predeterminados = predeterminados;

    await Nutriologo.findByIdAndUpdate(id, nutriologo)
        .catch(() =>{
            res.status(400).json({
                success: false,
                msg: 'No se pudo eliminar el predeterminado dentro del arreglo del nutriólogo'
            });
        })
        .then(
            res.status(201).json({
                success: true,
                msg: 'Eliminado correctamente'
            })
        )

}

//Actualizar datos del nutriólogo
const putActualizarDatos = async (req, res = response) => {

    //Recibir parametro del body
    const { nombre, apellidos, imagen } = req.body;

    const id = req.id;

    try {

        //Buscar al nutriologo
        const nutriologo = await Nutriologo.findById(id);

        //Actualizar datos del nutriólogo que se hayan enviado desde el body
        if(nombre){
            nutriologo.nombre = nombre;
            nutriologo.nombreCompleto = nombre + ' ' + nutriologo.apellidos;
        }
        if(apellidos){
            nutriologo.apellidos = apellidos;
            nutriologo.nombreCompleto = nutriologo.nombre + ' ' + apellidos;
        }
        if(imagen){
            nutriologo.imagen = imagen;
        }
        
        await Nutriologo.findByIdAndUpdate(id, nutriologo);

        res.status(200).json({
            success: true,
            msg: 'Actualizado correctamente'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            msg: 'Error al actualizar en la db'
        });
    }
}

//Actualizar calendario del cliente [Añadir evento]
const putAgregarEvento = async (req, res = response) => {
    const { _id }  = await Cliente.find({_id: req.query.id})
    .then();

    // Acutalizar usuario en la base de datos en el .then()

}

//Actualizar un envento del cliente (Solicitud de reagendación acpetada)
const putActualizarEvento = async (req, res) => {  
    
}

//Ver datos del cliente
const getClientData = async (req, res = response) => {

    try{

        //Extraer datos del query
        const id_servicio = req.query.id;

        const { id_paciente, verDatos } = await Servicio.findById(id_servicio);

        //Buscar si es cliente o extra
        const cliente = await Cliente.findById(id_paciente);
        const extra = await Extra.findById(id_paciente);

        // Si es cliente
        if(cliente){

            //Extraer datos que se van a usar
            const {nombre, apellidos, datoConstante, datoInicial, imagen} = cliente;

            if (verDatos){
                let datos;
                //Si no tiene primeros datos se busca el primer dato
                if(!cliente.datoConstante){
                    datos = await Dato.findById(datoInicial);
                }

                // Si hay datos, se toma el último
                else{
                    const idDato = datoConstante[datoConstante.length - 1];
                    datos = await Dato.findById(idDato);
                }
                
                res.status(200).json({nombre, apellidos, datos, imagen});
            }
            else{
                res.status(400).json({
                    success: false,
                    msg: 'El cliente tienen inhabilitada la visualización de datos. Pídele que lo cambie desde ajustes'
                });
            }

        }

        // Si es extra
        else if(extra){

            //Extraer datos del cliente (extra)
            const {nombre, apellidos, datoInicial, datoConstante, verDatos} = extra;

            //Verificar si está activada la opción de ver datos
            if (verDatos) {
                let datos;
                if(!extra.datoConstante){
                    datos = await Dato.findById(datoInicial);
                }
                else{
                    const idDato = datoConstante[datoConstante.length - 1];
                    datos = await Dato.findById(idDato);
                }
                
                res.status(200).json({nombre, apellidos, datos});
            }
            else{
                let msg = 'El cliente tienen inhabilitada la visualización de datos. Pídele que lo cambie desde ajustes';
                res.status(201).json(msg);
            }
        }

        else res.status(400).json({success: false});
    } catch (error){
        console.log(error);
        res.status(400).json({
            success: false,
            msg: 'Error al encontrar al cliente'
        });
    }

}

//Update datos del clientes
const updateClientData = async (req, res = response) => {

    
    try {
        //Extraer datos del query
        const id_servicio = req.query.id;

        const { id_paciente } = await Servicio.findById(id_servicio);

        //Crear datos del cliente
        const datos = new Dato({
            peso: req.body.peso,
            altura: req.body.altura,
            fecha_nacimiento: req.body.fecha_nacimiento,
            brazo: req.body.brazo,
            cuello: req.body.cuello,
            abdomen: req.body.abdomen,
            cadera: req.body.cadera,
            muslos: req.body.muslos,
            pectoral: req.body.pectoral,
            notas: req.body.notas
        });

        const cliente = await Cliente.findById(id_paciente);
        const extra = await Extra.findById(id_paciente);

        // Si es cliente
        if(cliente){
            if(!cliente.datoInicial){
                await Cliente.findByIdAndUpdate(id_paciente, {datoInicial : datos})
                .then(await datos.save());
                res.status(201).json(datos);
            }
            else {
                cliente.datoConstante.push(datos);
                await Cliente.findByIdAndUpdate(id_paciente, cliente)
                .then(await datos.save());
                res.status(201).json(datos);
            }
        }

        // Si es extra
        else if(extra){

            if(!extra.datoInicial) await Extra.findByIdAndUpdate(id_paciente, {datoInicial : datos});
            else {
                extra.datoConstante.push(datos);
                await Extra.findByIdAndUpdate(id_paciente, extra);
            }

            await datos.save();
            res.status(201).json(datos);

        }
    } catch (error) {
        res.status(400).json({
            success: false, 
            msg: 'No se ha podido actualizar'
        });
    }

}

const getPacientes = async (req, res  = response) => {

    try {
        const id = req.id;

        const { pacientes } = await Nutriologo.findById(id);

        let lista = [];

        for await (const _id of pacientes) {

            const cliente = await Cliente.findById(_id);
            const extra = await Extra.findById(_id);

            // Si es cliente
            if(cliente){
                lista.push({nombre: cliente.nombre, apellidos: cliente.apellidos});
            }

            //Si es extra
            else if(extra){
                lista.push({nombre: extra.nombre, apellidos: extra.apellidos});
            }
        }
        
        res.status(200).json(pacientes);
    } catch (error) {
        res.status(400).json({
            success: false, 
            msg: 'No se encontró al nutriologo, verifique el id'
        });        
    }

}

//Reportar a un paciente
const reportar = async (req, res = response) => {
    
    try {
        //Extraer datos del reporte
        const { idServicio, idReporte, msg } = req.body;

        const servicio = await Servicio.findById(idServicio);

        if(servicio.reportesNutriologo == 0){
            res.status(400).json({
                success: false,
                msg: 'Límite de reportes'
            });
            return;
        } 

        const idCliente = servicio.id_paciente;

        //Crear el reporte
        const reporte = new Reporte({
            emisor: req.id,
            para: idCliente,
            tipo: idReporte,
            msg,
            fecha: Date.now()
        });

        //Extraer tipo de reporte para saber el puntaje
        const { puntos } = await Motivo.findById(idReporte);
        const cliente = await Cliente.findById(idCliente);

        //Agregar los puntos y push a arreglo de reportes
        cliente.puntajeBaneo += puntos;

        let reportes = [];
        if(cliente.reportes) reportes = cliente.reportes;
        
        reportes.push(reporte);
        cliente.reportes = reportes;

        //Aviso de posible baneo
        if(cliente.puntajeBaneo >= 3 && cliente.puntajeBaneo < 5) {
            //Enviar notificación (guardar en el arreglo notificaciones del cliente)
            const notificacion = new Notificacion('Tu cuenta puede ser suspendida por reportes. Revisa tu comportamiento o ponte en contacto con algún administrador');
            let notificaciones = [];

            if(cliente.notificaciones) notificaciones = cliente.notificaciones;

            notificaciones.push(notificacion);
            cliente.notificaciones = notificaciones;
        }

        //Aviso de baneo
        if(cliente.puntajeBaneo >= 5) {
            //Enviar notificación (guardar en el arreglo notificaciones del cliente)
            const notificacion = new Notificacion('Tu cuenta ha sido suspendida por reportes. Revisa tu comportamiento o ponte en contacto con algún administrador');
            let notificaciones = [];

            if(cliente.notificaciones) notificaciones = cliente.notificaciones;

            notificaciones.push(notificacion);
            cliente.notificaciones = notificaciones;

            //Baneo de dos meses por reportes
            let fecha_desban = new Date();
            fecha_desban.setMonth(fecha_desban.getMonth() + 2);
            cliente.fecha_desban = fecha_desban;

            //Enviar notificación a los admins
            const notiAdmin = new Notificacion('Nuevo usuario baneado ' + cliente.nombre + ' ' + cliente.apellidos); //Posible cambio por ID del reporte

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
            //Enviar notificación (guardar en el arreglo notificaciones del cliente)
            const notificacion = new Notificacion('Reporte con alto puntaje para ' + cliente.nombre + ' ' + cliente.apellidos); //Posible cambio por ID del reporte

            const admins = await Administrador.find();
            for await (const admin of admins) {
                
                let notificaciones = [];

                if(admin.notificaciones) notificaciones = admin.notificaciones;

                notificaciones.push(notificacion);
                admin.notificaciones = notificaciones;
                await Administrador.findByIdAndUpdate(admin._id, admin);
            }
        }

        await Cliente.findByIdAndUpdate(idCliente, cliente);

        servicio.reportesNutriologo -= 1;
        await Servicio.findByIdAndUpdate(idServicio, servicio);

        //Guardar reporte
        await reporte.save();

        res.status(201).json(reporte);
    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            msg: 'No se ha logrado reportar'
        });
    }
}

//Información del usuario nutriologo
const getInfo = async (req, res = response) => {

    try {
        //Id del nutriologo
        const id = req.id;

        const solicitudes = await Reagendacion.aggregate([
            {$match: {$and: [{'remitente':id}, {'fecha_finalizacion': {$gt: new Date()}}]}}
        ])

        const nutriologo = await Nutriologo.findById(id)


        res.status(200).json({nutriologo, solicitudes});
    } catch (error) {
        res.status(400).json({
            success: false,
            msg: 'Error al encontrar el nutriólogo, verifique el id'
        });
    }

}

const nutriologoDelete = async (req, res = response) => {
    //Id del nutriologo
    const id = req.id;

    try {
        await Nutriologo.findByIdAndDelete(id);
        
        res.status(201).json({
            success: true,
            msg: 'Usuario eliminado correctamente'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            msg: 'No se ha podido eliminar al usuario ' + id
        });
    }
}

const getFechas = async(req, res = response) =>{
    //id del nutriologo
    const id = req.id;

    try {
        const { fechaDisponible } = await Nutriologo.findById(id);


    } catch (error) {
        
    }
}

const updateFechas = async (req, res = response) => {
    //id del nutriologo
    const id = req.id;

    try {
        const { fechaDisponible } = await Nutriologo.findById(id);


    } catch (error) {
        
    }
}

//Solicitud de reagendación POST
const solicitarReagendacion = async (req, res = response) => {
    
    try {
        //Emisor
        const id_emisor = req.id;

        //Datos del servicio y reagendación
        const { id_cliente, id_servicio, fecha, msg } = req.body;

        const reagendacion = new Reagendacion({
            emisor: id_emisor,
            remitente: id_cliente,
            id_servicio,
            fecha_nueva: fecha,
            msg
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
        const id = req.id;

        const reagendacion = await Reagendacion.findByIdAndUpdate(id_solicitud, {aceptada: false});

        const servicio = await Servicio.findById(reagendacion.id_servicios);

        //Encontrar datos del cliente o extra
        let user = await Cliente.findById(reagendacion.emisor);

        let dueno;

        if(!user){
            user = await Extra.findById(reagendacion.emisor);
            dueno = await Cliente.findOne({
                    $match: {$or: [{'extra1':reagendacion.emisor}, {'extra2':reagendacion.emisor}]}
                }
            )
        } 

        //Modificar fecha de evento
        cambiarFecha(servicio, nueva_fecha);

        const fechaArr = format(nueva_fecha, 'dd-MMMM-yyyy', {locale: es}).split('-');
        const fechaString = fechaArr[0] + ' de ' + fechaArr[1] + ' del ' + fechaArr[2];

        //Enviar notificación (guardar en el arreglo notificaciones del nutriólogo)
        const notificacion = new Notificacion('Tu solicitud de reagendación ha sido aceptada para el día ' + fechaString);

        let notificaciones = [];
        
        //Si es un extra, la notifiación se le asigna al dueño de la cuenta
        if(dueno) {
            notificaciones = dueno.notificaciones;
            notificaciones.push(notificacion);
            dueno.notificaciones = notificaciones;
            await Cliente.findByIdAndUpdate(dueno._id);
        }
        else {
            notificaciones = user.notificaciones;
            notificaciones.push(notificacion);
            user.notificaciones = notificaciones;
            await Cliente.findByIdAndUpdate(user._id);
        }

        res.status(201).json(reagendacion);

    } catch (error) {
        res.status(400).json({
            success: false,
            msg: 'No se ha podido rechazar la solicitud'
        })
    }
}

module.exports = {
    nutriologoPost,
    nutriologoUpdate,
    nutriologoDelete,
    nutriologoUpdateServicio,
    getInfo,
    postPredeterminado,
    getPredeterminados,
    putPredeterminado,
    getPredeterminado,
    deletePredeterminado,
    putActualizarDatos,
    putAgregarEvento,
    putActualizarEvento,
    getClientData,
    getPacientes,
    updateClientData,
    reportar,
    solicitarReagendacion,
    rechazarSolicitud
};