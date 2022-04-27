const { Router } = require('express');

//Triggers controllers
const { 
    borrarAutomatico, 
    desbanear,
    avisoBaneo ,
    agendar
} = require('../controllers/trigger');

//Pruebas de paypal
const {
    crearOrden, capturarOrden
} = require('../controllers/pagos');

const router = Router();

//Banear automáticamente
router.get('/autoban', borrarAutomatico);

//Desbanear automáticamente
router.get('/desbanear', desbanear);

//Aviso de baneo autoban
router.get('/aviso', avisoBaneo);

//PAGOS PAYPAL PRUEBAS
router.post('/crearOrden', crearOrden);

//Capturar orden de pago
router.get('/capturarOrden', capturarOrden);

router.get('/crearEvento', agendar);

module.exports = router;
