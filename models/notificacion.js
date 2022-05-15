class Notificacion {
    constructor(mensaje = '', duracion = 100) {
        this.mensaje = mensaje,
        this.hora = new Date(),
        this.visto = false,
        this.duracion = duracion //Duración en días
    }

    vista() {
        this.visto = true;
    }
}

module.exports = Notificacion;