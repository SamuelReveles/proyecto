//Librerías externas
const { Router } = require('express');
const { check } = require('express-validator');

//Validación de campos vacíos
const { validarCampos, validarBanCliente } = require('../middlewares/validar-campos');

const { validarToken, verificarCliente } = require('../middlewares/validar-jwt');

//Rutas y tipos de "Acceso"
const { 
    usuariosPost,
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
    getMotivosUsuario
} = require('../controllers/usuarios');

//Paypal
const {
    crearOrden, 
    capturarOrden,
    ordenPagada
} = require('../controllers/pagos');

//Router instance
const router = Router();

//Verificar que exista sesión iniciada el token
//GODO COMENTA LA LINEA DE ABAJO SI ES QUE TE DICE QUE NO TIENES TOKEN XD
router.use(validarToken);
router.use(verificarCliente);

//Extraer el progreso
router.get('/progreso', getProgreso);

//Ver datos de la cuenta
router.get('/data', getInfo);

//Calificar a un nutriólogo
router.put('/calificar', [validarBanCliente], calificar);

//Dar de alta un nuevo extra
router.post('/extra/alta', [validarBanCliente], altaExtras);

//Ver extras del cliente
router.get('/extra', [validarBanCliente], getExtras);

//Actualizar datos
router.put('/', [validarBanCliente], usuariosUpdate);

//Reportar
router.put('/reportar', [validarBanCliente], reportar);

//Eliminar cuenta
router.delete('/', [validarBanCliente], usuariosDelete);

//Ver historial del cliente
router.get('/historial', mostrarHistorial);

//Ver registro de pagos del cliente
router.get('/registroPagos', listadoPagos);

//Ver historial de pagos del cliente
router.get('/pagos', verHistorialPagos);

//Agregar a historial de pagos posteriomente a pagar
router.post('/pagos', ordenPagada);

//Crear orden de paypal (paso para el check-in)
router.post('/crearOrden', [validarBanCliente], crearOrden);

//Capturar orden de pago
router.get('/capturarOrden', capturarOrden);

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

module.exports = router;