class Fecha {
    
    constructor(dia, hora_inicio, hora_cierre) {
        this.dia = dia;
        this.hora_inicio = hora_inicio;
        this.hora_cierre = hora_cierre;
        this.agendada = false;
    }

    agendar() {
        this.agendada = true;
    }

}