const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/auth.controller');
const verificarToken = require('../middlewares/auth.middleware');

router.post('/register', AuthController.register);

router.post('/login', AuthController.login);

router.put('/password', verificarToken, AuthController.cambiarPassword);

module.exports = router;