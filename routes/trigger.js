const { Router } = require('express');

//Triggers controllers
const { 
    baneoAutomatico, 
    desbanear,
    avisoBaneo 
} = require('../controllers/trigger');

const router = Router();

//Banear automáticamente
router.get('/autoban', baneoAutomatico);

//Desbanear automáticamente
router.get('/desbanear', desbanear);

//Aviso de baneo autoban
router.get('/aviso', avisoBaneo);

module.exports = router;
