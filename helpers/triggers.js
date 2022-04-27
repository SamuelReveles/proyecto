function diferenciaMeses(fecha1, fecha2){
    let diferencia = (fecha2.getTime() - fecha1.getTime()) / 1000 / (3600 * 24 * 7 * 4);

    return Math.abs(Math.round(diferencia));
}

function diferenciaDias(fecha1, fecha2){
    let diferencia = (fecha2.getTime() - fecha1.getTime()) / (1000 * 60 * 60 * 24);

    return Math.abs(Math.round(diferencia));
}

module.exports = {
    diferenciaMeses,
    diferenciaDias
}