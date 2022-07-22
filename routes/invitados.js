const { Router } = require('express');

//Funciones que puede acceder el invitado
const { postSolicitud } = require('../controllers/administrador');

const {
    busqueda,
    getNutriologo
} = require('../controllers/usuarios');

const {
    validarCorreo,
    validarCelular
} = require('../middlewares/validar-campos');

const { capturarOrden } = require('../controllers/pagos');

const router = Router();

//Capturar orden de pago
router.get('/capturarOrden', capturarOrden);

//Buscar un nutriólogo
router.get('/busqueda', busqueda);

//Ver datos del nutriólogo
router.get('/nutriologo', getNutriologo);

//Crear una nueva solicitud
router.post('/soli',[
    validarCorreo,
    validarCelular
], postSolicitud);

module.exports = router;