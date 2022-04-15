//Librerías externas
const { Router } = require('express');
const { check } = require('express-validator');

const { emailExiste, celularExiste } = require('../helpers/db-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { 
    nutriologoPost,
    nutriologoDelete,
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

//Verificacion de celular
const {
    verifyCode,
    sendCode,
} = require('../helpers/verificacion');

const router = Router();

//Crear un nuevo nutriólogo dentro de la DB
router.post('/', nutriologoPost);

//Eliminar al nutriólogo
router.delete('/', nutriologoDelete);

//Obtener datos de un cliente (Paciente para un nutriólogo)
router.get('/cliente', getClientData);

//Enviar código de verificación
router.get('/sendCode', sendCode);

//Validar código de verificación
router.get('/verifyCode', verifyCode);

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