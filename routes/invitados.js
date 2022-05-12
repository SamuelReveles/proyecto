const { Router } = require('express');

//Funciones que puede acceder el invitado

const { postSolicitud } = require('../controllers/administrador');

const {
    busqueda,
    getNutriologo
} = require('../controllers/usuarios');

const router = Router();

//Buscar un nutriólogo
router.get('/busqueda', busqueda);

//Ver datos del nutriólogo
router.get('/nutriologo', getNutriologo);

//Crear una nueva solicitud
router.post('/soli', postSolicitud);

module.exports = router;