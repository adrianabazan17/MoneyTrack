const express = require('express');

const router = express.Router();

const ObjetivoController = require('../controllers/objetivo.controller');

const auth = require('../middlewares/auth.middleware');

router.post(

    '/',

    auth,

    ObjetivoController.crear

);

router.get(

    '/',

    auth,

    ObjetivoController.listar

);

router.get(

    '/:id',

    auth,

    ObjetivoController.obtenerPorId

);

router.put(

    '/:id',

    auth,

    ObjetivoController.actualizar

);

router.delete(

    '/:id',

    auth,

    ObjetivoController.eliminar

);

router.post(

    '/:id/ahorro',

    auth,

    ObjetivoController.agregarAhorro

);

module.exports = router;