//Librerías externas  
const { Router } = require('express');

//Functions
const {
    getUser,
    getAllUsers,
    getSolicitudes,
    getAllNutri,
    getNutriologo,
    solicitudAccepted,
    solicitudDenied,
    adminUpdate,
    addMotivo,
    getMotivos,
    updateMotivo,
    reportesUsuario,
    UnBanear,
    borrarReporte,
    getInfo
} = require('../controllers/administrador');

//Helpers
const { validarToken, verificarAdmin } = require('../middlewares/validar-jwt');
const { validarCelular } = require('../middlewares/validar-campos');

//Router instance
const router = Router();

//Verificar que exista sesión iniciada el token
router.use(validarToken);
router.use(verificarAdmin);

//Busar un usuario
router.get('/user/one', getUser);

//Ver información de la cuenta
router.get('/data', getInfo);

//Banear a un usuario
router.put('/desbanear', UnBanear);

//Listado de todos los usuarios
router.get('/user', getAllUsers);

//Buscar todas las solicitudes sin responder
router.get('/soli', getSolicitudes);

//Aceptar la solicitud
router.post('/soli/accepted', solicitudAccepted);

//Denegar solicitud
router.put('/soli/denied', solicitudDenied);
 
//Listado de todos los nutriólogos
router.get('/nutriologo', getAllNutri);

//Buscar un solo nutriólogo
router.get('/nutriologo/one', getNutriologo);

//Update de datos de la cuenta
router.put('/update', validarCelular, adminUpdate);

//Crear un nuevo reporte
router.post('/reporte/nuevo', addMotivo);

//Ver los reportes existentes
router.get('/reporte', getMotivos);

//Modificar un reporte
router.put('/reporte', updateMotivo);

//Ver reportes de un usuario
router.get('/reporte/user', reportesUsuario);

//Eliminar un reporte
router.put('/reporte/quitar', borrarReporte);

//Exportar instancia
module.exports = router;