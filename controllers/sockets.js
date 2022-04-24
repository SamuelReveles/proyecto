const { request, response } = require('express');

const socketController = (socket) => {

    socket.on('mensaje', ( payload ) => {

    });

    socket.emit('notificacion', ( payload) => {
        
    });

}

module.exports = {
    socketController
}