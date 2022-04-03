//Librerías externas
const { response } = require('express');
const mongoose = require('mongoose');
const client = require('twilio')(process.env.TWILIO_SSID, process.env.TWILIO_AUTH_TOKEN);

//Helpers
const { emailExiste, celularExiste } = require('../helpers/db-validator');

//Modelos
const Cliente = require('../models/cliente');
const Dato = require('../models/dato');
const Extra = require('../models/extra');
const Nutriologo = require('../models/nutriologo');
const Predeterminado = require('../models/predeterminado');
const Reporte = require('../models/reporte');
const Default = require('../models/default');

//Crear un nuevo nutriologo
const nutriologoPost = async (req, res = response) => {

    //Crear el objeto
    const nutri = new Nutriologo({
        nombre: req.body.nombre,
        apellidos: req.body.apellidos,
        nombreCompleto: req.body.nombre + ' ' + req.body.apellidos,
        celular: req.body.celular,
        correo: req.body.correo,
        fecha_registro: Date.now(),
        especialidades: [
            "Vegano",
            "General"
        ]
    });

    try {
        await nutri.save();
        res.status(201).json({
            success: true,
            nutri
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            msg: 'Error al agregar a la DB'
        });
    }
}

//Enviar código de verificación
const sendCode = async(req, res = response) => {

    //Cliente de twiliio
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
        })

}

//Verificar que el código es correcto
const verifyCode = async (req, res = response) => {

    //Cliente de ttwsdawitw
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
        })

}

// Crear un nuevo alimento predeterminado
const putPredeterminado = async (req, res = response) => {

    //Crear objeto
    const predeterminado = new Predeterminado({
        nombre: req.body.nombre,
        texto: req.body.texto,
    });

    try {
        //Guardar en la DB
        await predeterminado.save();

        res.status(201).json({
            success: true,
            predeterminado
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            predeterminado
        });
    }
}

//Mostrar todos alimento predeterminado
const getPredeterminados = async (req, res = response) => {

    const id = req.query.id;

    try {
        //Buscar al nutriologo
        const nutriologo = await Nutriologo.findById(id);

        //Extraer los predeterminados
        const predeterminados = nutriologo.predeterminados;

        res.status(200).json({
            success: true,
            predeterminados
        });
    } catch (error) {
        res.status(400).json({
            success: false
        })
    }
}

//Mostrar un solo alimento predeterminado
const getPredeterminado = async (req, res = response) => {

    //Falta: buscar dentro de un arreglo de parte del nutriologo, no dentro de la DB de predeterminados
    try {
        const predeterminados = await Predeterminado.findOne({
            nombre: req.body.nombre
        });
        res.status(200).json({
            success: true,
            predeterminados
        });
    } catch (error) {
        res.status(400).json({
            success: false
        });
    }
}

//Actualizar datos del nutriólogo
const putActualizarDatos = async (req, res = response) => {

    //Recibir parametro del body
    const {
        id, 
        nombre,
        apellidos,
        imagen
    } = req.body;

    //Buscar al nutriologo
    const nutriologo = await Nutriologo.findById(id);

    try {
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
        console.log(error);
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

    //Extraer datos del query
    const id = req.query.id;

    //Buscar si es cliente o extra
    const cliente = await Cliente.findById(id);
    const extra = await Extra.findById(id);

    // Si es cliente
    if(cliente){

        //Extraer datos que se van a usar
        const {nombre, apellidos, datoConstante, datoInicial, verDatos} = cliente;

        if (verDatos){
            //Si no tiene primeros datos se busca el primer dato
            if(!cliente.datoConstante){
                const datos = await Dato.findById(datoInicial);
                res.status(200).json({
                    nombre,
                    apellidos,
                    datos
                });
            }

            // Si hay datos, se toma el último
            else{
                const idDato = datoConstante[datoConstante.length - 1];
                const datos = await Dato.findById(idDato);
                res.status(200).json({
                    nombre,
                    apellidos,
                    datos
                });
            }
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
            if(!extra.datoConstante){
                console.log('Imprimiendo dato inicial');
                const datos = await Dato.findById(datoInicial);
                res.status(200).json({
                    nombre,
                    apellidos,
                    datos
                });
            }
            else{
                const idDato = datoConstante[datoConstante.length - 1];
                const datos = await Dato.findById(idDato);
                res.status(200).json({
                    nombre,
                    apellidos,
                    datos
                });
            }
        }
        else{
            res.status(201).json({
                msg: 'El cliente tienen inhabilitada la visualización de datos. Pídele que lo cambie desde ajustes'
            });
        }
    }

    else res.status(400).json({success: false});

}

//Update datos del clientes
const updateClientData = async (req, res = response) => {

    //Se extrae id
    const id = req.body.id;

    //Crear datos del cliente
    const datos = new Dato({
        peso: req.body.peso,
        altura: req.body.altura
    });

    const cliente = await Cliente.findById(id);
    const extra = await Extra.findById(id);

    // Si es cliente
    if(cliente){
        if(!cliente.datoInicial){
            await Cliente.findByIdAndUpdate(id, {datoInicial : datos})
            .then(await datos.save());
            res.json({success: true, datos});
        }
        else {
            cliente.datoConstante.push(datos);
            await Cliente.findByIdAndUpdate(id, cliente)
            .then(await datos.save());
            res.json({success: true, datos});
        }
    }

    // Si es extra
    else if(extra){

        if(!extra.datoInicial){
            await Extra.findByIdAndUpdate(id, {datoInicial : datos})
            .then(await datos.save());
            res.json({success: true, datos});
        }
        else {
            extra.datoConstante.push(datos)
            await Extra.findByIdAndUpdate(id, extra)
            .then(await datos.save());
            res.json({success: true, datos});
        }
    }

    else res.json({success: false});

}

const getPacientes = async (req, res  = response) => {

    const id = req.query.id;

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
    
    res.status(200).json({
        success: true, 
        pacientes
    });
}

const reportar = async (req, res = response) => {
    //Extraer datos del reporte
    const { idCliente, idNutriologo, idReporte, msg } = req.body;

    //Crear el reporte
    const reporte = new Reporte({
        emisor: idNutriologo,
        para: idCliente,
        tipo: idReporte,
        msg,
        fecha: Date.now()
    });

    //Extraer tipo de reporte para saber el puntaje
    const { puntos } = await Default.findById(idReporte);
    const cliente = await Cliente.findById(idCliente);

    //Agregar los puntos y push a arreglo de reportes
    cliente.puntajeBaneo += puntos;

    let reportes = [];
    if(!cliente.reportes){
        console.log('Sin reportes');
    }
    else {
        console.log('Con reportes');
        reportes = cliente.reportes;
    }
    
    reportes.push(reporte);
    cliente.reportes = reportes;

    await Cliente.findByIdAndUpdate(idCliente, cliente)
        .catch( () =>  {
            res.status(401).json({
                success: false,
                msg: 'No se ha logrado reportar'
            });
            return;
        });

    //Guardar reporte
    await reporte.save();

    res.status(201).json({
        success: true,
        reporte,
        msg: 'Reportado correctamente'
    });
}

module.exports = {
    nutriologoPost,
    putPredeterminado,
    getPredeterminados,
    getPredeterminado,
    putActualizarDatos,
    putAgregarEvento,
    putActualizarEvento,
    getClientData,
    sendCode,
    verifyCode,
    getPacientes,
    updateClientData,
    reportar
};