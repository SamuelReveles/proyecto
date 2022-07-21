//Librerías externas
const { Router } = require('express');

//Middlewares
const { validarBanNutriologo } = require('../middlewares/validar-campos');

const { 
    nutriologoUpdate,
    nutriologoDelete,
    nutriologoUpdateServicio,
    getInfo,
    postPredeterminado,
    getPredeterminados,
    getPredeterminado,
    putPredeterminado,
    deletePredeterminado,
    getClientData,
    getPacientes,
    updateClientData,
    reportar,
    llenarCalendario,
    getMotivosNutriologo,
    fechasUpdate,
    getFechas,
    getReagendaciones,
    solicitarReagendacion,
    rechazarSolicitud,
    aceptarSolicitud
} = require('../controllers/nutriologo');

const { mostrarHistorial, getDietas } = require('../controllers/usuarios');

const { validarToken, verificarNutriologo } = require('../middlewares/validar-jwt');

const { verNotificaciones } = require('../helpers/verificacion');

const router = Router();

//Verificar que exista sesión iniciada el token
router.use(validarToken);
router.use(verificarNutriologo);

//Actualizar datos básicos del nutriólogo
router.put('/', [validarBanNutriologo], nutriologoUpdate);

//Actualizar información de servicio
router.put('/servicio', nutriologoUpdateServicio);

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

//Ver datos de la cuenta
router.get('/data', getInfo);

//Reportar a un usuario
router.put('/reportar', [validarBanNutriologo], reportar);

//Lista de dietas del cliente
router.get('/dietas', getDietas);

//PDF de dieta de cliente
router.get('/historial', mostrarHistorial);

//Llenar calendario del cliente
router.put('/llenarCalendario', llenarCalendario);

//Ver motivos de reporte
router.get('/motivos', getMotivosNutriologo);

//Actualizar fechas del nutriólogo
router.put('/fechas', fechasUpdate);

//Ver la configuración de fechas
router.get('/fechas', getFechas);

//Marcar vistas las notificaciones
router.put('/notificaciones', verNotificaciones);

//Ver solicitudes de reagendación
router.get('/reagendar', getReagendaciones);

//Solicitar reagendación
router.post('/reagendar', solicitarReagendacion);

//Denegar reagendación
router.put('/denegar', rechazarSolicitud);

//Aceptar reagendación
router.put('/aceptar', aceptarSolicitud);

module.exports = router;