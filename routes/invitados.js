const { Router } = require('express');

//Funciones que puede acceder el invitado
const { postSolicitud } = require('../controllers/administrador');

//Modelos
const Cliente = require('../models/cliente');
const Nutriologo = require('../models/nutriologo');

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

router.put('/ultCon', async (req, res) => {
    
    let cliente = await Cliente.findById(req.query.id);
    const haceRato = new Date();

    if(!cliente) {
        cliente = await Nutriologo.findById(req.query.id);
        cliente.ultima_conexion = haceRato.setDate(haceRato.getDate() - 200);
        cliente.avisado = false;
        await Nutriologo.findByIdAndUpdate(req.query.id, cliente);
    }
    else {
        cliente.ultima_conexion = haceRato.setDate(haceRato.getDate() - 200);
        cliente.avisado = false;
        await Cliente.findByIdAndUpdate(req.query.id, cliente);
    }

    res.status(201).json({
        success: true,
        cliente
    });
})

module.exports = router;