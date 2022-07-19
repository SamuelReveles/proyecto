//Librerías externas
const { response } = require('express');

const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const isMonday = require('date-fns/isMonday');
const isTuesday = require('date-fns/isTuesday');
const isWednesday = require('date-fns/isWednesday');
const isThursday = require('date-fns/isThursday');
const isFriday = require('date-fns/isFriday');
const isSaturday = require('date-fns/isSaturday');
const isSunday = require('date-fns/isSunday');
const addDays = require('date-fns/addDays');
const format = require('date-fns/format');
const es = require('date-fns/locale/es');

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
const Historial = require('../models/historial');

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
            sexo: req.body.sexo,
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

        let tempFilePath;

        if(req.files) tempFilePath = req.files.imagen.tempFilePath;

        const nutriologo = await Nutriologo.findById(id);

        //Actualizar los datos que se llenaron
        if(tempFilePath){

            //Si la foto de perfil NO es la default se borra
            if(nutriologo.imagen != 'https://res.cloudinary.com/jopaka-com/image/upload/v1650666830/doctor_samuel_zaqdnu.png'){
                //Borrar la imagen anterior de cloudinary
            
                //Split del nombre de la imagen
                const nombreArr = nutriologo.imagen.split('/');
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

        const { precio, descripcion, activo, indicaciones, especialidades } = req.body;
        const id = req.id;

        const nutriologo = await Nutriologo.findById(id);

        if(precio) nutriologo.precio = precio;
        if(descripcion) nutriologo.descripcion = descripcion;
        nutriologo.activo = activo;
        if(indicaciones) nutriologo.indicaciones = indicaciones;
        if(especialidades) nutriologo.especialidades = especialidades;

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

        let config = req.body.fechas;
        let fechasDisponibles = nutriologo.fechaDisponible;

        let today = addDays(new Date(), 1); //Iniciar desde mañana

        console.log(config);

        if(!fechasDisponibles) { //Si se configura por primera vez
            fechasDisponibles = [];
            //For con 30 días de posible anticipo
            for (let i = 0; i < 30; i++) {

                if(isMonday(today)) {
                    fechasDisponibles.push({
                        fecha: today,
                        horario: config[0]
                    });
                }
                else if(isTuesday(today)) {
                    fechasDisponibles.push({
                        fecha: today,
                        horario: config[1]
                    });
                }
                else if(isWednesday(today)) {
                    fechasDisponibles.push({
                        fecha: today,
                        horario: config[2]
                    });
                }
                else if(isThursday(today)) {
                    fechasDisponibles.push({
                        fecha: today,
                        horario: config[3]
                    });
                }
                else if(isFriday(today)) {
                    fechasDisponibles.push({
                        fecha: today,
                        horario: config[4]
                    });
                }
                else if(isSaturday(today)) {
                    fechasDisponibles.push({
                        fecha: today,
                        horario: config[5]
                    });
                }
                else if(isSunday(today)) {
                    fechasDisponibles.push({
                        fecha: today,
                        horario: config[6]
                    });
                }
                today = addDays(today, 1); //Avanzar de dia
            }
        }

        else { //Si ya hay fechas disponibles
            let nuevasFechasDisponibles = [];
            //For con 30 días de posible anticipo
            for (let i = 0; i < 30; i++) {
                let dia = [];
                let diaConfig;

                /* Operaciones de disponibilidad
                    True - Disponible
                    False - Ocupada

                    Si no está marcada como disponible, se cuenta como ocupada
                    Config = true & fechasDisponibles = false -> False
                    Config = false & fechasDisponibles = false -> False

                    Config = false & fechasDisponibles = true -> False
                    Config = true & fechasDisponibles = true -> True

                    AND
                */

                //Configurar la fecha según el día
                if(isMonday(today)) {
                    diaConfig = config[0]; //Configurando como lunes
                    for (let j = 0; j < fechasDisponibles.length; j++) {
                        dia[j] = (fechasDisponibles[j] && diaConfig[j]);
                    }
                }
                else if(isTuesday(today)) {
                    diaConfig = config[1]; //Configurando como martes
                    for (let j = 0; j < fechasDisponibles.length; j++) {
                        dia[j] = (fechasDisponibles[j] && diaConfig[j]);
                    }
                }
                else if(isWednesday(today)) {
                    diaConfig = config[2]; //Configurando como miércoles
                    for (let j = 0; j < fechasDisponibles.length; j++) {
                        dia[j] = (fechasDisponibles[j] && diaConfig[j]);
                    }
                }
                else if(isThursday(today)) {
                    diaConfig = config[3]; //Configurando como jueves
                    for (let j = 0; j < fechasDisponibles.length; j++) {
                        dia[j] = (fechasDisponibles[j] && diaConfig[j]);
                    }
                }
                else if(isFriday(today)) {
                    diaConfig = config[4]; //Configurando como viernes
                    for (let j = 0; j < fechasDisponibles.length; j++) {
                        dia[j] = (fechasDisponibles[j] && diaConfig[j]);
                    }
                }
                else if(isSaturday(today)) {
                    diaConfig = config[5]; //Configurando como sábado
                    for (let j = 0; j < fechasDisponibles.length; j++) {
                        dia[j] = (fechasDisponibles[j] && diaConfig[j]);
                    }
                }
                else if(isSunday(today)) {
                    diaConfig = config[6]; //Configurando como domingo
                    for (let j = 0; j < fechasDisponibles.length; j++) {
                        dia[j] = (fechasDisponibles[j] && diaConfig[j]);
                    }
                }
                nuevasFechasDisponibles.push({
                    fecha: today,
                    horario: dia
                });
                today = addDays(today, 1); //Avanzar de dia
            }
            fechasDisponibles = nuevasFechasDisponibles;
        }
        
        // nutriologo.configuracion_fechas = config;
        // nutriologo.fechaDisponible = fechasDisponibles;
        // await Nutriologo.findByIdAndUpdate(id, nutriologo);

        res.status(200).json(fechasDisponibles);

    } catch(error) {
        console.log(error);
        res.status(400).json({
            success: false,
            msg: 'No se han podido actualizar las fechas'
        });
    }

}

//Llenar calendario del paciente
const llenarCalendario = async (req, res = response) => {
    try {
        const id_servicio = req.body.id_servicio;
        let tipo = 'Cliente';

        console.log(req.body.calendario);

        const servicio = await Servicio.findById(id_servicio);

        if(servicio.calendario === true) {
            res.status(401).json({
                success: false,
                msg: 'El calendario ya ha sido llenado'
            });
            return;
        }

        if(servicio.llenado_datos === false) {
            res.status(401).json({
                success: false,
                msg: 'Aún no se han llenado los datos'
            });
            return;
        }

        // let paciente = await Cliente.findById(servicio.id_paciente); //Paciente es a quien se le llena el calendario
        // let cliente = paciente; //Cliente a quien se le envía la notificación

        // if(!paciente) {
        //     tipo = 'Extra';
        //     paciente = await Extra.findById(servicio.id_paciente);
        //     let clientes = await Cliente.find();
        //     for await (const client of clientes) {
        //         console.log('Servicio: ' + servicio.id_paciente);
        //         console.log('Extra:    ' + client.extra1);
        //         console.log('Extra: ' + client.extra2);
        //         console.log(client.extra1 == servicio.id_paciente)
        //         if(client.extra1 == servicio.id_paciente || client.extra2 == servicio.id_paciente){
        //             console.log('OSI');
        //             cliente = client;
        //             break;
        //         }
        //     }
        // }

        // const calendario = req.body.calendario;
        // // const compras = req.body.lista_compras;

        // // let calendarioCliente = [];

        // // //Arreglo con 7 días de la semana
        // // for (let i = 0; i < 7; i++) {

        // //     //Posición 0 = Desayuno
        // //     calendarioCliente[i][1] = calendario[i][1];

        // //     //Posición 1 = Comida
        // //     calendarioCliente[i][2] = calendario[i][2];

        // //     //Posición 2 = Cena
        // //     calendarioCliente[i][3] = calendario[i][3];

        // //     //Posición 3 = Notas
        // //     calendarioCliente[i][4] = calendario[i][4];

        // // }

        // // calendarioCliente[7][0] = compras;

        // // cliente.calendario = calendarioCliente;

        // //Crear el historial del cliente
        // let ultimodato;
        // if(!paciente.datoInicial) ultimodato = paciente.datoConstante[paciente.datoConstante - 1];
        // else ultimodato = paciente.datoInicial;
        // const historial = new Historial({
        //     dieta: calendario,
        //     datos: ultimodato
        // });

        // if(tipo === 'Cliente'){
        //     cliente.calendario = calendario;
        //     cliente.historial.push(historial);
        // }
        // else {
        //     paciente.calendario = calendario;
        //     paciente.historial.push(historial);
        //     await Extra.findByIdAndUpdate(paciente._id, paciente);
        // }
        // historial.save();

        // //Enviar notificación
        // const notificacion = new Notificacion('Se ha actualizado el calendario de ' + paciente.nombre);
        // cliente.notificaciones.push(notificacion);
        // await Cliente.findByIdAndUpdate(cliente._id, cliente);

        // res.status(200).json(calendario);

    } catch (error) {
        console.log(error);
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
        const id_servicio = req.body.id;

        const { id_paciente, llenado_datos } = await Servicio.findById(id_servicio);

        if(llenado_datos === true) {
            res.status(401).json({
                success: false,
                msg: 'Ya se han llenado los datos'
            });
            return;
        }

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
            }
            else {
                cliente.datoConstante.push(datos);
                await Cliente.findByIdAndUpdate(id_paciente, cliente)
                .then(await datos.save());
            }
            await Servicio.findByIdAndUpdate(id_servicio, {llenado_datos: true});
            res.status(201).json(datos);
        }

        // Si es extra
        else if(extra){

            if(!extra.datoInicial) await Extra.findByIdAndUpdate(id_paciente, {datoInicial: datos});
            else {
                extra.datoConstante.push(datos);
                await Extra.findByIdAndUpdate(id_paciente, extra);
            }

            await datos.save();
            await Servicio.findByIdAndUpdate(id_servicio, {llenado_datos: true});
            res.status(201).json(datos);

        }
    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false, 
            msg: 'No se ha podido actualizar'
        });
    }

}

const getPacientes = async (req, res  = response) => {

    try {
        const id = req.id;
        let pacientes = [];

        const servicios = await Servicio.find();
        for await (const servicio of servicios) {
            if(servicio.id_nutriologo == id){
                
                //Si el paciente es cliente
                let paciente = await Cliente.findById(servicio.id_paciente);
                if(paciente) {

                    const fecha = format(servicio.fecha_cita, 'dd-MMMM-yyyy', {locale: es});
                    const fechaArr = fecha.split('-');
                    const fechaString = fechaArr[0] + ' de ' + fechaArr[1] + ' del ' + fechaArr[2];
                   
                    pacientes.push({
                        nombre: paciente.nombre,
                        apellidos: paciente.apellidos,
                        imagen: paciente.imagen,
                        sexo: paciente.sexo,
                        id_servicio: servicio._id,
                        servicio: servicio.vigente,
                        cita: fechaString,
                        reagendar: (differenceInDays(servicio.fecha_cita, new Date()) >= 1)
                    });
                }

                //Si el paciente es extra
                else {
                    const fecha = format(servicio.fecha_cita, 'dd-MMMM-yyyy', {locale: es});
                    const fechaArr = fecha.split('-');
                    const fechaString = fechaArr[0] + ' de ' + fechaArr[1] + ' del ' + fechaArr[2];
                    paciente = await Extra.findById(servicio.id_paciente);
                    pacientes.push({
                        nombre: paciente.nombre,
                        apellidos: paciente.apellidos,
                        imagen: 'https://res.cloudinary.com/jopaka-com/image/upload/v1655342366/jopaka_extra_qhsinv.png',
                        sexo: paciente.sexo,
                        id_servicio: servicio._id,
                        servicio: servicio.vigente,
                        cita: fechaString,
                        reagendar: (differenceInDays(servicio.fecha_cita, new Date()) >= 1)
                    });
                }
            }
        }
        res.status(200).json(pacientes);
    } catch (error) {
        console.log(error);
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
        let clientes;

        const servicio = await Servicio.findById(idServicio);

        if(servicio.reportesNutriologo == 0){
            res.status(400).json({
                success: false,
                msg: 'Límite de reportes'
            });
            return;
        } 

        const idCliente = servicio.id_paciente;

        //Extraer tipo de reporte para saber el puntaje
        const { puntos } = await Motivo.findById(idReporte);

        const cliente = await Cliente.findById(idCliente);
        if(!cliente) { // Si reporta a un extra
            clientes = await Cliente.find();
            clientes.forEach(paciente => {
                if(paciente.extra1 == idCliente || paciente.extra2 == idCliente){
                    cliente = paciente;
                    return;
                }
            });
        }

        //Crear el reporte
        const reporte = new Reporte({
            emisor: req.id,
            para: cliente._id,
            tipo: idReporte,
            msg,
            fecha: new Date()
        });

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
            cliente.baneado = true;

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

        const nutriologo = await Nutriologo.findById(id);

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
        const { configuracion_fechas } = await Nutriologo.findById(id);

        res.status(200).json(configuracion_fechas);

    } catch (error) {
        
    }
}

const updateFechas = async (req, res = response) => {
    //id del nutriologo
    const id = req.id;

    try {
        const nutriologo = await Nutriologo.findById(id);

        /*
        Representaciones de las fechas (significado en horas)
        ['7:00','7:30', '8:00', '8:30', '9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30'...]
        Índices del arreglo: 0-Lunes, 1-Martes, 2-Miércoles, 3-Jueves, 4-Viernes, 5-Sábado, 6-Domingo
        [
            [true, false, true, false...], 0
            [false, true, false, true], 1
            [true, false, true, false...], 2
            [false, true, false, true], 3
            [true, false, true, false...], 4
            [false, true, false, true], 5
            [true, false, true, false...], 6
            [false, true, false, true], 7
            [true, false, true, false...], 8
        ]
        */ 

        nutriologo.configuracion_fechas = req.body.fechas;
        await Nutriologo.findById(id);

        await fechasUpdate(id);

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

const getReagendaciones = async (req, res = response) => {
    
    try {

        const id = req.id;

        const solicitudes = await Reagendacion.find({remitente: id});
        const { nombre } = await Nutriologo.findById(id);

        let solicitudesUsuario = [];

        for await (const solicitud of solicitudes) {

            const fecha = format(solicitud.fecha_nueva, 'dd-MMMM-yyyy', {locale: es});
            const fechaArr = fecha.split('-');
            const fechaString = fechaArr[0] + ' de ' + fechaArr[1] + ' del ' + fechaArr[2];

            const { id_paciente } = await Servicio.findById(solicitud.id_servicio);

            let paciente = await Cliente.findById(id_paciente);
            if( !paciente ) paciente = await Extra.findById(id_paciente);

            solicitudesUsuario.push({
                solicitud: solicitud._id,
                emisor: paciente.nombre,
                remitente: nombre,
                fecha_nueva: fechaString,
                mensaje: solicitud.mensaje
            });

        }

        res.status(200).json(solicitudesUsuario);

    } catch ( error ) {
        console.log(error);
        res.status(400).json({
            success: false
        })
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

const getMotivosNutriologo = async(req, res = response) => {
    try {
        let motivosNutriologo = [];
        
        let temporal = await Motivo.findById('624536db33d1ed94d196ec61');
        motivosNutriologo.push(temporal);
        
        temporal = await Motivo.findById('624536e733d1ed94d196ec63');
        motivosNutriologo.push(temporal);
        
        temporal = await Motivo.findById('624536e733d1ed94d196ec63');
        motivosNutriologo.push(temporal);
        
        temporal = await Motivo.findById('6245371633d1ed94d196ec67');
        motivosNutriologo.push(temporal);
        
        temporal = await Motivo.findById('6245372033d1ed94d196ec69');
        motivosNutriologo.push(temporal);
        
        temporal = await Motivo.findById('6245372833d1ed94d196ec6b');
        motivosNutriologo.push(temporal);
        
        temporal = await Motivo.findById('6245373e33d1ed94d196ec6d');
        motivosNutriologo.push(temporal);

        res.status(200).json(motivosNutriologo);
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error: ' + error
        });
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
    getClientData,
    getPacientes,
    updateClientData,
    reportar,
    solicitarReagendacion,
    rechazarSolicitud,
    llenarCalendario,
    getMotivosNutriologo,
    fechasUpdate,
    getFechas,
    getReagendaciones
};