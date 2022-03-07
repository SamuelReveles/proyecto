//Librerías externas
const { Router } = require('express');
const { check } = require('express-validator');

const { emailExiste, celularExiste } = require('../helpers/db-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { 
    nutriologoPost,
    putPredeterminado,
    getPredeterminado,
    getPredeterminados,
    putActualizarDatos
} = require('../controllers/nutriologo');

const router = Router();

router.post('/',[
    check('correo', emailExiste),
    check('celular', celularExiste),
    validarCampos
], nutriologoPost);

router.put('/predeterminado', putPredeterminado);

router.get('/predeterminado', getPredeterminados);

router.get('/predeterminado/uno', getPredeterminado);

router.put('/update', putActualizarDatos);

module.exports = router;