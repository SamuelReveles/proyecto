//Librerías externas  
const { Router } = require('express');

//Functions
const {
    getUser,
    getAllUsers,
    getSolicitudes,
    postSolicitud,
    getAllNutri,
    getNutriologo,
    putResponderSolicitud,
    solicitudAccepted,
    solicitudDenied,
    adminUpdate,
    addReporte,
    getReportes,
    updateReporte,
    reportesUsuario,
    banear,
    postAdmin,
    borrarReporte
} = require('../controllers/administrador')

//Router instance
const router = Router();

//Crear administrador
router.post('/', postAdmin);

//Busar un usuario
router.get('/user/one', getUser);

//Banear a un usuario
router.put('/banear', banear);

//Listado de todos los usuarios
router.get('/user', getAllUsers);

//Buscar todas las solicitudes sin responder
router.get('/soli', getSolicitudes);

//Aceptar la solicitud
router.put('/soli/accepted', solicitudAccepted);

//Denegar solicitud
router.post('/soli/denied', solicitudDenied);
 
//Listado de todos los nutriólogos
router.get('/nutriologo', getAllNutri);

//Buscar un solo nutriólogo
router.get('/nutriologo/one', getNutriologo);

//Crear una nueva solicitud
router.post('/soli', postSolicitud);

//Responder solicitud
router.put('/soli', putResponderSolicitud);

//Update de datos de la cuenta
router.put('/update', adminUpdate);

//Crear un nuevo reporte
router.post('/reporte/nuevo', addReporte);

//Ver los reportes existentes
router.get('/reporte', getReportes);

//Modificar un reporte
router.put('/reporte', updateReporte);

//Ver reportes de un usuario
router.get('/reporte/user', reportesUsuario);

//Eliminar un reporte
router.put('/reporte/quitar', borrarReporte);

//Exportar instancia
module.exports = router;