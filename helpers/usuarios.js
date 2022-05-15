//Clase con los usuarios conectados

class Usuarios {

    constructor () {
        this.conectados = [];
    }

    //Añadir un usuario a la lista de conectados
    agregarUsuario(id_socket, id_usuario) {
        const usuario = {
            id_socket,
            id_usuario
        };
        this.conectados.push(usuario);
    }

    //Obtener el id de socket de cierto usuario
    getUsuario(id_usuario) {
        let user = this.conectados.filter( usuario => usuario.id_usuario === id_usuario )[0]
        return user;
    }

    //Eliminar del arreglo cuando se desconecta un usuario
    borrarUsuario(id_usuario) {
        this.conectados = this.conectados.filter( usuario => usuario.id_usuario != id_usuario);
    }

}

module.exports = {
    Usuarios
}