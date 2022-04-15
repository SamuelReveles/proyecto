//Librerías externas
const { response } = require('express');
const bcryptjs = require('bcryptjs');

//Modelos
const Cliente = require('../models/cliente');
const Dato = require('../models/dato');
const Nutriologo = require('../models/nutriologo');
const Extra = require('../models/extra');
const Reporte = require('../models/reporte');
const Motivo = require('../models/motivo');


const usuariosPost = async (req, res = response) => {
    
    //Creando objeto
    const user = new Cliente({
        nombre: req.body.nombre,
        apellidos: req.body.apellidos,
        celular: req.body.celular,
        correo: req.body.email,
    });

    await user.save()
        .then(await datos.save())
        .catch(
            res.status(401).json({
                succes: false
            })
        )
    
    res.status(201).json({
        succes: true,
        user
    });
}

const usuariosPatch = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'patch API - controller'
    });
};

const usuariosDelete = async (req, res = response) => {
   
    //Id del cliente
   const id = req.query.id;

   try {
       await Cliente.findByIdAndDelete(id);
       
       res.status(201).json({
           success: true,
           msg: 'Usuario eliminado correctamente'
       });
   } catch (error) {
       res.status(401).json({
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
        users =  await Nutriologo.aggregate([
            {$skip: start},
            {$limit: limit},
            {$match: {'nombreCompleto': nombre}}
        ]);

        total = await Nutriologo.count({nombreCompleto: nombre});
    }

    else if (categoria) {
        //Extraer los resultados
        users =  await Nutriologo.aggregate([
            {$skip: start},
            {$limit: limit},
            {$match: {'especialidades': categoria}}
        ]);

        total = await Nutriologo.count({especialidades: categoria});
    }

    else {
        users =  await Nutriologo.aggregate([
            {$skip: start},
            {$limit: limit}
        ]);

        total = await Nutriologo.count();
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

    //Ordenes

    //Por calificacion
    if(req.query.estrellas){
        if(req.query.mayor) resultados.sort((a, b) => b.calificacion - a.calificacion);
        else resultados.sort((a, b) => a.calificacion - b.calificacion);
    }

    //Por precio
    if(req.query.precio){
        if(req.query.mayor) resultados.sort((a, b) => b.precio - a.precio);
        else resultados.sort((a, b) => a.precio - b.precio);
    }

    if(!resultados) {
        res.status(400).json({
            success: false
        });
        return;
    }

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
    const cliente = await Cliente.findById(id)
        .catch(() => {
            res.status(401).json({
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
            inicio,
            datos
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
        const report = await Motivo.findById(idReporte);
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

        res.status(201).json({
            success: true,
            reporte,
            msg: 'Reportado correctamente'
        });
    } catch (error) {
        res.status(401).json({
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

    //Actualizar objeto
    await Nutriologo.findByIdAndUpdate(id, nutriologo)
    .then(
        res.status(200).json({
            success: true,
            msg: 'Calificado correctamente con ' + calificacion + ' estrellas'
        })
    )
}

const getNutriologo = async (req, res = response) => {

    //Id del nutriologo
    const id = req.query.id;

    try {
        const nutriologo = await Nutriologo.findById(id);

        //No mostrar datos de alguien baneado
        if(nutriologo.baneado) throw new Error();

        res.status(200).json({
            success: true,
            nutriologo
        });

    } catch (error) {
        res.status(400).json({ 
            success: false,
            msg: 'No fue posible encontrar la información'
        });
    }

}

const generarTicket = async (req, res = response) => {
    
    //Id del nutriologo
    const { id, fecha_cita } = req.query;

    //Objeto del nutriólogo
    const nutriologo = await Nutriologo.findById(id);


}

//Ver extras del cliente
const getExtras = async (req, res = response)  => {

    //Id del cliente
    const id = req.query.id;

    try {    
        //Objeto del cliente
        const cliente = await Cliente.findById(id);

        let extra1, extra2;

        if(cliente.extra1) extra1 = await Extra.findById(cliente.extra1);
        if(cliente.extra2) extra2 =  await Extra.findById(cliente.extra2);

        res.status(200).json({
            success: true,
            extra1,
            extra2
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            msg: 'Hubo un error: ' + error.message
        })
    }

}

//Ver información del cliente
const getInfo = async (req, res = response)  => {

    //Id del cliente
    const id = req.query.id;

    const cliente = await client.findById(id)
        .catch(() => {
            res.status(400).json({ 
                success: false,
                msg: 'Error al buscar cliente, verifique el ID'
            });
        });
    
    if(!cliente) return;

    res.status(200).json({
        success: true,
        cliente
    });
}

module.exports = {
    usuariosPost,
    usuariosDelete,
    usuariosPatch,
    busqueda,
    getNutriologo,
    getProgreso,
    altaExtras,
    getExtras,
    getInfo,
    reportar,
    calificar
}