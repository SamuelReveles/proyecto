class Mensaje {
    constructor(texto = '', emisor) {
        this.texto = texto,
        this.emisor = emisor, 
        this.visto = false,
        this.hora = new Date()
    }

    visto() {
        this.visto = true;
    }

}

module.exports = Mensaje;