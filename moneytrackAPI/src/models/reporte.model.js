const pool = require('../config/database');

class Reporte {

    static async resumen(usuario_id, mes, anio) {

        const [rows] = await pool.query(

            `SELECT

                SUM(
                    CASE
                        WHEN tm.nombre='Ingreso'
                        THEN m.monto
                        ELSE 0
                    END
                ) ingresos,

                SUM(
                    CASE
                        WHEN tm.nombre='Gasto'
                        THEN m.monto
                        ELSE 0
                    END
                ) gastos

            FROM movimientos m

            INNER JOIN categorias c
                ON m.categoria_id=c.id

            INNER JOIN tipos_movimiento tm
                ON c.tipo_movimiento_id=tm.id

            WHERE m.usuario_id=?

            AND MONTH(m.fecha)=?

            AND YEAR(m.fecha)=?`,

            [
                usuario_id,
                mes,
                anio
            ]

        );

        return rows[0];

    }

    static async gastosPorCategoria(usuario_id, mes, anio) {

        const [rows] = await pool.query(

            `SELECT

                c.nombre AS categoria,

                SUM(m.monto) AS total

            FROM movimientos m

            INNER JOIN categorias c

                ON m.categoria_id = c.id

            INNER JOIN tipos_movimiento tm

                ON c.tipo_movimiento_id = tm.id

            WHERE m.usuario_id = ?

            AND tm.nombre = 'Gasto'

            AND MONTH(m.fecha) = ?

            AND YEAR(m.fecha) = ?

            GROUP BY c.id, c.nombre

            ORDER BY total DESC`,

            [

                usuario_id,
                mes,
                anio

            ]

        );

        return rows;

    }

    static async detalleMovimientos(usuario_id, mes, anio) {

        const [rows] = await pool.query(

            `SELECT

                DATE_FORMAT(m.fecha,'%d/%m/%Y') AS fecha,

                tm.nombre AS tipo,

                c.nombre AS categoria,

                m.descripcion,

                m.monto

            FROM movimientos m

            INNER JOIN categorias c

                ON m.categoria_id = c.id

            INNER JOIN tipos_movimiento tm

                ON c.tipo_movimiento_id = tm.id

            WHERE

                m.usuario_id = ?

                AND MONTH(m.fecha)=?

                AND YEAR(m.fecha)=?

            ORDER BY m.fecha DESC`,

            [

                usuario_id,

                mes,

                anio

            ]

        );

        return rows;

    }

}

module.exports = Reporte;