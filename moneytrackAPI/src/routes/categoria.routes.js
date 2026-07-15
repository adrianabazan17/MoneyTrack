const express = require('express');

const router = express.Router();

const CategoriaController = require('../controllers/categoria.controller');

const verificarToken = require('../middlewares/auth.middleware');

router.get('/', verificarToken, CategoriaController.listar);

module.exports = router;