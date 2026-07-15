const pool = require('../config/database');

class Movimiento {

    static async crear(data) {

        const {
            usuario_id,
            categoria_id,
            descripcion,
            monto,
            fecha,
            observacion
        } = data;

        const [result] = await pool.query(

            `INSERT INTO movimientos
            (usuario_id,categoria_id,descripcion,monto,fecha,observacion)
            VALUES (?,?,?,?,?,?)`,

            [
                usuario_id,
                categoria_id,
                descripcion,
                monto,
                fecha,
                observacion
            ]

        );

        return result.insertId;

    }

    static async listar(usuario_id, filtros) {

        let sql = `
            SELECT
                m.id,
                tm.nombre AS tipo_movimiento,
                c.id AS categoria_id,
                c.nombre AS categoria,
                c.deducible,
                m.descripcion,
                m.monto,
                DATE_FORMAT(m.fecha, '%Y-%m-%d') AS fecha,
                m.observacion
            FROM movimientos m
            INNER JOIN categorias c
                ON m.categoria_id = c.id
            INNER JOIN tipos_movimiento tm
                ON c.tipo_movimiento_id = tm.id
            WHERE m.usuario_id = ?
        `;

        const params = [usuario_id];

        if (filtros.buscar) {

            sql += ` AND m.descripcion LIKE ?`;

            params.push(`%${filtros.buscar}%`);

        }

        if (filtros.tipo) {

            sql += ` AND tm.nombre = ?`;

            params.push(filtros.tipo);

        }

        if (filtros.categoria) {

            sql += ` AND c.id = ?`;

            params.push(filtros.categoria);

        }

        if (filtros.desde) {

            sql += ` AND m.fecha >= ?`;

            params.push(filtros.desde);

        }

        if (filtros.hasta) {

            sql += ` AND m.fecha <= ?`;

            params.push(filtros.hasta);

        }

        sql += ` ORDER BY m.fecha DESC, m.id DESC`;

        const [rows] = await pool.query(

            sql,

            params

        );

        return rows;

    }

    static async actualizar(id, usuario_id, data) {

        const {
            categoria_id,
            descripcion,
            monto,
            fecha,
            observacion
        } = data;

        const [result] = await pool.query(

            `UPDATE movimientos
            SET categoria_id = ?,
                descripcion = ?,
                monto = ?,
                fecha = ?,
                observacion = ?
            WHERE id = ? AND usuario_id = ?`,

            [
                categoria_id,
                descripcion,
                monto,
                fecha,
                observacion,
                id,
                usuario_id
            ]

        );

        return result.affectedRows;

    }

    static async eliminar(id, usuario_id) {

        const [result] = await pool.query(

            `DELETE FROM movimientos
            WHERE id = ? AND usuario_id = ?`,

            [id, usuario_id]

        );

        return result.affectedRows;

    }

    static async obtenerPorId(id, usuario_id) {

        const [rows] = await pool.query(

            `SELECT *
            FROM movimientos
            WHERE id = ?
            AND usuario_id = ?`,

            [id, usuario_id]

        );

        return rows[0];

    }

}

module.exports = Movimiento;