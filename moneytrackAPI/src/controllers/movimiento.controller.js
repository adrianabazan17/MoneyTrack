const Movimiento = require('../models/movimiento.model');

class MovimientoController {

    static async crear(req, res) {

        try {

            const usuario_id = req.usuario.id;

            const {
                categoria_id,
                descripcion,
                monto,
                fecha,
                observacion
            } = req.body;

            if (!categoria_id || !descripcion || !monto || !fecha) {

                return res.status(400).json({
                    success: false,
                    message: 'Complete todos los campos obligatorios.'
                });

            }

            const id = await Movimiento.crear({

                usuario_id,
                categoria_id,
                descripcion,
                monto,
                fecha,
                observacion

            });

            res.status(201).json({

                success: true,
                message: 'Movimiento registrado correctamente.',
                id

            });

        } catch (error) {

            console.error(error);

            res.status(500).json({

                success: false,
                message: 'Error al registrar el movimiento.'

            });

        }

    }

    static async listar(req, res) {

        try {

            const usuario_id = req.usuario.id;

            const filtros = {

                buscar: req.query.buscar || '',

                tipo: req.query.tipo || '',

                categoria: req.query.categoria || '',

                desde: req.query.desde || '',

                hasta: req.query.hasta || ''

            };

            const movimientos = await Movimiento.listar(

                usuario_id,

                filtros

            );

            res.json({

                success: true,

                data: movimientos

            });

        } catch (error) {

            console.error(error);

            res.status(500).json({

                success: false,

                message: 'Error al obtener los movimientos.'

            });

        }

    }

    static async actualizar(req, res) {

        try {

            const usuario_id = req.usuario.id;
            const id = req.params.id;

            const filas = await Movimiento.actualizar(
                id,
                usuario_id,
                req.body
            );

            if (filas === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Movimiento no encontrado.'
                });
            }

            res.json({
                success: true,
                message: 'Movimiento actualizado correctamente.'
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                success: false,
                message: 'Error al actualizar el movimiento.'
            });

        }

    }

    static async eliminar(req, res) {

        try {

            const usuario_id = req.usuario.id;
            const id = req.params.id;

            const filas = await Movimiento.eliminar(id, usuario_id);

            if (filas === 0) {

                return res.status(404).json({
                    success: false,
                    message: 'Movimiento no encontrado.'
                });

            }

            res.json({
                success: true,
                message: 'Movimiento eliminado correctamente.'
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                success: false,
                message: 'Error al eliminar el movimiento.'
            });

        }

    }

    static async obtenerPorId(req, res) {

        try {

            const usuario_id = req.usuario.id;

            const movimiento = await Movimiento.obtenerPorId(

                req.params.id,
                usuario_id

            );

            if (!movimiento) {

                return res.status(404).json({

                    success: false,
                    message: 'Movimiento no encontrado.'

                });

            }

            res.json({

                success: true,
                data: movimiento

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

module.exports = MovimientoController;