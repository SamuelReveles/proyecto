//Librerías externas
const { Router } = require('express');
const session = require('session');
const { check } = require('express-validator');

//Validación de campos vacíos
const { validarCampos } = require('../middlewares/validar-campos');

//Validar campos correctos y sin repetir
const { emailExiste, celularExiste } = require('../helpers/db-validator');

//Rutas y tipos de "Acceso"
const { 
    usuariosPost,
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

//Verificacion de celular
const {
    verifyCode,
    sendCode,
} = require('../helpers/verificacion');

//Router instance
const router = Router();

//Enviar código al celular
router.get('/sendCode',  sendCode);

//Verificar el código
router.get('/verifyCode', verifyCode);

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

//Crear un nuevo usuario
router.post('/', [
    check('correo').custom(emailExiste),
    check('celular').custom(celularExiste),
    validarCampos
], usuariosPost);

//Actualizar datos
router.put('/', usuariosUpdate);

//Reportar
router.put('/reportar', reportar);

router.delete('/', usuariosDelete);

router.patch('/', usuariosPatch);

module.exports = router;