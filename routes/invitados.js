const { Router } = require('express');

//Funciones que puede ver el invitado
const {
    busqueda,
    getNutriologo
} = require('../controllers/usuarios');

const router = Router();

//Buscar un nutriólogo
router.get('/busqueda', busqueda);

//Ver datos del nutriólogo
router.get('/nutriologo', getNutriologo);

module.exports = router;