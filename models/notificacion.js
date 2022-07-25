class Notificacion {
    constructor(mensaje = '') {
        this.mensaje = mensaje,
        this.hora = new Date(),
        this.visto = false
    }

}

module.exports = Notificacion;