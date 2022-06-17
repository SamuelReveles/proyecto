//Librerías externas
const { Router } = require('express');
const { check } = require('express-validator');

//Middlewares
const { validarCampos, validarBanNutriologo } = require('../middlewares/validar-campos');

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
    getClientData,
    getPacientes,
    updateClientData,
    reportar,
    llenarCalendario,
    getMotivosNutriologo
} = require('../controllers/nutriologo');
const { mostrarHistorial } = require('../controllers/usuarios');

const { validarToken, verificarNutriologo } = require('../middlewares/validar-jwt');

const router = Router();

//Verificar que exista sesión iniciada el token
//GODO COMENTA LA LINEA DE ABAJO SI ES QUE TE DICE QUE NO TIENES TOKEN XD (ESO O INICIA SESIÓN ANTES DE HACER LAS COSAS (EL TOKEN DURA 8HRS))
router.use(validarToken);
router.use(verificarNutriologo);

//Actualizar datos básicos del nutriólogo
router.put('/', [validarBanNutriologo], nutriologoUpdate);

//Actualizar información de servicio
router.put('/servicio', [validarBanNutriologo], nutriologoUpdateServicio);

//Eliminar al nutriólogo
router.delete('/', [validarBanNutriologo], nutriologoDelete);

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
router.put('/update', [validarBanNutriologo], putActualizarDatos);

//Ver datos de la cuenta
router.get('/data', getInfo);

//Reportar a un usuario
router.put('/reportar', [validarBanNutriologo], reportar);

//Historial de cliente
router.get('/historial', mostrarHistorial);

//Llenar calendario del cliente
router.put('/llenarCalendario', llenarCalendario);

//Ver motivos de reporte
router.get('/motivos', getMotivosNutriologo)

module.exports = router;