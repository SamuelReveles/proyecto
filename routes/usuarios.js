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
    sendCode,
    verifyCode,
    usuariosPost,
    usuariosDelete,
    usuariosPatch, 
    busqueda,
    getProgreso,
    altaExtras,
    reportar,
    calificar
} = require('../controllers/usuarios');

//Router instance
const router = Router();

//Enviar código al celular
router.get('/sendCode',  sendCode);

//Verificar el código
router.get('/verifyCode', verifyCode);

//Buscar un nutriólogo
router.get('/busqueda', busqueda);

//Extraer el progreso
router.get('/progreso', getProgreso);

//Calificar a un nutriólogo
router.put('/calificar', calificar);

//Dar de alta un nuevo extra
router.post('/extra/alta', altaExtras);

//Crear un nuevo usuario
router.post('/', [
    check('correo').custom(emailExiste),
    check('celular').custom(celularExiste),
    validarCampos
], usuariosPost);

//Reportar
router.put('/reportar', reportar);

router.delete('/', usuariosDelete);

router.patch('/', usuariosPatch);

module.exports = router;