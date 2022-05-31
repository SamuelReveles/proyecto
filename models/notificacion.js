class Notificacion {
    constructor(mensaje = '') {
        this.mensaje = mensaje,
        this.hora = new Date(),
        this.visto = false
        // this.duracion = duracion //Duración en días
    }

    vista() {
        this.visto = true;
    }
}

module.exports = Notificacion;