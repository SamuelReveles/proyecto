//Librerías externas
const { Router } = require('express');
const { check } = require('express-validator');

//Validación de campos vacíos
const { validarCampos } = require('../middlewares/validar-campos');

const { validarToken, verificarCliente } = require('../middlewares/validar-jwt');

//Rutas y tipos de "Acceso"
const { 
    usuariosUpdate,
    usuariosDelete,
    usuariosPatch, 
    busqueda,
    getNutriologo,
    getProgreso,
    altaExtras,
    getExtras,
    getInfo,
    reportar,
    calificar,
    mostrarHistorial,
    verHistorialPagos
} = require('../controllers/usuarios');

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
router.put('/calificar', calificar);

//Dar de alta un nuevo extra
router.post('/extra/alta', altaExtras);

//Ver extras del cliente
router.get('/extra', getExtras);

//Actualizar datos
router.put('/', usuariosUpdate);

//Reportar
router.put('/reportar', reportar);

//Eliminar cuenta
router.delete('/', usuariosDelete);

//Ver historial del cliente
router.get('/historial', mostrarHistorial);

//Ver historial de pagos del cliente
router.get('/pagos', verHistorialPagos);

router.patch('/', usuariosPatch);

module.exports = router;