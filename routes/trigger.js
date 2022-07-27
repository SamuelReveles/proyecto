const { Router } = require('express');

//Triggers controllers
const { 
    borrarAutomatico,
    deleteNotificaciones,
    vigenciaServicios,
    actualizarFechasNutriologo,
    avisoBaneo,
    desbanear,
    actualizarCalendarios
} = require('../controllers/trigger');

//Pruebas de paypal
const {
    crearOrden, capturarOrden
} = require('../controllers/pagos');

const router = Router();

//Banear automáticamente
router.get('/inactividad', borrarAutomatico);

//Desbanear automáticamente
router.get('/desbanear', desbanear);

//Aviso de baneo autoban
router.get('/aviso', avisoBaneo);

//Borrar Notificaciones
router.put('/notificaciones', deleteNotificaciones);

//Vigencia de servicios
router.put('/servicios', vigenciaServicios);

//Actualizar horarios de nutriólogos
router.put('/fechas', actualizarFechasNutriologo);

//Actualizar los horarios de los nutriólogos
router.put('/calendario', actualizarCalendarios);

module.exports = router;
