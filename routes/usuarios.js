//Librerías externas
const { Router } = require('express');

//Validación de campos vacíos
const { validarBanCliente } = require('../middlewares/validar-campos');

const { validarToken, verificarCliente } = require('../middlewares/validar-jwt');

//Rutas y tipos de "Acceso"
const { 
    usuariosUpdate,
    usuariosDelete,
    getProgreso,
    altaExtras,
    getExtras,
    getInfo,
    reportar,
    calificar,
    mostrarHistorial,
    verHistorialPagos,
    listadoPagos,
    solicitarReagendacion,
    rechazarSolicitud,
    aceptarSolicitud,
    estadoVerDatos,
    getServicios,
    getMotivosUsuario,
    getDietas,
    getReagendaciones,
    verServicio,
    servicioDelete,
    getCalendario,
    getPersonas
} = require('../controllers/usuarios');

//Paypal
const {
    crearOrden, 
    ordenPagada
} = require('../controllers/pagos');

//Helpers
const { 
    borrarNotificacion,
    getNotificaciones,
    verNotificaciones } = require('../helpers/verificacion');

//Router instance
const router = Router();

//Verificar que exista sesión iniciada el token
router.use(validarToken);
router.use(verificarCliente);

//Extraer el progreso
router.get('/progreso', getProgreso);

//Ver datos de la cuenta
router.get('/data', getInfo);

//Calificar a un nutriólogo
router.put('/calificar', calificar);

//Dar de alta un nuevo extra
router.post('/extra/alta', altaExtras);

//Ver extras del cliente
router.get('/extra', getExtras);

//Actualizar datos
router.put('/', [validarBanCliente], usuariosUpdate);

//Reportar
router.put('/reportar', reportar);

//Eliminar cuenta
router.delete('/', [validarBanCliente], usuariosDelete);

//Ver dietas de un cliente
router.get('/dietas', getDietas);

//Ver pdf del historial del cliente
router.get('/historial/one', mostrarHistorial);

//Ver registro de pagos del cliente
router.get('/registroPagos', listadoPagos);

//Ver historial de pagos del cliente
router.get('/pagos', verHistorialPagos);

//Crear orden de paypal (paso para el check-in)
router.post('/crearOrden', [validarBanCliente], crearOrden);

//Ver solicitudes de reagendación
router.get('/reagendar', getReagendaciones);

//Solicitar reagendación
router.post('/reagendar', solicitarReagendacion);

//Denegar reagendación
router.put('/denegar', rechazarSolicitud);

//Aceptar reagendación
router.put('/aceptar', aceptarSolicitud);

//Cambiar el estado de ver datos
router.put('/verDatos', estadoVerDatos);

//Ver motivos de reporete
router.get('/motivos', getMotivosUsuario);

//Ver servicios de la cuenta
router.get('/servicio', getServicios);

//Remover al nutriólogo de la lista
router.delete('/servicio', servicioDelete);

//Ver datos del servicio para el chat
router.get('/servicioChat', verServicio);

//Ver calendario
router.get('/calendario', getCalendario);

//Borrar una notificación
router.delete('/notificaciones', borrarNotificacion);

//Ver las notificaciones
router.put('/notificaciones', verNotificaciones);

//Get las notificaciones
router.get('/notificaciones', getNotificaciones);

//Ver personas de la cuenta
router.get('/personas', getPersonas);

module.exports = router;