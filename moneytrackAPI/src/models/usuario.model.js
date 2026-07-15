const pool = require('../config/database');

class Usuario {

    static async obtenerPorCorreo(correo) {

        const [rows] = await pool.query(
            'SELECT * FROM usuarios WHERE correo = ?',
            [correo]
        );

        return rows[0];

    }

    static async crear(usuario) {

        const { nombres, apellidos, correo, password } = usuario;

        const [result] = await pool.query(
            `INSERT INTO usuarios
            (nombres, apellidos, correo, password)
            VALUES (?, ?, ?, ?)`,
            [nombres, apellidos, correo, password]
        );

        return result.insertId;

    }

    static async obtenerPorId(id) {

        const [rows] = await pool.query(

            'SELECT * FROM usuarios WHERE id = ?',

            [id]

        );

        return rows[0];

    }

    static async actualizarPassword(id, password) {

        const [result] = await pool.query(

            `UPDATE usuarios
            SET password = ?
            WHERE id = ?`,

            [

                password,

                id

            ]

        );

        return result.affectedRows;

    }

}

module.exports = Usuario;