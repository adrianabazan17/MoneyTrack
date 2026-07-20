const express = require('express');

const router = express.Router();

const verificarToken = require('../middlewares/auth.middleware');

const ReporteController = require('../controllers/reporte.controller');

router.get(
    '/resumen',
    verificarToken,
    ReporteController.resumen
);

router.get(
    '/gastos-categoria',
    verificarToken,
    ReporteController.gastosPorCategoria
);

router.get(
    '/detalle',
    verificarToken,
    ReporteController.detalle
);

module.exports = router;