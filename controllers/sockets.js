//Modelos
const Notificacion = require('../models/notificacion');
const Mensaje = require('../models/mensaje');
const Cliente = require('../models/cliente');
const Nutriologo = require('../models/nutriologo');
const Servicio = require('../models/servicio');
const jwt = require('jsonwebtoken');

//Helpers
const { Usuarios } = require('../helpers/usuarios');

//Arreglo con los usuarios conectados
const usuarios = new Usuarios();

const socketController = (socket) => {

    //Conexión, agregar un usuario a la lista de usuarios conectados
    socket.on('conectar', (payload) => {
        try {
            const { id } = jwt.verify(payload.jwt, process.env.SIGNJWT);
            usuarios.agregarUsuario(socket.id, id);
            console.log('Conectado: ' + socket.id);
        } catch(error) {
            console.log(error);
        }
    });

    //Eliminar de la lista y cambiar la última conexión
    socket.on('disconnect', async (payload) => {
        try {
            //Extract jwt from payload
            usuarios.borrarUsuario(socket.id); 
            console.log('desconectado: ' + socket.id)
        } catch(error) {
            console.log(error); 
        }
    });


    //Recibir mensaje
    socket.on('mensaje', async ( payload ) => {
        try{
            const { contenido = ' ', id_servicio, tipo, cliente } = payload;
            const servicio = await Servicio.findById(id_servicio);
    
            //Tipo:
            /*
                'Nutriologo' o 'Cliente'
            */
    
            /*
                Si receptor no es undefined - Es enviado desde el nutriólogo y este contiene el ID del cliente
                Si emisor no es undefined - Es enviado desde el paciente y este contiene el ID del cliente
            */
            
           
            let usuarioReceptor, usuarioEmisor;
    
            // Si hay receptor, el mensaje viene del nutriólogo y hay que usarlo para actualizar la db
            if(tipo == 'Nutriólogo') {
                usuarioReceptor = await Cliente.findById(cliente);
                usuarioEmisor = await Nutriologo.findById(servicio.id_nutriologo);
            }
            else {
                usuarioEmisor = await Cliente.findById(cliente);
                usuarioReceptor = await Nutriologo.findById(servicio.id_nutriologo);
            }
    
            let mensaje;
    
            if(tipo == 'Nutriólogo') mensaje = new Mensaje(contenido, true, false);
            else mensaje = new Mensaje(contenido, false, true);
    
            let mensajes = [];
            if(servicio.mensajes) mensajes = servicio.mensajes;
            mensajes.push({
                texto: mensaje.texto,
                nutriologo: mensaje.nutriologo,
                paciente: mensaje.paciente,
                visto: mensaje.visto,
                hora: mensaje.hora
            });
    
            servicio.mensajes = mensajes;
            await Servicio.findByIdAndUpdate(id_servicio, servicio);
    
            //Enviar mensaje SOLO SE EMITE SI EL USUARIO ESTÁ CONECTADO
            if(usuarios.getUsuario(usuarioReceptor._id)) {
                const socket_user = usuarios.getUsuario(usuarioReceptor._id);
                socket.broadcast.to(socket_user.id_socket).emit('mensaje', mensajes);
                console.log('Enviado a ' + socket_user.id_socket);
                console.log('Enviado a ' + socket_user.id_usuario);
            }
            else {
                //Actualizar notificaciones de cliente
                const notificacion = new Notificacion('Nuevo mensaje de ' + usuarioEmisor.nombre + ': ' + contenido);
                let { notificaciones } = usuarioReceptor;
    
                if(!notificaciones) notificaciones = [];
    
                notificaciones.push(notificacion);
    
                usuarioReceptor.notificaciones = notificaciones;
    
                if(tipo == 'Nutriólogo') await Cliente.findByIdAndUpdate(usuarioReceptor._id, usuarioReceptor);
                
                else await Nutriologo.findByIdAndUpdate(usuarioReceptor._id, usuarioReceptor);
            }
            socket.emit('mensaje', mensajes);
        } catch(error) {
            console.log(error);
        }

    });

}

module.exports = {
    socketController
}