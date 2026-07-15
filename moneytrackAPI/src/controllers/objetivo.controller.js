const Objetivo = require('../models/objetivo.model');

class ObjetivoController {

    static async crear(req, res) {

        try {

            const usuario_id = req.usuario.id;

            const {
                nombre,
                descripcion,
                monto_meta,
                fecha_limite
            } = req.body;

            if (!nombre || !monto_meta) {

                return res.status(400).json({

                    success: false,
                    message: 'Complete los campos obligatorios.'

                });

            }

            const id = await Objetivo.crear({

                usuario_id,
                nombre,
                descripcion,
                monto_meta,
                fecha_limite

            });

            res.status(201).json({

                success: true,
                message: 'Objetivo creado correctamente.',
                id

            });

        } catch (error) {

            console.error(error);

            res.status(500).json({

                success: false,
                message: 'Error al crear el objetivo.'

            });

        }

    }

    static async listar(req, res) {

        try {

            const usuario_id = req.usuario.id;

            const objetivos = await Objetivo.listar(usuario_id);

            res.json({

                success: true,
                data: objetivos

            });

        } catch (error) {

            console.error(error);

            res.status(500).json({

                success: false,
                message: 'Error al obtener los objetivos.'

            });

        }

    }

    static async obtenerPorId(req, res) {

        try {

            const usuario_id = req.usuario.id;

            const objetivo = await Objetivo.obtenerPorId(

                req.params.id,
                usuario_id

            );

            if (!objetivo) {

                return res.status(404).json({

                    success: false,
                    message: 'Objetivo no encontrado.'

                });

            }

            res.json({

                success: true,
                data: objetivo

            });

        } catch (error) {

            console.error(error);

            res.status(500).json({

                success: false,
                message: 'Error del servidor.'

            });

        }

    }

    static async actualizar(req, res) {

        try {

            const usuario_id = req.usuario.id;

            const filas = await Objetivo.actualizar(

                req.params.id,
                usuario_id,
                req.body

            );

            if (filas === 0) {

                return res.status(404).json({

                    success: false,
                    message: 'Objetivo no encontrado.'

                });

            }

            res.json({

                success: true,
                message: 'Objetivo actualizado correctamente.'

            });

        } catch (error) {

            console.error(error);

            res.status(500).json({

                success: false,
                message: 'Error al actualizar el objetivo.'

            });

        }

    }

    static async eliminar(req, res) {

        try {

            const usuario_id = req.usuario.id;

            const filas = await Objetivo.eliminar(

                req.params.id,
                usuario_id

            );

            if (filas === 0) {

                return res.status(404).json({

                    success: false,
                    message: 'Objetivo no encontrado.'

                });

            }

            res.json({

                success: true,
                message: 'Objetivo eliminado correctamente.'

            });

        } catch (error) {

            console.error(error);

            res.status(500).json({

                success: false,
                message: 'Error al eliminar el objetivo.'

            });

        }

    }

    static async agregarAhorro(req, res) {

        try {

            const id = req.params.id;

            const { monto } = req.body;

            await Objetivo.agregarAhorro(id, monto);

            const objetivo = await Objetivo.obtenerPorId(

                id,

                req.usuario.id

            );

            res.json({

                success: true,

                message: 'Ahorro agregado correctamente.',

                completado: objetivo.estado === 'Completado',

                data: objetivo

            });

        } catch (error) {

            console.error(error);

            res.status(500).json({

                success: false,

                message: 'Error al agregar el ahorro.'

            });

        }

    }

}

module.exports = ObjetivoController;