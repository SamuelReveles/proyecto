class Notificacion {
    constructor(mensaje = '') {
        this.mensaje = mensaje,
        this.hora = new Date(),
        this.visto = false
        // this.duracion = duracion //Duración en días
    }

    ver() {
        this.visto = new Date();
    }
}

module.exports = Notificacion;