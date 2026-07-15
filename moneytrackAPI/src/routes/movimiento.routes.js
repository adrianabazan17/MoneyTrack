const express = require('express');

const router = express.Router();

const verificarToken = require('../middlewares/auth.middleware');

const MovimientoController = require('../controllers/movimiento.controller');


router.get('/', verificarToken, MovimientoController.listar);

router.post('/', verificarToken, MovimientoController.crear);

router.get('/:id', verificarToken, MovimientoController.obtenerPorId);

router.put('/:id', verificarToken, MovimientoController.actualizar);

router.delete('/:id', verificarToken, MovimientoController.eliminar);



module.exports = router;