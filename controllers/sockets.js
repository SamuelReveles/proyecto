//Modelos
const Notificacion = require('../models/notificacion');
const Mensaje = require('../models/mensaje');
const Cliente = require('../models/cliente');
const Nutriologo = require('../models/nutriologo');
const Servicio = require('../models/servicio');

//Helpers
const { Usuarios } = require('../helpers/usuarios');

//Arreglo con los usuarios conectados
const usuarios = new Usuarios();

const socketController = (socket) => {

    //Conexión, agregar un usuario a la lista de usuarios conectados
    socket.on('conexion', (id_usuario) => {
        usuarios.agregarUsuario(socket.id, id_usuario);
    })

    //Recibir mensaje
    socket.on('mensaje', async ( payload ) => {
        const { emisor, receptor, contenido = '' } = payload;

        //Identificador de tipo de usuario que recibe el mensaje
        let type = 'Nutriologo';

        //Encontrar a quien emite el mensaje
        let usuarioReceptor = await Nutriologo.findById(receptor);
        let usuarioEmisor = await Cliente.findById(emisor);

        if(!usuarioReceptor) {
            usuarioReceptor = await Cliente.findById(receptor);
            usuarioEmisor = await Nutriologo.findById(emisor);
            type = 'Cliente';
        }

        //Crear objeto notificación y mensaje
        const notificacion = new Notificacion('Nuevo mensaje de ' + usuarioEmisor.nombre + ': ' + contenido);
        const mensaje = new Mensaje(contenido, emisor);

        //Actualizar los mensajes en el servicio
        let servicio;
        if(type === 'Nutriologo') {
            servicio = await Servicio.aggregate([
                {$match: {$and: [{'id_paciente': emisor}, {'id_nutriologo': receptor}]}}
            ]);
        } else {
            servicio = await Servicio.aggregate([
                {$match: {$and: [{'id_paciente': receptor}, {'id_nutriologo': emisor}]}}
            ]);
        }

        let mensajes = [];
        if(servicio.mensajes) mensajes = servicio.mensajes;
        mensajes.push(mensaje);

        servicio.mensajes = mensajes;

        await Servicio.findByIdAndUpdate(servicio._id. servicio);

        //Actualizar las notificaciones del receptor
        if(usuarioReceptor.notifiaciones) usuarioReceptor.notificaciones.push(notificacion);
        else {
            let notificaciones = [notificacion];
            usuarioReceptor.notificaciones = notificaciones;
        }

        if(type === 'Nutriologo') await Nutriologo.findByIdAndUpdate(receptor, usuarioReceptor);
        else await Cliente.findByIdAndUpdate(receptor, usuarioReceptor);

        //Enviar notificación SOLO SE EMITE SI EL USUARIO ESTÁ CONECTADO
        if(usuarios.getUsuario(receptor)) {
            const socket_user = usuarios.getUsuario(receptor);
            socket.broadcast.to(socket_user.id_socket).emit('mensaje', mensaje);
        }

    });

}

module.exports = {
    socketController
}