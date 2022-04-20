const { Router } = require('express');
const { check } = require('express-validator');

//Middlewares
//Validación de campos
const { 
    validarCampos, 
    validarEspecialidades,
    validarCorreo,
    validarCelular
     } = require('../middlewares/validar-campos');

//Funciones
const { sendCode, verifyCode } = require('../helpers/verificacion');
const { nutriologoPost } = require('../controllers/nutriologo');
const { usuariosPost } = require('../controllers/usuarios');
const { postAdmin } = require('../controllers/administrador');
const { logIn, logOut } = require('../controllers/sesiones');

const router = Router();

//Enviar código al celular
router.get('/sendCode',  sendCode);

//Verificar el código
router.get('/verifyCode', verifyCode);

//Crear un nuevo usuario
router.post('/cliente', [
    validarCampos,
    validarCorreo,
    validarCelular
], usuariosPost);

//Crear un nuevo nutriólogo
router.post('/nutriologo', [
    validarCorreo,
    validarCelular
    //validarEspecialidades
], nutriologoPost);

//Crear nuevo administrador
router.post('/administrador',[
    validarCorreo,
    validarCelular
], postAdmin);

//Log in o registro
router.post('/logIn', [
    check('id_token', 'El id_token es necesario').not().isEmpty()
],logIn);

module.exports = router;