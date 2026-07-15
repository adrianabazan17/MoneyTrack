const Reporte = require('../models/reporte.model');

class ReporteController {

    static async resumen(req, res) {

        try {

            const usuario_id = req.usuario.id;

            const mes = Number(req.query.mes);
            const anio = Number(req.query.anio);

            if (!mes || !anio) {

                return res.status(400).json({

                    success: false,
                    message: 'Debe enviar el mes y el año.'

                });

            }

            const resumen = await Reporte.resumen(

                usuario_id,
                mes,
                anio

            );

            const ingresos = Number(resumen.ingresos || 0);
            const gastos = Number(resumen.gastos || 0);

            res.json({

                success: true,

                data: {

                    ingresos,
                    gastos,
                    saldo: ingresos - gastos

                }

            });

        } catch (error) {

            console.error(error);

            res.status(500).json({

                success: false,
                message: 'Error al obtener el reporte.'

            });

        }

    }

    static async gastosPorCategoria(req, res) {

        try {

            const usuario_id = req.usuario.id;

            const mes = Number(req.query.mes);

            const anio = Number(req.query.anio);

            const datos = await Reporte.gastosPorCategoria(

                usuario_id,
                mes,
                anio

            );

            res.json({

                success: true,

                data: datos

            });

        } catch (error) {

            console.error(error);

            res.status(500).json({

                success: false,

                message: 'Error al obtener el reporte.'

            });

        }

    }

}

module.exports = ReporteController;