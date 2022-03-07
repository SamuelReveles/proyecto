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
    putResponderSolicitud
} = require('../controllers/administrador')

//Router instance
const router = Router();

router.get('/user/one', getUser);

router.get('/user', getAllUsers);

router.get('/soli', getSolicitudes);

router.get('/nutriologo', getAllNutri);

router.get('/nutriologo/one', getNutriologo);

router.post('/soli', postSolicitud);

router.put('/soli', putResponderSolicitud);

//Expor instance
module.exports = router;