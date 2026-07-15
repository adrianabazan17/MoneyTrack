const Usuario = require('../models/usuario.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthController {

    static async register(req, res) {

        try {

            const { nombres, apellidos, correo, password } = req.body;

            if (!nombres || !apellidos || !correo || !password) {

                return res.status(400).json({
                    success: false,
                    message: 'Todos los campos son obligatorios.'
                });

            }

            const existe = await Usuario.obtenerPorCorreo(correo);

            if (existe) {

                return res.status(409).json({
                    success: false,
                    message: 'El correo ya está registrado.'
                });

            }

            const passwordHash = await bcrypt.hash(password, 10);

            const id = await Usuario.crear({
                nombres,
                apellidos,
                correo,
                password: passwordHash
            });

            res.status(201).json({
                success: true,
                message: 'Usuario registrado correctamente.',
                id
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                success: false,
                message: 'Error del servidor.'
            });

        }

    }

    static async login(req, res) {

        try {

            const { correo, password } = req.body;

            const usuario = await Usuario.obtenerPorCorreo(correo);

            if (!usuario) {

                return res.status(401).json({
                    success: false,
                    message: 'Credenciales incorrectas.'
                });

            }

            const valido = await bcrypt.compare(password, usuario.password);

            if (!valido) {

                return res.status(401).json({
                    success: false,
                    message: 'Credenciales incorrectas.'
                });

            }

            const token = jwt.sign(
                {
                    id: usuario.id,
                    correo: usuario.correo
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: '8h'
                }
            );

            res.json({
                success: true,
                token,
                usuario: {
                    id: usuario.id,
                    nombres: usuario.nombres,
                    apellidos: usuario.apellidos,
                    correo: usuario.correo
                }
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                success: false,
                message: 'Error del servidor.'
            });

        }

    }

    static async cambiarPassword(req, res) {

        try {

            const usuarioId = req.usuario.id;

            const {

                passwordActual,

                passwordNueva

            } = req.body;

            if (!passwordActual || !passwordNueva) {

                return res.status(400).json({

                    success: false,

                    message: 'Complete todos los campos.'

                });

            }

            const usuario = await Usuario.obtenerPorId(usuarioId);

            if (!usuario) {

                return res.status(404).json({

                    success: false,

                    message: 'Usuario no encontrado.'

                });

            }

            const coincide = await bcrypt.compare(

                passwordActual,

                usuario.password

            );

            if (!coincide) {

                return res.status(401).json({

                    success: false,

                    message: 'La contraseña actual es incorrecta.'

                });

            }

            const nuevaHash = await bcrypt.hash(

                passwordNueva,

                10

            );

            await Usuario.actualizarPassword(

                usuarioId,

                nuevaHash

            );

            res.json({

                success: true,

                message: 'Contraseña actualizada correctamente.'

            });

        } catch (error) {

            console.error(error);

            res.status(500).json({

                success: false,

                message: 'Error del servidor.'

            });

        }

    }

}

module.exports = AuthController;