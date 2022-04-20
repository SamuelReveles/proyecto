//Librerías externas
const { Router } = require('express');
const { check } = require('express-validator');

//Middlewares
const { validarCampos } = require('../middlewares/validar-campos');

const { 
    nutriologoUpdate,
    nutriologoDelete,
    nutriologoUpdateServicio,
    getInfo,
    postPredeterminado,
    getPredeterminados,
    getPredeterminado,
    putActualizarDatos,
    putPredeterminado,
    deletePredeterminado,
    putAgregarEvento,
    putActualizarEvento,
    getClientData,
    getPacientes,
    updateClientData,
    reportar
} = require('../controllers/nutriologo');

const { validarToken } = require('../middlewares/validar-jwt');

const router = Router();

//Verificar que exista sesión iniciada el token
//GODO COMENTA LA LINEA DE ABAJO SI ES QUE TE DICE QUE NO TIENES TOKEN XD (ESO O INICIA SESIÓN ANTES DE HACER LAS COSAS (EL TOKEN DURA 8HRS))
router.use(validarToken);

//Actualizar datos básicos del nutriólogo
router.put('/', nutriologoUpdate);

//Actualizar información de servicio
router.put('/servicio', nutriologoUpdateServicio);

//Eliminar al nutriólogo
router.delete('/', nutriologoDelete);

//Obtener datos de un cliente (Paciente para un nutriólogo)
router.get('/cliente', getClientData);

//Obtener listado de pacientes
router.get('/pacientes', getPacientes);

//Actualizar datos de un cliente
router.put('/cliente', updateClientData);

//Crear alimento predeterminado
router.post('/predeterminado', postPredeterminado);

//Actualizar predeterminado
router.put('/predeterminado', putPredeterminado);

//Obtener los predeterminados
router.get('/predeterminado', getPredeterminados);

//Buscar un solo predeterminado
router.get('/predeterminado/uno', getPredeterminado);

//Eliminar un alimento predeterminado
router.delete('/predeterminado', deletePredeterminado);

//Actualizar datos de la cuenta
router.put('/update', putActualizarDatos);

//Ver datos de la cuenta
router.get('/data', getInfo);

//Reportar a un usuario
router.put('/reportar', reportar);

module.exports = router;