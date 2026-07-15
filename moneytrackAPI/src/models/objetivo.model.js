const pool = require('../config/database');

class Objetivo {

    static async crear(data) {

        const {
            usuario_id,
            nombre,
            descripcion,
            monto_meta,
            fecha_limite
        } = data;

        const [result] = await pool.query(

            `INSERT INTO objetivos_ahorro
            (usuario_id,nombre,descripcion,monto_meta,fecha_limite)
            VALUES (?,?,?,?,?)`,

            [
                usuario_id,
                nombre,
                descripcion,
                monto_meta,
                fecha_limite
            ]

        );

        return result.insertId;

    }

    static async listar(usuario_id) {

    const [rows] = await pool.query(

        `SELECT *,
                ROUND((monto_actual / monto_meta) * 100, 2) AS progreso,

                CASE
                    WHEN monto_actual >= monto_meta
                    THEN 'Completado'
                    ELSE 'Pendiente'
                END AS estado

         FROM objetivos_ahorro

         WHERE usuario_id = ?

         ORDER BY created_at DESC`,

        [usuario_id]

    );

    return rows;

}

    static async obtenerPorId(id, usuario_id) {

        const [rows] = await pool.query(

            `SELECT *,

                    CASE
                        WHEN monto_actual >= monto_meta
                        THEN 'Completado'
                        ELSE 'Pendiente'
                    END AS estado

            FROM objetivos_ahorro

            WHERE id = ?

            AND usuario_id = ?`,

            [

                id,

                usuario_id

            ]

        );

        return rows[0];

    }

    static async actualizar(id, usuario_id, data) {

        const {
            nombre,
            descripcion,
            monto_meta,
            fecha_limite
        } = data;

        const [result] = await pool.query(

            `UPDATE objetivos_ahorro
            SET nombre=?,
                descripcion=?,
                monto_meta=?,
                fecha_limite=?
            WHERE id=?
            AND usuario_id=?`,

            [
                nombre,
                descripcion,
                monto_meta,
                fecha_limite,
                id,
                usuario_id
            ]

        );

        return result.affectedRows;

    }

    static async eliminar(id, usuario_id) {

        const [result] = await pool.query(

            `DELETE FROM objetivos_ahorro
            WHERE id=?
            AND usuario_id=?`,

            [
                id,
                usuario_id
            ]

        );

        return result.affectedRows;

    }

    static async agregarAhorro(id, monto) {

        await pool.query(

            `UPDATE objetivos_ahorro
            SET monto_actual = monto_actual + ?
            WHERE id = ?`,

            [monto, id]

        );

        await pool.query(

            `UPDATE objetivos_ahorro
            SET estado = CASE
                WHEN monto_actual >= monto_meta
                THEN 'Completado'
                ELSE 'Pendiente'
            END
            WHERE id = ?`,

            [id]

        );

    }

}

module.exports = Objetivo;