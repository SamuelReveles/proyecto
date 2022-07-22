class Mensaje {
    
    constructor(texto = '', nutriologo = false, paciente = false) {
        this.texto = texto,
        this.nutriologo = nutriologo,
        this.paciente = paciente,
        this.visto = false,
        this.hora = new Date()
    }

}

module.exports = Mensaje;