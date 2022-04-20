//Librerías externas
const { Router } = require('express');
const { check } = require('express-validator');

//Validación de campos vacíos
const { validarCampos } = require('../middlewares/validar-campos');

const { validarToken } = require('../middlewares/validar-jwt');

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
    calificar
} = require('../controllers/usuarios');

//Router instance
const router = Router();

//Verificar que exista sesión iniciada el token
//GODO COMENTA LA LINEA DE ABAJO SI ES QUE TE DICE QUE NO TIENES TOKEN XD
router.use(validarToken);


//Buscar un nutriólogo
router.get('/busqueda', busqueda);

//Ver datos del nutriólogo
router.get('/nutriologo', getNutriologo);

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

router.delete('/', usuariosDelete);

router.patch('/', usuariosPatch);

module.exports = router;