const pool = require('../config/database');

class Categoria {

    static async obtenerTodas() {

        const [rows] = await pool.query(`
            SELECT
                c.id,
                c.nombre,
                c.descripcion,
                c.deducible,
                tm.nombre AS tipo_movimiento
            FROM categorias c
            INNER JOIN tipos_movimiento tm
                ON c.tipo_movimiento_id = tm.id
            WHERE c.estado = 1
            ORDER BY tm.nombre, c.nombre
        `);

        return rows;
    }

}

module.exports = Categoria;