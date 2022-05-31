const { Router } = require('express');

//Triggers controllers
const { 
    borrarAutomatico, 
    desbanear,
    avisoBaneo
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

module.exports = router;
