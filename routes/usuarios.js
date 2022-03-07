//Librerías externas
const { Router } = require('express');
const session = require('session');
const { check } = require('express-validator');

//Validación de campos vacíos
const { validarCampos } = require('../middlewares/validar-campos');
//Validar campos correctos y sin repetir
const { esRoleValido, emailExiste, celularExiste } = require('../helpers/db-validator');
//Rutas y tipos de "Acceso"
const { 
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch, 
    busqueda
} = require('../controllers/usuarios');

//Router instance
const router = Router();

router.get('/', usuariosGet );

router.get('/busqueda', busqueda);

router.put('/:id', usuariosPut);

router.post('/', [
    check('correo').custom(emailExiste),
    check('celular').custom(celularExiste),
    validarCampos
], usuariosPost);

router.delete('/', usuariosDelete);

router.patch('/', usuariosPatch);

module.exports = router;