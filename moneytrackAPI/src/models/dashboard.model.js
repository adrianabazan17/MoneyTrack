const pool = require('../config/database');

class Dashboard {

    static async obtenerResumen(usuario_id) {

        const [totales] = await pool.query(
            `
            SELECT
                SUM(CASE WHEN tm.nombre = 'Ingreso' THEN m.monto ELSE 0 END) AS totalIngresos,
                SUM(CASE WHEN tm.nombre = 'Gasto' THEN m.monto ELSE 0 END) AS totalGastos,
                COUNT(m.id) AS cantidadMovimientos
            FROM movimientos m
            INNER JOIN categorias c
                ON m.categoria_id = c.id
            INNER JOIN tipos_movimiento tm
                ON c.tipo_movimiento_id = tm.id
            WHERE m.usuario_id = ?
            `,
            [usuario_id]
        );

        const [ultimos] = await pool.query(
            `
            SELECT
                m.id,
                tm.nombre AS tipo_movimiento,
                c.nombre AS categoria,
                m.descripcion,
                m.monto,
                DATE_FORMAT(m.fecha, '%Y-%m-%d') AS fecha
            FROM movimientos m
            INNER JOIN categorias c
                ON m.categoria_id = c.id
            INNER JOIN tipos_movimiento tm
                ON c.tipo_movimiento_id = tm.id
            WHERE m.usuario_id = ?
            ORDER BY m.fecha DESC, m.id DESC
            LIMIT 5
            `,
            [usuario_id]
        );

        return {
            resumen: totales[0],
            ultimos
        };
    }

}

module.exports = Dashboard;