//Librerías externas
const { response } = require('express');
const mongoose = require('mongoose');

//API externas
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
const Motivo = require('../models/motivo');
const { countDocuments } = require('../models/dato');

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
        precio: req.body.precio,
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
        console.log(err);
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

    //Cliente de twilio
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
const postPredeterminado = async (req, res = response) => {

    //id del nutriólogo
    const id = req.body.id;

    //Crear objeto
    // const predeterminado = new Predeterminado({
    //     nombre: req.body.nombre,
    //     texto: req.body.texto,
    // });

    const predeterminado = new Predeterminado(req.body.nombre, req.body.texto);

    try {
        
        //Guardar en la DB de predeterminados
        //await predeterminado.save();

        //Guardar dentro del arreglo del nutriólogo
        const nutriologo = await Nutriologo.findById(id); 

        let predeterminados = nutriologo.predeterminados;

        predeterminados.push(predeterminado);
        nutriologo.predeterminados = predeterminados;

        //Actualizar el objeto
        await Nutriologo.findByIdAndUpdate(id, nutriologo);

        res.status(201).json({
            success: true,
            predeterminado
        });
    } catch (error) {
        res.status(401).json({
            success: false
        });
    }
}

//Mostrar todos alimento predeterminado
const getPredeterminados = async (req, res = response) => {

    const id = req.query.id;

    try {
        //Buscar al nutriologo
        const { predeterminados } = await Nutriologo.findById(id);

        // //Guardar arreglo con los resultados
        // let resultados = [];

        // for await (const _id of predeterminados){
        //     const predeterminado = await Predeterminado.findById(_id);
        //     resultados.push(predeterminado);
        // }

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

    const id = req.query.id;

    let resultado;

    try {
        const { predeterminados } = await Nutriologo.findById(id);

        for await (const alimento of predeterminados){
            //const predeterminado = await Predeterminado.findById(_id);
            if(alimento.nombre == req.query.nombre) {
                resultado = alimento;
                break;
            }
        }

        if(!resultado) throw new Error();
        res.status(200).json({
            success: true,
            resultado
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            msg: 'No se encontró el predeterminado'
        });
    }
}

//Actualizar alimento predeterminado
const putPredeterminado = async (req, res = response) => {

    //id del predeterminado
    const id = req.body.id;

    //Extraer objeto
    const predeterminado = await Predeterminado.findById(id);

    //Actualizar el objeto
    if(req.body.nombre) predeterminado.nombre = req.body.nombre;
    if(req.body.texto) predeterminado.texto = req.body.texto;

    //Actualizar en la base de datos
    await Predeterminado.findByIdAndUpdate(id, predeterminado)
    .catch(() => {
        res.status(401).json({
            success: false,
            msg: 'No se pudo actualizar el predeterminado'
        });
        return;
    });

    res.status(201).json({
        success: true,
        predeterminado
    });
}

//Eliminar un alimento predeterminado
const deletePredeterminado = async (req, res = response) => {

    //id del nutriólogo
    const id = req.query.id;

    //Nombre del alimento predeterminado
    const nombre = req.query.nombre;

    //Objeto del nutriologo
    const nutriologo = await Nutriologo.findById(id);

    //Extraer el arreglo del nutriólogo
    let predeterminados = nutriologo.predeterminados;

    let index = 0;

    //Indice del arreglo que se quiere eliminar
    for await (const alimento of predeterminados) {
        if (alimento.nombre == nombre) {
            break;
        }
        index++;
    }

    //Eliminar del objeto del nutriólogo
    predeterminados.splice(index, 1);

    nutriologo.predeterminados = predeterminados;

    await Nutriologo.findByIdAndUpdate(id, nutriologo)
        .catch(err =>{
            res.status(401).json({
                success: false,
                msg: 'No se pudo eliminar el predeterminado dentro del arreglo del nutriólogo'
            });
            return;
        })

    res.status(201).json({
        success: true,
        msg: 'Eliminado correctamente'
    });

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

//Reportar a un paciente
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
    const { puntos } = await Motivo.findById(idReporte);
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
    postPredeterminado,
    getPredeterminados,
    putPredeterminado,
    getPredeterminado,
    deletePredeterminado,
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