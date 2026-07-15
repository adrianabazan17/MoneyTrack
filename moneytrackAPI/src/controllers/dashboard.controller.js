const Dashboard = require('../models/dashboard.model');

class DashboardController {

    static async obtenerResumen(req, res) {

        try {

            const usuario_id = req.usuario.id;

            const resultado = await Dashboard.obtenerResumen(usuario_id);

            const ingresos = Number(resultado.resumen.totalIngresos || 0);
            const gastos = Number(resultado.resumen.totalGastos || 0);

            res.json({
                success: true,
                data: {
                    totalIngresos: ingresos,
                    totalGastos: gastos,
                    saldo: ingresos - gastos,
                    cantidadMovimientos: resultado.resumen.cantidadMovimientos,
                    ultimosMovimientos: resultado.ultimos
                }
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                success: false,
                message: 'Error al obtener el dashboard.'
            });

        }

    }

}

module.exports = DashboardController;