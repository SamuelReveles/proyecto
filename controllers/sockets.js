const { request, response } = require('express');

const socketController = (socket) => {

    socket.on('notificacion', ( payload ) => {

    })

}

module.exports = {
    socketController
}