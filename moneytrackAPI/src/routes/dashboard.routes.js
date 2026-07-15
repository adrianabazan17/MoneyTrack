const express = require('express');

const router = express.Router();

const DashboardController = require('../controllers/dashboard.controller');
const verificarToken = require('../middlewares/auth.middleware');

router.get('/', verificarToken, DashboardController.obtenerResumen);

module.exports = router;