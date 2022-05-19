const { Router } = require('express');

//Funciones que puede acceder el invitado
const { postSolicitud } = require('../controllers/administrador');

//Modelos
const Cliente = require('../models/cliente');

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

router.put('/ultCon', async (req, res) => {
    const cliente = await Cliente.findById(req.query.id);
    const haceRato = new Date();
    cliente.ultima_conexion = haceRato.setDate(haceRato.getDate() - 200);
    cliente.avisado = false;

    await Cliente.findByIdAndUpdate(req.query.id, cliente);

    res.status(201).json({
        success: true,
        cliente
    })
})

module.exports = router;