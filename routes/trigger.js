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
router.get('/inactividad', borrarAutomatico);

//Desbanear automáticamente
router.get('/desbanear', desbanear);

//Aviso de baneo autoban
router.get('/aviso', avisoBaneo);

router.get('/crearEvento', agendar);

module.exports = router;
